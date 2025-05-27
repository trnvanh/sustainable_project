package com.sustanable.foodproduct.services;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentServiceFactory {

    @Qualifier("payPalService")
    private final PaymentService payPalService;

    @Qualifier("stripeService")
    private final PaymentService stripeService;

    /**
     * Get the appropriate payment service based on the payment method
     * 
     * @param paymentMethod The payment method (paypal or stripe)
     * @return The appropriate PaymentService implementation
     */
    public PaymentService getPaymentService(String paymentMethod) {
        if (paymentMethod == null) {
            return payPalService; // Default to PayPal
        }

        switch (paymentMethod.toLowerCase()) {
            case "stripe":
                return stripeService;
            case "paypal":
            default:
                return payPalService;
        }
    }
}
