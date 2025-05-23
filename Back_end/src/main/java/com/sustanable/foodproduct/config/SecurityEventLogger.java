package com.sustanable.foodproduct.config;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SecurityEventLogger {

    public void logAuthenticationSuccess(String username, HttpServletRequest request) {
        log.info("Successful authentication for user: {}, IP: {}",
                username, getClientIP(request));
    }

    public void logAuthenticationFailure(String username, HttpServletRequest request, String reason) {
        log.warn("Failed authentication attempt for user: {}, IP: {}, reason: {}",
                username, getClientIP(request), reason);
    }

    public void logRateLimitExceeded(HttpServletRequest request) {
        log.warn("Rate limit exceeded for IP: {}", getClientIP(request));
    }

    public void logTokenRevoked(String username) {
        log.info("Token revoked for user: {}", username);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
