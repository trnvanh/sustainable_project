package com.sustanable.foodproduct.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sustanable.foodproduct.entities.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    List<ProductEntity> findByCategoriesId(Long categoryId);

    // Search by product name (case-insensitive)
    List<ProductEntity> findByNameContainingIgnoreCase(String name);

    // Search by product description (case-insensitive)
    List<ProductEntity> findByDescriptionContainingIgnoreCase(String description);

    // Search by product name or description (case-insensitive)
    @Query("SELECT p FROM ProductEntity p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<ProductEntity> findByNameOrDescriptionContainingIgnoreCase(@Param("searchTerm") String searchTerm);

    // Search by store name (case-insensitive)
    @Query("SELECT p FROM ProductEntity p JOIN p.store s WHERE " +
            "LOWER(s.name) LIKE LOWER(CONCAT('%', :storeName, '%'))")
    List<ProductEntity> findByStoreNameContainingIgnoreCase(@Param("storeName") String storeName);

    // Advanced search with multiple criteria
    @Query("SELECT p FROM ProductEntity p JOIN p.store s LEFT JOIN p.categories c WHERE " +
            "(:searchTerm IS NULL OR " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "(:categoryId IS NULL OR c.id = :categoryId) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "p.status = true")
    List<ProductEntity> searchProducts(@Param("searchTerm") String searchTerm,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") java.math.BigDecimal minPrice,
            @Param("maxPrice") java.math.BigDecimal maxPrice);
}
