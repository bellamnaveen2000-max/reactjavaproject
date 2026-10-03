package com.example.cart.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.cart.dto.AddCartItemRequest;
import com.example.cart.dto.CartResponse;
import com.example.cart.dto.ProductResponse;
import java.math.BigDecimal;
import java.util.concurrent.Executor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClientResponseException;

class CartServiceTests {

    private ProductClient productClient;
    private CartWriter cartWriter;
    private CartEventPublisher eventPublisher;
    private CartService service;

    @BeforeEach
    void setUp() {
        productClient = mock(ProductClient.class);
        cartWriter = mock(CartWriter.class);
        eventPublisher = mock(CartEventPublisher.class);
        Executor directExecutor = Runnable::run;
        service = new CartService(productClient, cartWriter, eventPublisher, directExecutor);
    }

    @Test
    void fetchesProductValidatesStockPersistsAndPublishesEvent() {
        ProductResponse product = new ProductResponse(7L, "Desk", new BigDecimal("12.50"), 5);
        CartResponse cart = new CartResponse(3L, 11L, java.util.List.of(), BigDecimal.ZERO);
        when(productClient.getProduct(7L)).thenReturn(product);
        when(cartWriter.addItem(11L, 7L, "Desk", 2, new BigDecimal("12.50"))).thenReturn(cart);

        CartResponse result = service.addItem(11L, new AddCartItemRequest(7L, 2));

        assertThat(result.id()).isEqualTo(3L);
        verify(eventPublisher).publish(new CartEventPublisher.CartResponseEvent(3L, 7L, 2));
    }

    @Test
    void rejectsQuantityAboveStockWithoutPersisting() {
        when(productClient.getProduct(7L)).thenReturn(new ProductResponse(7L, "Desk", BigDecimal.TEN, 1));

        assertThatThrownBy(() -> service.addItem(11L, new AddCartItemRequest(7L, 2)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("stock");
    }

    @Test
    void includesExistingCartQuantityWhenValidatingAvailableStock() {
        when(productClient.getProduct(7L)).thenReturn(new ProductResponse(7L, "Desk", BigDecimal.TEN, 3));
        when(cartWriter.currentQuantity(11L, 7L)).thenReturn(2);

        assertThatThrownBy(() -> service.addItem(11L, new AddCartItemRequest(7L, 2)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("stock");
    }

    @Test
    void translatesMissingProductToNotFound() {
        when(productClient.getProduct(7L)).thenThrow(WebClientResponseException.create(
                404, "Not Found", org.springframework.http.HttpHeaders.EMPTY, new byte[0], null));

        assertThatThrownBy(() -> service.addItem(11L, new AddCartItemRequest(7L, 1)))
                .isInstanceOf(java.util.NoSuchElementException.class);
    }
}
