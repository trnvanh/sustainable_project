package com.sustanable.foodproduct.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sustanable.foodproduct.entities.CategoryEntity;
import com.sustanable.foodproduct.repositories.CategoryRepository;
import com.sustanable.foodproduct.services.CategoryService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public CategoryEntity createCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public CategoryEntity getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
    }

    @Override
    public CategoryEntity updateCategory(Long id, CategoryEntity category) {
        CategoryEntity existingCategory = getCategoryById(id);
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        CategoryEntity category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
