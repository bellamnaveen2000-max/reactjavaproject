package com.example.cart.service;

import com.example.cart.dto.AddCartItemRequest;
import com.example.cart.dto.CartResponse;
import com.example.cart.dto.ProductResponse;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class CartService {

    private final ProductClient productClient;
    private final CartWriter cartWriter;
    private final CartEventPublisher eventPublisher;
    private final Executor cartExecutor;

    public CartService(ProductClient productClient, CartWriter cartWriter, CartEventPublisher eventPublisher,
                       Executor cartExecutor) {
        this.productClient = productClient;
        this.cartWriter = cartWriter;
        this.eventPublisher = eventPublisher;
        this.cartExecutor = cartExecutor;
    }

    public CartResponse addItem(Long userId, AddCartItemRequest request) {
        CompletableFuture<ProductResponse> lookup = CompletableFuture.supplyAsync(
                () -> productClient.getProduct(request.productId()), cartExecutor);
        CompletableFuture<Boolean> requestValidation = CompletableFuture.supplyAsync(
                () -> request.quantity() != null && request.quantity() > 0, cartExecutor);
        CompletableFuture<Integer> existingQuantity = CompletableFuture.supplyAsync(
                () -> cartWriter.currentQuantity(userId, request.productId()), cartExecutor);
        CompletableFuture<ProductResponse> validated = lookup.thenCombineAsync(
                requestValidation.thenCombineAsync(existingQuantity, (valid, quantity) -> new Validation(valid, quantity),
                        cartExecutor),
                (product, validation) -> {
            if (!validation.valid()) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }
            if (request.quantity() + validation.existingQuantity() > product.stock()) {
                throw new IllegalArgumentException("Requested quantity exceeds available stock");
            }
            return product;
        }, cartExecutor);
        ProductResponse product;
        try {
            product = validated.join();
        } catch (CompletionException exception) {
            Throwable cause = exception.getCause();
            if (cause instanceof WebClientResponseException.NotFound) {
                throw new NoSuchElementException("Product " + request.productId() + " was not found");
            }
            if (cause instanceof IllegalArgumentException invalid) {
                throw invalid;
            }
            throw new ProductServiceUnavailableException("Product service request failed", cause);
        }
        CartResponse response = cartWriter.addItem(userId, product.id(), product.name(), request.quantity(), product.price());
        eventPublisher.publish(new CartEventPublisher.CartResponseEvent(
                response.id(), product.id(), request.quantity()));
        return response;
    }

    private record Validation(boolean valid, int existingQuantity) {
    }

    public CartResponse getCart(Long userId) {
        return cartWriter.getCart(userId);
    }

    public void removeItem(Long userId, Long productId) {
        cartWriter.removeItem(userId, productId);
    }
}
