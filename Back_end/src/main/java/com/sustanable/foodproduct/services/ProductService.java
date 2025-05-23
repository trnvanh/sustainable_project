package com.sustanable.foodproduct.services;

import java.util.List;

import com.sustanable.foodproduct.entities.ProductEntity;

public interface ProductService {
    ProductEntity createProduct(ProductEntity product);

    List<ProductEntity> createProducts(List<ProductEntity> products);

    List<ProductEntity> getAllProducts();
}
