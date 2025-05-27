package com.sustanable.foodproduct.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.sustanable.foodproduct.config.StripeConfig;
import com.sustanable.foodproduct.services.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripePaymentService {

        private final OrderService orderService;
        private final StripeConfig stripeConfig;

        @Value("${stripe.success-url}")
        private String successUrl;

        @Value("${stripe.cancel-url}")
        private String cancelUrl;

        /**
         * Creates a Checkout Session for a simple payment
         * 
         * @param amount      The amount to charge in cents
         * @param currency    The currency to use (e.g., usd, eur)
         * @param description The description of the payment
         * @return Session object containing the checkout URL
         */
        public Session createCheckoutSession(long amount, String currency, String description) throws StripeException {
                SessionCreateParams params = SessionCreateParams.builder()
                                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                                .setMode(SessionCreateParams.Mode.PAYMENT)
                                .setSuccessUrl(successUrl)
                                .setCancelUrl(cancelUrl)
                                .addLineItem(
                                                SessionCreateParams.LineItem.builder()
                                                                .setQuantity(1L)
                                                                .setPriceData(
                                                                                SessionCreateParams.LineItem.PriceData
                                                                                                .builder()
                                                                                                .setCurrency(currency)
                                                                                                .setUnitAmount(amount)
                                                                                                .setProductData(
                                                                                                                SessionCreateParams.LineItem.PriceData.ProductData
                                                                                                                                .builder()
                                                                                                                                .setName(description)
                                                                                                                                .build())
                                                                                                .build())
                                                                .build())
                                .build();

                return Session.create(params);
        }

        /**
         * Creates a PaymentIntent which can be used on the client side
         * 
         * @param amount      The amount to charge in cents
         * @param currency    The currency to use (e.g., usd, eur)
         * @param description The description of the payment
         * @return PaymentIntent object
         */
        public PaymentIntent createPaymentIntent(long amount, String currency, String description)
                        throws StripeException {
                PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                                .setAmount(amount)
                                .setCurrency(currency)
                                .setDescription(description)
                                .setAutomaticPaymentMethods(
                                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                                                .setEnabled(true)
                                                                .build())
                                .build();

                return PaymentIntent.create(params);
        }

        /**
         * Confirm a payment intent when the client finalizes the payment
         * 
         * @param paymentIntentId The ID of the payment intent to confirm
         * @return Confirmed PaymentIntent object
         */
        public PaymentIntent confirmPaymentIntent(String paymentIntentId) throws StripeException {
                PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
                Map<String, Object> params = new HashMap<>();
                params.put("payment_method", "pm_card_visa"); // This would come from the client in a real app

                return paymentIntent.confirm(params);
        }

        /**
         * Retrieve a payment intent
         * 
         * @param paymentIntentId The ID of the payment intent to retrieve
         * @return PaymentIntent object
         */
        public PaymentIntent retrievePaymentIntent(String paymentIntentId) throws StripeException {
                return PaymentIntent.retrieve(paymentIntentId);
        }
}
