package com.sustanable.foodproduct.services;

import java.math.BigDecimal;
import java.util.List;

import com.sustanable.foodproduct.entities.ProductEntity;

public interface ProductService {
    ProductEntity createProduct(ProductEntity product);

    List<ProductEntity> createProducts(List<ProductEntity> products);

    List<ProductEntity> getAllProducts();

    List<ProductEntity> getProductsByCategory(Long categoryId);

    void toggleFavorite(Long productId, Integer userId);

    List<ProductEntity> getFavoriteProducts(Integer userId);

    boolean isFavorited(Long productId, Integer userId);

    // Search methods
    List<ProductEntity> searchProductsByName(String name);

    List<ProductEntity> searchProductsByDescription(String description);

    List<ProductEntity> searchProducts(String searchTerm);

    List<ProductEntity> searchProductsByStore(String storeName);

    List<ProductEntity> advancedSearchProducts(String searchTerm, Long categoryId, BigDecimal minPrice,
            BigDecimal maxPrice);
}
