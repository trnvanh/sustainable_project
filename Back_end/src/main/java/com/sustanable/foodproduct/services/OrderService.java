package com.sustanable.foodproduct.services;

import java.util.List;

import com.sustanable.foodproduct.dtos.CreateOrderRequest;
import com.sustanable.foodproduct.entities.OrderEntity;

public interface OrderService {
    OrderEntity createOrder(CreateOrderRequest request, Integer userId);

    List<OrderEntity> getUserOrders(Integer userId);

    OrderEntity getOrderById(Long orderId, Integer userId);

    OrderEntity updateOrderStatus(Long orderId, String status);

    void cancelOrder(Long orderId, Integer userId);
}
