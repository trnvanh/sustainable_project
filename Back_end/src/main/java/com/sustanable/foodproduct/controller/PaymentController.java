package com.sustanable.foodproduct.controller;

import org.springframework.http.HttpStatus;
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
    public ResponseEntity<String> executePayment(
            @RequestParam(value = "paymentId", required = false) String paymentId,
            @RequestParam(value = "token", required = false) String token,
            @RequestParam("PayerID") String payerId) {

        // Use token as paymentId if paymentId is null (PayPal sometimes sends it as
        // token)
        String effectivePaymentId = (paymentId != null) ? paymentId : token;

        if (effectivePaymentId == null) {
            // Redirect to app with error
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", "heroeatspay://payment/success?status=error&message=Missing payment ID")
                    .body("Redirecting to app...");
        }

        try {
            PaymentResponse response = paymentService.executePayment(effectivePaymentId, payerId);

            // Create redirect URL with payment status
            String redirectUrl;
            if (response.isSuccess()) {
                redirectUrl = String.format("heroeatspay://payment/success?status=success&paymentId=%s&message=%s",
                        effectivePaymentId, "Payment completed successfully");
            } else {
                redirectUrl = String.format("heroeatspay://payment/success?status=error&message=%s",
                        response.getMessage());
            }

            // Return HTML page that redirects to the app
            String htmlResponse = String.format("""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Payment Processing</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background-color: #f5f5f5;
                            }
                            .container {
                                max-width: 400px;
                                margin: 0 auto;
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }
                            .success { color: #4CAF50; }
                            .error { color: #f44336; }
                            .loading { color: #2196F3; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="%s">%s</h2>
                            <p>%s</p>
                            <p class="loading">Redirecting to HeroEats app...</p>
                            <p><a href="%s">Click here if not redirected automatically</a></p>
                        </div>
                        <script>
                            setTimeout(function() {
                                window.location.href = '%s';
                            }, 2000);
                        </script>
                    </body>
                    </html>
                    """,
                    response.isSuccess() ? "success" : "error",
                    response.isSuccess() ? "Payment Successful!" : "Payment Failed",
                    response.getMessage(),
                    redirectUrl,
                    redirectUrl);

            return ResponseEntity.ok()
                    .header("Content-Type", "text/html")
                    .body(htmlResponse);

        } catch (Exception e) {
            String errorRedirectUrl = String.format("heroeatspay://payment/success?status=error&message=%s",
                    "Payment processing failed");

            String errorHtml = String.format("""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Payment Error</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background-color: #f5f5f5;
                            }
                            .container {
                                max-width: 400px;
                                margin: 0 auto;
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }
                            .error { color: #f44336; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="error">Payment Error</h2>
                            <p>There was an issue processing your payment.</p>
                            <p>Redirecting to HeroEats app...</p>
                            <p><a href="%s">Click here if not redirected automatically</a></p>
                        </div>
                        <script>
                            setTimeout(function() {
                                window.location.href = '%s';
                            }, 2000);
                        </script>
                    </body>
                    </html>
                    """,
                    errorRedirectUrl,
                    errorRedirectUrl);

            return ResponseEntity.ok()
                    .header("Content-Type", "text/html")
                    .body(errorHtml);
        }
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancelPayment(
            @RequestParam("paymentId") String paymentId) {

        // Cancel the payment (for logging/audit purposes)
        paymentService.cancelPayment(paymentId);

        String redirectUrl = String.format("heroeatspay://payment/cancel?status=cancelled&paymentId=%s&message=%s",
                paymentId, "Payment was cancelled by user");

        String htmlResponse = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Payment Cancelled</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                            background-color: #f5f5f5;
                        }
                        .container {
                            max-width: 400px;
                            margin: 0 auto;
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .cancelled { color: #ff9800; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="cancelled">Payment Cancelled</h2>
                        <p>Your payment has been cancelled.</p>
                        <p>Redirecting to HeroEats app...</p>
                        <p><a href="%s">Click here if not redirected automatically</a></p>
                    </div>
                    <script>
                        setTimeout(function() {
                            window.location.href = '%s';
                        }, 2000);
                    </script>
                </body>
                </html>
                """,
                redirectUrl,
                redirectUrl);

        return ResponseEntity.ok()
                .header("Content-Type", "text/html")
                .body(htmlResponse);
    }
}