package com.example.cart.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.cart.entity.Cart;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class CartRepositoryTests {

    @Autowired
    private CartRepository repository;

    @Test
    void persistsCartAndAggregatesItemTotals() {
        Cart cart = new Cart(42L);
        cart.addOrUpdateItem(7L, "Desk", 2, new BigDecimal("12.50"));
        cart.addOrUpdateItem(7L, "Desk", 1, new BigDecimal("12.50"));
        repository.saveAndFlush(cart);

        var loaded = repository.findWithItemsByUserId(42L).orElseThrow();

        assertThat(loaded.getItems()).hasSize(1);
        assertThat(loaded.getItems().get(0).getQuantity()).isEqualTo(3);
        assertThat(loaded.getItems().get(0).getUnitPrice().multiply(BigDecimal.valueOf(3)))
                .isEqualByComparingTo("37.50");
    }
}
