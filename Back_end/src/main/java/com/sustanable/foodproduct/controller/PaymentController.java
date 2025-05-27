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
import com.sustanable.foodproduct.services.OrderService;
import com.sustanable.foodproduct.services.PaymentService;
import com.sustanable.foodproduct.services.PaymentServiceFactory;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServiceFactory paymentServiceFactory;
    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody PaymentRequest request,
            @RequestParam(value = "provider", defaultValue = "paypal") String paymentProvider,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        // Verify that the order belongs to the authenticated user
        try {
            orderService.getOrderById(request.getOrderId(), userDetails.getId());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(PaymentResponse.builder()
                            .success(false)
                            .message("Order not found or does not belong to user")
                            .build());
        }

        // Get the appropriate payment service and process payment
        PaymentService paymentService = paymentServiceFactory.getPaymentService(paymentProvider);
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
            // This endpoint is PayPal-specific based on the PayerID parameter
            PaymentService paymentService = paymentServiceFactory.getPaymentService("paypal");
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
                        <meta http-equiv="refresh" content="1; url=%s">
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                                margin: 0;
                                min-height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .container {
                                max-width: 400px;
                                background: white;
                                padding: 40px;
                                border-radius: 15px;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                                animation: fadeIn 0.5s ease-in;
                            }
                            .success { color: #4CAF50; }
                            .error { color: #f44336; }
                            .loading {
                                color: #2196F3;
                                font-size: 14px;
                                margin-top: 20px;
                            }
                            .spinner {
                                border: 2px solid #f3f3f3;
                                border-top: 2px solid #2196F3;
                                border-radius: 50%%;
                                width: 20px;
                                height: 20px;
                                animation: spin 1s linear infinite;
                                margin: 10px auto;
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes spin {
                                0%% { transform: rotate(0deg); }
                                100%% { transform: rotate(360deg); }
                            }
                            a {
                                color: #2196F3;
                                text-decoration: none;
                                font-size: 14px;
                            }
                            a:hover {
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="%s">%s</h2>
                            <p>%s</p>
                            <div class="spinner"></div>
                            <p class="loading">Redirecting to HeroEats app...</p>
                            <p><a href="%s">Click here if not redirected automatically</a></p>
                        </div>
                        <script>
                            // Multiple redirect strategies for maximum compatibility
                            function redirectToApp() {
                                const appUrl = '%s';
                                console.log('Attempting to redirect to:', appUrl);

                                // Try multiple methods
                                try {
                                    // Method 1: Direct assignment
                                    window.location.href = appUrl;

                                    // Method 2: Replace (prevents back button)
                                    setTimeout(() => {
                                        window.location.replace(appUrl);
                                    }, 500);

                                    // Method 3: Open in same window
                                    setTimeout(() => {
                                        window.open(appUrl, '_self');
                                    }, 1000);

                                } catch (error) {
                                    console.error('Redirect failed:', error);
                                    // Show manual link if all else fails
                                    document.querySelector('.loading').innerHTML =
                                        'Unable to redirect automatically. Please click the link above.';
                                }
                            }

                            // Start redirect immediately
                            redirectToApp();

                            // Fallback after 2 seconds
                            setTimeout(redirectToApp, 2000);
                        </script>
                    </body>
                    </html>
                    """,
                    redirectUrl,
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
                        <meta http-equiv="refresh" content="1; url=%s">
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background: linear-gradient(135deg, #ff6b6b 0%%, #ee5a52 100%%);
                                margin: 0;
                                min-height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .container {
                                max-width: 400px;
                                background: white;
                                padding: 40px;
                                border-radius: 15px;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                                animation: fadeIn 0.5s ease-in;
                            }
                            .error { color: #f44336; }
                            .spinner {
                                border: 2px solid #f3f3f3;
                                border-top: 2px solid #f44336;
                                border-radius: 50%%;
                                width: 20px;
                                height: 20px;
                                animation: spin 1s linear infinite;
                                margin: 10px auto;
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes spin {
                                0%% { transform: rotate(0deg); }
                                100%% { transform: rotate(360deg); }
                            }
                            a {
                                color: #f44336;
                                text-decoration: none;
                                font-size: 14px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="error">Payment Error</h2>
                            <p>There was an issue processing your payment.</p>
                            <div class="spinner"></div>
                            <p>Redirecting to HeroEats app...</p>
                            <p><a href="%s">Click here if not redirected automatically</a></p>
                        </div>
                        <script>
                            function redirectToApp() {
                                const appUrl = '%s';
                                try {
                                    window.location.href = appUrl;
                                    setTimeout(() => window.location.replace(appUrl), 500);
                                    setTimeout(() => window.open(appUrl, '_self'), 1000);
                                } catch (error) {
                                    console.error('Redirect failed:', error);
                                }
                            }
                            redirectToApp();
                            setTimeout(redirectToApp, 2000);
                        </script>
                    </body>
                    </html>
                    """,
                    errorRedirectUrl,
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
        // This endpoint is PayPal-specific based on the URL structure
        PaymentService paymentService = paymentServiceFactory.getPaymentService("paypal");
        paymentService.cancelPayment(paymentId);

        String redirectUrl = String.format("heroeatspay://payment/cancel?status=cancelled&paymentId=%s&message=%s",
                paymentId, "Payment was cancelled by user");

        String htmlResponse = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Payment Cancelled</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="refresh" content="1; url=%s">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                            background: linear-gradient(135deg, #ffa726 0%%, #ff9800 100%%);
                            margin: 0;
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .container {
                            max-width: 400px;
                            background: white;
                            padding: 40px;
                            border-radius: 15px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                            animation: fadeIn 0.5s ease-in;
                        }
                        .cancelled { color: #ff9800; }
                        .spinner {
                            border: 2px solid #f3f3f3;
                            border-top: 2px solid #ff9800;
                            border-radius: 50%%;
                            width: 20px;
                            height: 20px;
                            animation: spin 1s linear infinite;
                            margin: 10px auto;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes spin {
                            0%% { transform: rotate(0deg); }
                            100%% { transform: rotate(360deg); }
                        }
                        a {
                            color: #ff9800;
                            text-decoration: none;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="cancelled">Payment Cancelled</h2>
                        <p>Your payment has been cancelled.</p>
                        <div class="spinner"></div>
                        <p>Redirecting to HeroEats app...</p>
                        <p><a href="%s">Click here if not redirected automatically</a></p>
                    </div>
                    <script>
                        function redirectToApp() {
                            const appUrl = '%s';
                            try {
                                window.location.href = appUrl;
                                setTimeout(() => window.location.replace(appUrl), 500);
                                setTimeout(() => window.open(appUrl, '_self'), 1000);
                            } catch (error) {
                                console.error('Redirect failed:', error);
                            }
                        }
                        redirectToApp();
                        setTimeout(redirectToApp, 2000);
                    </script>
                </body>
                </html>
                """,
                redirectUrl,
                redirectUrl,
                redirectUrl);

        return ResponseEntity.ok()
                .header("Content-Type", "text/html")
                .body(htmlResponse);
    }
}