package com.sustanable.foodproduct.repositories;

import com.sustanable.foodproduct.entities.UserFavoriteProduct;
import com.sustanable.foodproduct.entities.UserFavoriteProduct.UserFavoriteProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserFavoriteProductRepository extends JpaRepository<UserFavoriteProduct, UserFavoriteProductId> {
    List<UserFavoriteProduct> findByUserId(Integer userId);
    boolean existsByUserIdAndProductId(Integer userId, Long productId);
    void deleteByUserIdAndProductId(Integer userId, Long productId);
    
    @Query("SELECT COUNT(ufp) FROM UserFavoriteProduct ufp WHERE ufp.product.id = :productId")
    Long countByProductId(@Param("productId") Long productId);
}
