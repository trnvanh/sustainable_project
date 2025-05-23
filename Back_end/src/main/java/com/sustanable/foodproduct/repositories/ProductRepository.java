package com.sustanable.foodproduct.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustanable.foodproduct.entities.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
}
