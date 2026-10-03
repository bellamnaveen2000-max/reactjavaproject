package com.example.product.service;

import com.example.product.dto.ProductRequest;
import com.example.product.dto.ProductResponse;
import com.example.product.entity.Product;
import com.example.product.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {

    private static final List<String> SORT_FIELDS = List.of("id", "name", "price", "stock");

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public ProductResponse create(ProductRequest request) {
        return ProductResponse.from(repository.save(new Product(request.name().trim(), request.price(), request.stock())));
    }

    @Transactional(readOnly = true)
    public ProductResponse get(Long id) {
        return ProductResponse.from(findProduct(id));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findProduct(id);
        product.update(request.name().trim(), request.price(), request.stock());
        return ProductResponse.from(repository.save(product));
    }

    public void delete(Long id) {
        repository.delete(findProduct(id));
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> list(int page, int size, String sortBy, String direction) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("Page must be non-negative and size must be between 1 and 100");
        }
        if (!SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException("Unsupported sort field: " + sortBy);
        }
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return repository.findAll(pageable).map(ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> search(String name, BigDecimal maxPrice) {
        String normalizedName = name == null ? "" : name.toLowerCase(Locale.ROOT);
        return repository.findAll().stream()
                .filter(product -> product.getName().toLowerCase(Locale.ROOT).contains(normalizedName))
                .filter(product -> maxPrice == null || product.getPrice().compareTo(maxPrice) <= 0)
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAbovePrice(BigDecimal minPrice) {
        return repository.findAbovePrice(minPrice).stream().map(ProductResponse::from).toList();
    }

    private Product findProduct(Long id) {
        return repository.findById(id).orElseThrow(() -> new NoSuchElementException("Product " + id + " was not found"));
    }
}
