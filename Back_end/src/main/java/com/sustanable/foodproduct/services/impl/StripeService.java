package com.sustanable.foodproduct.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.sustanable.foodproduct.dtos.PaymentRequest;
import com.sustanable.foodproduct.dtos.PaymentResponse;
import com.sustanable.foodproduct.entities.OrderEntity;
import com.sustanable.foodproduct.entities.OrderItemEntity;
import com.sustanable.foodproduct.entities.OrderStatus;
import com.sustanable.foodproduct.entities.PaymentStatus;
import com.sustanable.foodproduct.repositories.OrderRepository;
import com.sustanable.foodproduct.services.OrderService;
import com.sustanable.foodproduct.services.PaymentService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service("stripeService")
@RequiredArgsConstructor
@Slf4j
public class StripeService implements PaymentService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        OrderEntity order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING) {
            return PaymentResponse.builder()
                    .success(false)
                    .message("Order is not in PENDING status, cannot process payment")
                    .build();
        }

        try {
            // Create Stripe Checkout Session
            SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl + "?session_id={CHECKOUT_SESSION_ID}")
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .putMetadata("orderId", order.getId().toString());

            // Add line items from order
            List<SessionCreateParams.LineItem> lineItems = createLineItems(order);
            for (SessionCreateParams.LineItem lineItem : lineItems) {
                paramsBuilder.addLineItem(lineItem);
            }

            SessionCreateParams params = paramsBuilder.build();
            Session session = Session.create(params);

            // Update order with payment session ID
            orderService.updatePaymentInfo(order.getId(), session.getId(), PaymentStatus.PENDING);

            return PaymentResponse.builder()
                    .success(true)
                    .message("Stripe checkout session created successfully")
                    .redirectUrl(session.getUrl())
                    .paymentId(session.getId())
                    .build();

        } catch (StripeException e) {
            log.error("Error creating Stripe checkout session", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("Error creating payment session: " + e.getMessage())
                    .build();
        }
    }

    @Override
    @Transactional
    public PaymentResponse executePayment(String paymentId, String payerId) {
        try {
            // Retrieve the checkout session
            Session session = Session.retrieve(paymentId);

            if ("complete".equals(session.getStatus()) && "paid".equals(session.getPaymentStatus())) {
                // Get order ID from metadata
                String orderIdStr = session.getMetadata().get("orderId");
                if (orderIdStr != null) {
                    Long orderId = Long.valueOf(orderIdStr);

                    // Update order status
                    orderService.updatePaymentInfo(orderId, paymentId, PaymentStatus.COMPLETED);

                    return PaymentResponse.builder()
                            .success(true)
                            .message("Payment completed successfully")
                            .build();
                }
            }

            return PaymentResponse.builder()
                    .success(false)
                    .message("Payment was not completed. Status: " + session.getStatus())
                    .build();

        } catch (StripeException e) {
            log.error("Error executing Stripe payment", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("Error executing payment: " + e.getMessage())
                    .build();
        }
    }

    @Override
    @Transactional
    public PaymentResponse cancelPayment(String paymentId) {
        try {
            // For Stripe, we can't really cancel a checkout session, but we can mark it as
            // cancelled
            Session session = Session.retrieve(paymentId);

            // Get order ID from metadata and update status
            String orderIdStr = session.getMetadata().get("orderId");
            if (orderIdStr != null) {
                Long orderId = Long.valueOf(orderIdStr);
                orderService.updatePaymentInfo(orderId, paymentId, PaymentStatus.CANCELLED);
            }

            return PaymentResponse.builder()
                    .success(true)
                    .message("Payment was cancelled by the user")
                    .build();

        } catch (StripeException e) {
            log.error("Error cancelling Stripe payment", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("Error cancelling payment: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Creates line items for Stripe checkout from order items
     */
    private List<SessionCreateParams.LineItem> createLineItems(OrderEntity order) {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (OrderItemEntity orderItem : order.getItems()) {
            // Convert price from dollars to cents
            long priceInCents = orderItem.getPrice()
                    .multiply(new BigDecimal("100"))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValue();

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity((long) orderItem.getQuantity())
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount(priceInCents)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(orderItem.getProduct().getName())
                                                    .setDescription("Order #" + order.getId() + " - "
                                                            + orderItem.getProduct().getName())
                                                    .build())
                                    .build())
                    .build();

            lineItems.add(lineItem);
        }

        return lineItems;
    }
}