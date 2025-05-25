package com.sustanable.foodproduct.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.converter.Converter;
import com.sustanable.foodproduct.dtos.CreateOrderRequest;
import com.sustanable.foodproduct.dtos.OrderDto;
import com.sustanable.foodproduct.services.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var order = orderService.createOrder(request, userDetails.getId());
        return ResponseEntity.ok(Converter.toModel(order, OrderDto.class));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getUserOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var orders = orderService.getUserOrders(userDetails.getId());
        return ResponseEntity.ok(Converter.toList(orders, OrderDto.class));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var order = orderService.getOrderById(orderId, userDetails.getId());
        return ResponseEntity.ok(Converter.toModel(order, OrderDto.class));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        orderService.cancelOrder(orderId, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        var order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(Converter.toModel(order, OrderDto.class));
    }
}
