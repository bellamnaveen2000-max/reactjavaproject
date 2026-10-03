package com.example.cart.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.cart.service.CartWriter;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "spring.kafka.listener.auto-startup=false")
@AutoConfigureMockMvc
class CartControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CartWriter cartWriter;

    @BeforeEach
    void clearTestCart() {
        try {
            for (var item : cartWriter.getCart(42L).items()) {
                cartWriter.removeItem(42L, item.productId());
            }
        } catch (java.util.NoSuchElementException ignored) {
            // A fresh in-memory database has no cart for this test user.
        }
    }

    @Test
    void rejectsNonPositiveQuantityAtTheHttpBoundary() throws Exception {
        mockMvc.perform(post("/api/cart/users/42/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"productId":7,"quantity":0}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void returnsNotFoundForAnUnknownCart() throws Exception {
        mockMvc.perform(get("/api/cart/users/987654"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void removesCartItems() throws Exception {
        cartWriter.addItem(42L, 7L, "Desk", 1, new BigDecimal("10.00"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .delete("/api/cart/users/42/items/7"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/cart/users/42"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty());
    }
}
