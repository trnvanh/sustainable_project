package com.sustanable.foodproduct.controller;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.config.StripeConfig;
import com.sustanable.foodproduct.dtos.PaymentRequest;
import com.sustanable.foodproduct.dtos.PaymentResponse;
import com.sustanable.foodproduct.entities.PaymentStatus;
import com.sustanable.foodproduct.services.OrderService;
import com.sustanable.foodproduct.services.PaymentService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/stripe")
@RequiredArgsConstructor
@Slf4j
public class StripeController {

    @Qualifier("stripeService")
    private final PaymentService stripeService;
    private final OrderService orderService;
    private final StripeConfig stripeConfig;

    /**
     * Create a Stripe checkout session for an order
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<PaymentResponse> createCheckoutSession(
            @RequestBody PaymentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        try {
            // Verify that the order belongs to the authenticated user
            orderService.getOrderById(request.getOrderId(), userDetails.getId());

            // Create payment with Stripe
            PaymentResponse response = stripeService.createPayment(request);
            return ResponseEntity.ok(response);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(PaymentResponse.builder()
                            .success(false)
                            .message("Order not found or does not belong to user")
                            .build());
        } catch (Exception e) {
            log.error("Error creating Stripe checkout session", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PaymentResponse.builder()
                            .success(false)
                            .message("Error creating checkout session: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Handle successful payment completion
     */
    @GetMapping("/success")
    public ResponseEntity<String> handleSuccess(@RequestParam("session_id") String sessionId) {
        try {
            // Execute payment completion
            PaymentResponse response = stripeService.executePayment(sessionId, null);

            String redirectUrl;
            if (response.isSuccess()) {
                redirectUrl = String.format(
                        "heroeatspay://payment/stripe/success?status=success&sessionId=%s&message=%s",
                        sessionId, "Payment completed successfully");
            } else {
                redirectUrl = String.format("heroeatspay://payment/stripe/success?status=error&message=%s",
                        response.getMessage());
            }

            // Return HTML page that redirects to the app immediately
            String htmlResponse = String.format("""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Payment Processing</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="refresh" content="0; url=%s">
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
                            // Immediate redirect with multiple fallback methods
                            function redirectToApp() {
                                const appUrl = '%s';
                                console.log('Stripe: Attempting to redirect to:', appUrl);

                                try {
                                    // Method 1: Immediate redirect
                                    window.location.href = appUrl;

                                    // Method 2: Replace to prevent back navigation
                                    setTimeout(() => {
                                        window.location.replace(appUrl);
                                    }, 100);

                                    // Method 3: Open in same window
                                    setTimeout(() => {
                                        window.open(appUrl, '_self');
                                    }, 300);

                                } catch (error) {
                                    console.error('Stripe redirect failed:', error);
                                    document.querySelector('.loading').innerHTML =
                                        'Unable to redirect automatically. Please click the link above.';
                                }
                            }

                            // Start redirect immediately
                            redirectToApp();
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
            log.error("Error handling Stripe success", e);
            String errorRedirectUrl = String.format("heroeatspay://payment/stripe/success?status=error&message=%s",
                    "Payment processing failed");

            String errorHtml = String.format("""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Payment Error</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="refresh" content="0; url=%s">
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
                                    setTimeout(() => window.location.replace(appUrl), 100);
                                    setTimeout(() => window.open(appUrl, '_self'), 300);
                                } catch (error) {
                                    console.error('Stripe error redirect failed:', error);
                                }
                            }
                            redirectToApp();
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

    /**
     * Handle payment cancellation
     */
    @GetMapping("/cancel")
    public ResponseEntity<String> handleCancel(@RequestParam("session_id") String sessionId) {
        // Cancel the payment
        stripeService.cancelPayment(sessionId);

        String redirectUrl = String.format(
                "heroeatspay://payment/stripe/cancel?status=cancelled&sessionId=%s&message=%s",
                sessionId, "Payment was cancelled by user");

        String htmlResponse = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Payment Cancelled</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="refresh" content="0; url=%s">
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
                                setTimeout(() => window.location.replace(appUrl), 100);
                                setTimeout(() => window.open(appUrl, '_self'), 300);
                            } catch (error) {
                                console.error('Stripe cancel redirect failed:', error);
                            }
                        }
                        redirectToApp();
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

    /**
     * Webhook endpoint for Stripe events
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeConfig.getStripeWebhookSecret());

            // Handle the event
            switch (event.getType()) {
                case "checkout.session.completed":
                    handleCheckoutSessionCompleted(event);
                    break;
                case "payment_intent.succeeded":
                    handlePaymentIntentSucceeded(event);
                    break;
                case "payment_intent.payment_failed":
                    handlePaymentIntentFailed(event);
                    break;
                default:
                    log.info("Unhandled event type: " + event.getType());
            }

            return ResponseEntity.ok("Success");

        } catch (SignatureVerificationException e) {
            log.error("Invalid signature", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            log.error("Error handling webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook error");
        }
    }

    private void handleCheckoutSessionCompleted(Event event) {
        try {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session != null && session.getMetadata().containsKey("orderId")) {
                Long orderId = Long.valueOf(session.getMetadata().get("orderId"));
                orderService.updatePaymentInfo(orderId, session.getId(), PaymentStatus.COMPLETED);
                log.info("Payment completed for order: " + orderId);
            }
        } catch (Exception e) {
            log.error("Error handling checkout session completed", e);
        }
    }

    private void handlePaymentIntentSucceeded(Event event) {
        log.info("Payment intent succeeded: " + event.getId());
        // Additional handling if needed
    }

    private void handlePaymentIntentFailed(Event event) {
        log.info("Payment intent failed: " + event.getId());
        // Additional handling if needed
    }
}