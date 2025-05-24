package com.sustanable.foodproduct.controller;

import com.sustanable.foodproduct.converter.Converter;
import com.sustanable.foodproduct.dtos.CategoryDto;
import com.sustanable.foodproduct.entities.CategoryEntity;
import com.sustanable.foodproduct.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        var category = Converter.toModel(categoryDto, CategoryEntity.class);
        var savedCategory = categoryService.createCategory(category);
        return ResponseEntity.ok(Converter.toModel(savedCategory, CategoryDto.class));
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        var categories = categoryService.getAllCategories();
        return ResponseEntity.ok(Converter.toList(categories, CategoryDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id) {
        var category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(Converter.toModel(category, CategoryDto.class));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDto categoryDto) {
        var category = Converter.toModel(categoryDto, CategoryEntity.class);
        var updatedCategory = categoryService.updateCategory(id, category);
        return ResponseEntity.ok(Converter.toModel(updatedCategory, CategoryDto.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
