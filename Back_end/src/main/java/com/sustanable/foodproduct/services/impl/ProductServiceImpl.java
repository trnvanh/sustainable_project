package com.sustanable.foodproduct.services.impl;

import com.sustanable.foodproduct.entities.CategoryEntity;
import com.sustanable.foodproduct.entities.ProductEntity;
import com.sustanable.foodproduct.entities.StoreEntity;
import com.sustanable.foodproduct.repositories.CategoryRepository;
import com.sustanable.foodproduct.repositories.ProductRepository;
import com.sustanable.foodproduct.repositories.StoreRepository;
import com.sustanable.foodproduct.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductEntity createProduct(ProductEntity product) {
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
}
