package com.sustanable.foodproduct.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustanable.foodproduct.entities.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    boolean existsByName(String name);
}
