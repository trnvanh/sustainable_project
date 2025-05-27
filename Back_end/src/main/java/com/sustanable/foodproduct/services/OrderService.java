package com.sustanable.foodproduct.services;

import java.util.List;

import com.sustanable.foodproduct.dtos.CreateOrderRequest;
import com.sustanable.foodproduct.entities.OrderEntity;
import com.sustanable.foodproduct.entities.PaymentStatus;

public interface OrderService {
    OrderEntity createOrder(CreateOrderRequest request, Integer userId);

    List<OrderEntity> getUserOrders(Integer userId);

    OrderEntity getOrderById(Long orderId, Integer userId);

    OrderEntity updateOrderStatus(Long orderId, String status);

    void cancelOrder(Long orderId, Integer userId);

    /**
     * Completely remove an order from the system
     * This is different from cancelOrder which only changes the status
     * 
     * @param orderId The ID of the order to delete
     * @param userId  The ID of the user who owns the order
     */
    void deleteOrder(Long orderId, Integer userId);

    /**
     * Update the payment information for an order
     * 
     * @param orderId       The ID of the order to update
     * @param paymentId     The PayPal payment ID
     * @param paymentStatus The status of the payment
     * @return The updated order
     */
    OrderEntity updatePaymentInfo(Long orderId, String paymentId, PaymentStatus paymentStatus);
}
