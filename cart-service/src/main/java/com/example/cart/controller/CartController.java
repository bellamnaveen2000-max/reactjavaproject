package com.example.cart.controller;

import com.example.cart.dto.AddCartItemRequest;
import com.example.cart.dto.CartResponse;
import com.example.cart.service.CartService;
import jakarta.validation.Valid;
import java.net.URI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart/users/{userId}")
public class CartController {

    private static final Logger log = LoggerFactory.getLogger(CartController.class);
    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@PathVariable Long userId, @Valid @RequestBody AddCartItemRequest request) {
        CartResponse cart = service.addItem(userId, request);
        log.info("Added product {} to cart for user {}", request.productId(), userId);
        return ResponseEntity.created(URI.create("/api/cart/users/" + userId)).body(cart);
    }

    @GetMapping
    public CartResponse getCart(@PathVariable Long userId) {
        return service.getCart(userId);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long userId, @PathVariable Long productId) {
        service.removeItem(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
