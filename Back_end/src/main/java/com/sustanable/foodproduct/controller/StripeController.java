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
                            // Multiple redirect methods for better compatibility
                            window.location.href = '%s';
                            window.location.replace('%s');

                            // Fallback after 1 second
                            setTimeout(function() {
                                window.open('%s', '_self');
                            }, 1000);
                        </script>
                    </body>
                    </html>
                    """,
                    redirectUrl,
                    response.isSuccess() ? "success" : "error",
                    response.isSuccess() ? "Payment Successful!" : "Payment Failed",
                    response.getMessage(),
                    redirectUrl,
                    redirectUrl,
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
                            // Multiple redirect methods for better compatibility
                            window.location.href = '%s';
                            window.location.replace('%s');

                            // Fallback after 1 second
                            setTimeout(function() {
                                window.open('%s', '_self');
                            }, 1000);
                        </script>
                    </body>
                    </html>
                    """,
                    errorRedirectUrl,
                    errorRedirectUrl,
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
                        // Multiple redirect methods for better compatibility
                        window.location.href = '%s';
                        window.location.replace('%s');

                        // Fallback after 1 second
                        setTimeout(function() {
                            window.open('%s', '_self');
                        }, 1000);
                    </script>
                </body>
                </html>
                """,
                redirectUrl,
                redirectUrl,
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