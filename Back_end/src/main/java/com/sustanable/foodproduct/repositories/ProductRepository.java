package com.sustanable.foodproduct.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustanable.foodproduct.entities.ProductEntity;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    List<ProductEntity> findByCategoriesId(Long categoryId);
}
