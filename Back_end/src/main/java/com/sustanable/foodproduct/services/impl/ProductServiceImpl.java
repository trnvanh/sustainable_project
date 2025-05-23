package com.sustanable.foodproduct.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sustanable.foodproduct.entities.ProductEntity;
import com.sustanable.foodproduct.repositories.ProductRepository;
import com.sustanable.foodproduct.services.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public ProductEntity createProduct(ProductEntity product) {
        return productRepository.save(product);
    }

    @Override
    public List<ProductEntity> createProducts(List<ProductEntity> products) {
        return productRepository.saveAll(products);
    }

    @Override
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }
}
