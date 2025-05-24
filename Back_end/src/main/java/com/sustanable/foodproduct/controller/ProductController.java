package com.sustanable.foodproduct.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sustanable.foodproduct.converter.Converter;
import com.sustanable.foodproduct.dtos.ProductDto;
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
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        var products = productService.getAllProducts();
        return ResponseEntity.ok(Converter.toList(products, ProductDto.class));
    }
}
