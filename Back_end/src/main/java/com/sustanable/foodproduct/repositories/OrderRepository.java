package com.sustanable.foodproduct.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustanable.foodproduct.entities.OrderEntity;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserId(Integer userId);
}
