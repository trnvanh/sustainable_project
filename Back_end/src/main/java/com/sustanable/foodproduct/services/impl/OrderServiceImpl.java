package com.sustanable.foodproduct.services.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sustanable.foodproduct.dtos.CreateOrderRequest;
import com.sustanable.foodproduct.entities.OrderEntity;
import com.sustanable.foodproduct.entities.OrderItemEntity;
import com.sustanable.foodproduct.entities.OrderStatus;
import com.sustanable.foodproduct.entities.PaymentStatus;
import com.sustanable.foodproduct.entities.ProductEntity;
import com.sustanable.foodproduct.entities.User;
import com.sustanable.foodproduct.repositories.OrderItemRepository;
import com.sustanable.foodproduct.repositories.OrderRepository;
import com.sustanable.foodproduct.repositories.ProductRepository;
import com.sustanable.foodproduct.repositories.UserRepository;
import com.sustanable.foodproduct.services.OrderService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderEntity createOrder(CreateOrderRequest request, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        OrderEntity order = OrderEntity.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .pickupTime(request.getPickupTime())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (var itemRequest : request.getItems()) {
            ProductEntity product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));

            if (product.getPortionsLeft() < itemRequest.getQuantity()) {
                throw new IllegalStateException("Not enough portions available for product: " + product.getName());
            }

            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            // Update product portions
            product.setPortionsLeft(product.getPortionsLeft() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    @Override
    public List<OrderEntity> getUserOrders(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public OrderEntity getOrderById(Long orderId, Integer userId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Order does not belong to user");
        }

        return order;
    }

    @Override
    @Transactional
    public OrderEntity updateOrderStatus(Long orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, Integer userId) {
        OrderEntity order = getOrderById(orderId, userId);

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Can only cancel pending orders");
        }

        // Restore product portions
        for (OrderItemEntity item : order.getItems()) {
            ProductEntity product = item.getProduct();
            product.setPortionsLeft(product.getPortionsLeft() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public OrderEntity updatePaymentInfo(Long orderId, String paymentId, PaymentStatus paymentStatus) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setPaymentId(paymentId);
        order.setPaymentStatus(paymentStatus);

        // If payment is completed, update the order status to CONFIRMED
        if (PaymentStatus.COMPLETED.equals(paymentStatus)) {
            order.setStatus(OrderStatus.CONFIRMED);
        } else if (PaymentStatus.CANCELLED.equals(paymentStatus) || PaymentStatus.FAILED.equals(paymentStatus)) {
            // If payment failed or was cancelled, revert to PENDING
            order.setStatus(OrderStatus.PENDING);
        }

        return orderRepository.save(order);
    }
}
