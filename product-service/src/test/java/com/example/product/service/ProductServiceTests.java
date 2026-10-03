package com.example.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.product.dto.ProductRequest;
import com.example.product.entity.Product;
import com.example.product.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

class ProductServiceTests {

    private ProductRepository repository;
    private ProductService service;

    @BeforeEach
    void setUp() {
        repository = mock(ProductRepository.class);
        service = new ProductService(repository);
    }

    @Test
    void createsProductWithTrimmedName() {
        Product product = new Product("Desk", new BigDecimal("12.50"), 4);
        when(repository.save(any(Product.class))).thenReturn(product);

        var result = service.create(new ProductRequest(" Desk ", new BigDecimal("12.50"), 4));

        assertThat(result.name()).isEqualTo("Desk");
        assertThat(result.price()).isEqualByComparingTo("12.50");
    }

    @Test
    void filtersProductsByNameAndMaximumPriceUsingStreams() {
        when(repository.findAll()).thenReturn(List.of(
                new Product("Desk Lamp", new BigDecimal("25.00"), 2),
                new Product("Desk", new BigDecimal("60.00"), 1),
                new Product("Chair", new BigDecimal("15.00"), 3)));

        var results = service.search("desk", new BigDecimal("30.00"));

        assertThat(results).extracting("name").containsExactly("Desk Lamp");
    }

    @Test
    void delegatesPagedListingToRepository() {
        when(repository.findAll(any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(new Product("Desk", BigDecimal.TEN, 2)), PageRequest.of(0, 10), 1));

        var result = service.list(0, 10, "name", "desc");

        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(repository).findAll(any(org.springframework.data.domain.Pageable.class));
    }

    @Test
    void rejectsUnsupportedSortFields() {
        assertThatThrownBy(() -> service.list(0, 10, "unknown", "asc"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void invokesNativeAbovePriceQuery() {
        when(repository.findAbovePrice(new BigDecimal("20"))).thenReturn(List.of());

        assertThat(service.findAbovePrice(new BigDecimal("20"))).isEmpty();

        verify(repository).findAbovePrice(new BigDecimal("20"));
    }
}
