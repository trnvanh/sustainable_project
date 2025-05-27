package com.sustanable.foodproduct.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.converter.Converter;
import com.sustanable.foodproduct.dtos.ProductDto;
import com.sustanable.foodproduct.dtos.ProductResponseDto;
import com.sustanable.foodproduct.entities.ProductEntity;
import com.sustanable.foodproduct.services.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        var product = Converter.toModel(productDto, ProductEntity.class);
        var savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(Converter.toModel(savedProduct, ProductDto.class));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<ProductDto>> createProducts(@RequestBody List<ProductDto> productDtos) {
        var products = Converter.toList(productDtos, ProductEntity.class);
        var savedProducts = productService.createProducts(products);
        return ResponseEntity.ok(Converter.toList(savedProducts, ProductDto.class));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAllProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var products = productService.getAllProducts();
        var productDtos = Converter.toList(products, ProductResponseDto.class);

        // Set favorite information for each product
        productDtos.forEach(dto -> {
            dto.setFavoriteCount(products.stream()
                    .filter(p -> p.getId().equals(dto.getId()))
                    .findFirst()
                    .map(ProductEntity::getFavourite)
                    .orElse(0L));
            dto.setFavorited(productService.isFavorited(dto.getId(), userDetails.getId()));
        });

        return ResponseEntity.ok(productDtos);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponseDto>> getProductsByCategory(
            @PathVariable Long categoryId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var products = productService.getProductsByCategory(categoryId);
        var productDtos = Converter.toList(products, ProductResponseDto.class);

        // Set favorite information for each product
        productDtos.forEach(dto -> {
            dto.setFavoriteCount(products.stream()
                    .filter(p -> p.getId().equals(dto.getId()))
                    .findFirst()
                    .map(ProductEntity::getFavourite)
                    .orElse(0L));
            dto.setFavorited(productService.isFavorited(dto.getId(), userDetails.getId()));
        });

        return ResponseEntity.ok(productDtos);
    }

    // Search endpoints
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDto>> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String store,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<ProductEntity> products;

        if (name != null && !name.trim().isEmpty()) {
            products = productService.searchProductsByName(name);
        } else if (description != null && !description.trim().isEmpty()) {
            products = productService.searchProductsByDescription(description);
        } else if (store != null && !store.trim().isEmpty()) {
            products = productService.searchProductsByStore(store);
        } else if (q != null && !q.trim().isEmpty()) {
            products = productService.searchProducts(q);
        } else {
            products = productService.getAllProducts();
        }

        var productDtos = Converter.toList(products, ProductResponseDto.class);

        // Set favorite information for each product
        productDtos.forEach(dto -> {
            dto.setFavoriteCount(products.stream()
                    .filter(p -> p.getId().equals(dto.getId()))
                    .findFirst()
                    .map(ProductEntity::getFavourite)
                    .orElse(0L));
            dto.setFavorited(productService.isFavorited(dto.getId(), userDetails.getId()));
        });

        return ResponseEntity.ok(productDtos);
    }

    @GetMapping("/search/advanced")
    public ResponseEntity<List<ProductResponseDto>> advancedSearchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        var products = productService.advancedSearchProducts(q, categoryId, minPrice, maxPrice);
        var productDtos = Converter.toList(products, ProductResponseDto.class);

        // Set favorite information for each product
        productDtos.forEach(dto -> {
            dto.setFavoriteCount(products.stream()
                    .filter(p -> p.getId().equals(dto.getId()))
                    .findFirst()
                    .map(ProductEntity::getFavourite)
                    .orElse(0L));
            dto.setFavorited(productService.isFavorited(dto.getId(), userDetails.getId()));
        });

        return ResponseEntity.ok(productDtos);
    }

    @PostMapping("/{productId}/favorite")
    public ResponseEntity<Void> toggleFavorite(
            @PathVariable Long productId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        productService.toggleFavorite(productId, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<ProductDto>> getFavoriteProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var products = productService.getFavoriteProducts(userDetails.getId());
        return ResponseEntity.ok(Converter.toList(products, ProductDto.class));
    }

    @GetMapping("/{productId}/is-favorited")
    public ResponseEntity<Boolean> isFavorited(
            @PathVariable Long productId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean isFavorited = productService.isFavorited(productId, userDetails.getId());
        return ResponseEntity.ok(isFavorited);
    }
}
