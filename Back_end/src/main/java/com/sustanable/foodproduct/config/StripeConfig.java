package com.sustanable.foodproduct.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

import jakarta.annotation.PostConstruct;

@Configuration
public class StripeConfig {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = stripeApiKey;
    }

    public String getStripeWebhookSecret() {
        return stripeWebhookSecret;
    }
}