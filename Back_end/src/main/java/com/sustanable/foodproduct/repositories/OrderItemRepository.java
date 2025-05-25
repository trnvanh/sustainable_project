package com.sustanable.foodproduct.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustanable.foodproduct.entities.OrderItemEntity;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
}
