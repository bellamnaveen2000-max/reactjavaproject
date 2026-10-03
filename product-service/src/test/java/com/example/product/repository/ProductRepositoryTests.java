package com.example.product.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.product.entity.Product;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class ProductRepositoryTests {

    @Autowired
    private ProductRepository repository;

    @Test
    void nativeQueryReturnsOnlyProductsAboveTheMinimumPrice() {
        repository.save(new Product("Affordable", new BigDecimal("9.99"), 4));
        repository.save(new Product("Premium", new BigDecimal("50.00"), 2));

        var results = repository.findAbovePrice(new BigDecimal("20.00"));

        assertThat(results).extracting(Product::getName).containsExactly("Premium");
    }
}
