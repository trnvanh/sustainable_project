package com.sustanable.foodproduct.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustanable.foodproduct.entities.StoreEntity;

public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    List<StoreEntity> findByOwnerId(Integer ownerId);

    Optional<StoreEntity> findByIdAndOwnerId(Long id, Integer ownerId);

    boolean existsByEmailIgnoreCase(String email);
}
