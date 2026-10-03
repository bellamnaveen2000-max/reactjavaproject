package com.example.product.repository;

import com.example.product.entity.Product;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT * FROM products WHERE price > :minPrice", nativeQuery = true)
    List<Product> findAbovePrice(@Param("minPrice") BigDecimal minPrice);

    Page<Product> findAll(Pageable pageable);
}
