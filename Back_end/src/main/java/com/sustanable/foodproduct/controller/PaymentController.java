package com.sustanable.foodproduct.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.dtos.PaymentRequest;
import com.sustanable.foodproduct.dtos.PaymentResponse;
import com.sustanable.foodproduct.entities.OrderEntity;
import com.sustanable.foodproduct.services.OrderService;
import com.sustanable.foodproduct.services.PaymentService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody PaymentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        // Verify that the order belongs to the authenticated user
        try {
            OrderEntity order = orderService.getOrderById(request.getOrderId(), userDetails.getId());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(PaymentResponse.builder()
                            .success(false)
                            .message("Order not found or does not belong to user")
                            .build());
        }

        PaymentResponse response = paymentService.createPayment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/success")
    public ResponseEntity<PaymentResponse> executePayment(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId) {

        PaymentResponse response = paymentService.executePayment(paymentId, payerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cancel")
    public ResponseEntity<PaymentResponse> cancelPayment(
            @RequestParam("paymentId") String paymentId) {

        PaymentResponse response = paymentService.cancelPayment(paymentId);
        return ResponseEntity.ok(response);
    }
}