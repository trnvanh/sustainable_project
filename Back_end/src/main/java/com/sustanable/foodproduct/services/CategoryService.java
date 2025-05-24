package com.sustanable.foodproduct.services;

import com.sustanable.foodproduct.entities.CategoryEntity;

import java.util.List;

public interface CategoryService {
    CategoryEntity createCategory(CategoryEntity category);

    List<CategoryEntity> getAllCategories();

    CategoryEntity getCategoryById(Long id);

    CategoryEntity updateCategory(Long id, CategoryEntity category);

    void deleteCategory(Long id);
}
