package com.example.cart.dto;

import com.example.cart.entity.Cart;
import com.example.cart.entity.CartItem;
import java.math.BigDecimal;
import java.util.List;

public record CartResponse(Long id, Long userId, List<CartItemResponse> items, BigDecimal total) {

    public static CartResponse from(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(CartItemResponse::from).toList();
        BigDecimal total = items.stream().map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(cart.getId(), cart.getUserId(), items, total);
    }

    public record CartItemResponse(Long productId, String productName, int quantity, BigDecimal unitPrice,
                                   BigDecimal lineTotal) {
        static CartItemResponse from(CartItem item) {
            BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return new CartItemResponse(item.getProductId(), item.getProductName(), item.getQuantity(),
                    item.getUnitPrice(), lineTotal);
        }
    }
}
