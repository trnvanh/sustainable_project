package com.sustanable.foodproduct.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppConfig {

    private String urlScheme = "heroeatspay";
    private BaseUrl baseUrl = new BaseUrl();

    @Data
    public static class BaseUrl {
        private String development = "http://localhost:8080";
        private String production = "https://sustainable-be.code4fun.xyz";
    }

    /**
     * Get the current base URL based on environment
     * You can extend this to automatically detect the environment
     */
    public String getCurrentBaseUrl() {
        // For now, return development URL
        // You can add logic to detect environment and return appropriate URL
        String activeProfile = System.getProperty("spring.profiles.active", "development");

        if ("production".equals(activeProfile) || "prod".equals(activeProfile)) {
            return baseUrl.getProduction();
        }
        return baseUrl.getDevelopment();
    }

    /**
     * Generate app redirect URL for payment success
     */
    public String getPaymentSuccessRedirectUrl(String provider, String paymentId, String status, String message) {
        if ("stripe".equalsIgnoreCase(provider)) {
            return String.format("%s://payment/stripe/success?status=%s&sessionId=%s&message=%s",
                    urlScheme, status, paymentId, message);
        } else {
            return String.format("%s://payment/success?status=%s&paymentId=%s&message=%s",
                    urlScheme, status, paymentId, message);
        }
    }

    /**
     * Generate app redirect URL for payment cancel
     */
    public String getPaymentCancelRedirectUrl(String provider, String paymentId, String message) {
        if ("stripe".equalsIgnoreCase(provider)) {
            return String.format("%s://payment/stripe/cancel?status=cancelled&sessionId=%s&message=%s",
                    urlScheme, paymentId, message);
        } else {
            return String.format("%s://payment/cancel?status=cancelled&paymentId=%s&message=%s",
                    urlScheme, paymentId, message);
        }
    }
}
