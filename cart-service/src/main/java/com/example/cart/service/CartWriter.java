package com.example.cart.service;

import com.example.cart.dto.CartResponse;
import com.example.cart.entity.Cart;
import com.example.cart.repository.CartRepository;
import java.math.BigDecimal;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartWriter {

    private final CartRepository repository;

    public CartWriter(CartRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public CartResponse addItem(Long userId, Long productId, String productName, int quantity, BigDecimal unitPrice) {
        Cart cart = repository.findWithItemsByUserId(userId).orElseGet(() -> new Cart(userId));
        cart.addOrUpdateItem(productId, productName, quantity, unitPrice);
        return CartResponse.from(repository.save(cart));
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = repository.findWithItemsByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Cart for user " + userId + " was not found"));
        return CartResponse.from(cart);
    }

    @Transactional(readOnly = true)
    public int currentQuantity(Long userId, Long productId) {
        return repository.findWithItemsByUserId(userId)
                .flatMap(cart -> cart.getItems().stream()
                        .filter(item -> item.getProductId().equals(productId))
                        .findFirst())
                .map(item -> item.getQuantity())
                .orElse(0);
    }

    @Transactional
    public void removeItem(Long userId, Long productId) {
        Cart cart = repository.findWithItemsByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Cart for user " + userId + " was not found"));
        if (!cart.removeItem(productId)) {
            throw new NoSuchElementException("Product " + productId + " is not in the cart");
        }
        repository.save(cart);
    }
}
