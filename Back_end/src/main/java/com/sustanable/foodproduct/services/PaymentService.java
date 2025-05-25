package com.sustanable.foodproduct.services;

import com.sustanable.foodproduct.dtos.PaymentRequest;
import com.sustanable.foodproduct.dtos.PaymentResponse;

public interface PaymentService {
    /**
     * Create a payment for an order
     * 
     * @param request Payment request details
     * @return Payment response with redirect URL
     */
    PaymentResponse createPayment(PaymentRequest request);

    /**
     * Execute a payment after user approval
     * 
     * @param paymentId The PayPal payment ID
     * @param payerId   The PayPal payer ID
     * @return Payment response with status
     */
    PaymentResponse executePayment(String paymentId, String payerId);

    /**
     * Handle payment cancellation
     * 
     * @param paymentId The PayPal payment ID
     * @return Payment response with status
     */
    PaymentResponse cancelPayment(String paymentId);
}