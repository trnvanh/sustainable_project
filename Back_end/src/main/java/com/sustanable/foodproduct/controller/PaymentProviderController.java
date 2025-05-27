package com.sustanable.foodproduct.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sustanable.foodproduct.services.PaymentServiceFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payment-providers")
@RequiredArgsConstructor
public class PaymentProviderController {

    private final PaymentServiceFactory paymentServiceFactory;

    /**
     * Get available payment providers
     */
    @GetMapping
    public ResponseEntity<String[]> getAvailablePaymentProviders() {
        return ResponseEntity.ok(new String[] { "paypal", "stripe" });
    }

    /**
     * Test endpoint to verify payment services are configured correctly
     */
    @GetMapping("/test")
    public ResponseEntity<String> testPaymentServices() {
        try {
            // Test PayPal service injection
            var paypalService = paymentServiceFactory.getPaymentService("paypal");
            if (paypalService == null) {
                return ResponseEntity.status(500).body("PayPal service not available");
            }

            // Test Stripe service injection
            var stripeService = paymentServiceFactory.getPaymentService("stripe");
            if (stripeService == null) {
                return ResponseEntity.status(500).body("Stripe service not available");
            }

            return ResponseEntity.ok("Both PayPal and Stripe services are configured correctly");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error testing payment services: " + e.getMessage());
        }
    }
}
