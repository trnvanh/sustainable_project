package com.sustanable.foodproduct.services.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sustanable.foodproduct.entities.CategoryEntity;
import com.sustanable.foodproduct.entities.ProductEntity;
import com.sustanable.foodproduct.entities.StoreEntity;
import com.sustanable.foodproduct.entities.User;
import com.sustanable.foodproduct.entities.UserFavoriteProduct;
import com.sustanable.foodproduct.repositories.CategoryRepository;
import com.sustanable.foodproduct.repositories.ProductRepository;
import com.sustanable.foodproduct.repositories.StoreRepository;
import com.sustanable.foodproduct.repositories.UserFavoriteProductRepository;
import com.sustanable.foodproduct.repositories.UserRepository;
import com.sustanable.foodproduct.services.ProductService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UserFavoriteProductRepository userFavoriteProductRepository;

    @Override
    public ProductEntity createProduct(ProductEntity product) {
        // Handle the case where store is null but we have storeId in DTO
        if (product.getStore() == null || product.getStore().getId() == null) {
            throw new IllegalArgumentException("Store information is missing or invalid");
        }
        
        // Fetch and attach the store
        StoreEntity store = storeRepository.findById(product.getStore().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid store ID: " + product.getStore().getId()));
        product.setStore(store);

        // Fetch and attach valid categories
        Set<CategoryEntity> resolvedCategories = product.getCategories().stream()
                .map(cat -> categoryRepository.findById(cat.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + cat.getId())))
                .collect(Collectors.toSet());
        product.setCategories(resolvedCategories);

        return productRepository.save(product);
    }

    @Override
    public List<ProductEntity> createProducts(List<ProductEntity> products) {
        for (ProductEntity product : products) {
            // Handle the case where store is null but we have storeId in DTO
            if (product.getStore() == null || product.getStore().getId() == null) {
                throw new IllegalArgumentException("Store information is missing or invalid for product: " + product.getName());
            }
            
            // Resolve store
            StoreEntity store = storeRepository.findById(product.getStore().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid store ID: " + product.getStore().getId()));
            product.setStore(store);

            // Resolve categories
            Set<CategoryEntity> resolvedCategories = product.getCategories().stream()
                    .map(cat -> categoryRepository.findById(cat.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + cat.getId())))
                    .collect(Collectors.toSet());
            product.setCategories(resolvedCategories);
        }

        return productRepository.saveAll(products);
    }

    @Override
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<ProductEntity> getProductsByCategory(Long categoryId) {
        // Verify that the category exists
        if (!categoryRepository.existsById(categoryId)) {
            throw new EntityNotFoundException("Category not found with id: " + categoryId);
        }
        return productRepository.findByCategoriesId(categoryId);
    }

    @Override
    @Transactional
    public void toggleFavorite(Long productId, Integer userId) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        boolean isFavorited = userFavoriteProductRepository.existsByUserIdAndProductId(userId, productId);

        if (isFavorited) {
            userFavoriteProductRepository.deleteByUserIdAndProductId(userId, productId);
        } else {
            UserFavoriteProduct favorite = new UserFavoriteProduct();
            favorite.setId(new UserFavoriteProduct.UserFavoriteProductId(userId, productId));
            favorite.setUser(user);
            favorite.setProduct(product);
            userFavoriteProductRepository.save(favorite);
        }

        // Update favorite count
        Long favoriteCount = userFavoriteProductRepository.countByProductId(productId);
        product.setFavourite(favoriteCount);
        productRepository.save(product);
    }

    @Override
    public List<ProductEntity> getFavoriteProducts(Integer userId) {
        return userFavoriteProductRepository.findByUserId(userId).stream()
                .map(UserFavoriteProduct::getProduct)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFavorited(Long productId, Integer userId) {
        return userFavoriteProductRepository.existsByUserIdAndProductId(userId, productId);
    }

    // Search methods implementation
    @Override
    public List<ProductEntity> searchProductsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByNameContainingIgnoreCase(name.trim());
    }

    @Override
    public List<ProductEntity> searchProductsByDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByDescriptionContainingIgnoreCase(description.trim());
    }

    @Override
    public List<ProductEntity> searchProducts(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByNameOrDescriptionContainingIgnoreCase(searchTerm.trim());
    }

    @Override
    public List<ProductEntity> searchProductsByStore(String storeName) {
        if (storeName == null || storeName.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByStoreNameContainingIgnoreCase(storeName.trim());
    }

    @Override
    public List<ProductEntity> advancedSearchProducts(String searchTerm, Long categoryId, BigDecimal minPrice,
            BigDecimal maxPrice) {
        // Validate price range
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price");
        }

        // Trim search term
        String trimmedSearchTerm = (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null;

        return productRepository.searchProducts(trimmedSearchTerm, categoryId, minPrice, maxPrice);
    }
}
