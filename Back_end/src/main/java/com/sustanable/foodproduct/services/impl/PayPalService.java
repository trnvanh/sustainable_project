package com.sustanable.foodproduct.services.impl;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayPalService implements PaymentService {

    private final PayPalHttpClient payPalHttpClient;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Value("${paypal.return-url}")
    private String returnUrl;

    @Value("${paypal.cancel-url}")
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
            OrdersCreateRequest paypalRequest = new OrdersCreateRequest();
            paypalRequest.prefer("return=representation");

            // Set up payment details
            OrderRequest orderRequest = new OrderRequest();
            orderRequest.checkoutPaymentIntent("CAPTURE");

            // Create application context with return URLs
            ApplicationContext applicationContext = new ApplicationContext()
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl);
            orderRequest.applicationContext(applicationContext);

            // Create purchase unit from order
            List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
            PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                    .referenceId(order.getId().toString())
                    .description("Order #" + order.getId())
                    .amountWithBreakdown(createAmountWithBreakdown(order));

            // Add items detail if needed
            if (!order.getItems().isEmpty()) {
                purchaseUnit.items(createItemsList(order));
            }

            purchaseUnits.add(purchaseUnit);
            orderRequest.purchaseUnits(purchaseUnits);

            // Create the PayPal order
            paypalRequest.requestBody(orderRequest);
            HttpResponse<Order> response = payPalHttpClient.execute(paypalRequest);
            Order paypalOrder = response.result();

            // Get approval link
            String approvalUrl = paypalOrder.links().stream()
                    .filter(link -> "approve".equals(link.rel()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No approval link found in PayPal response"))
                    .href();

            return PaymentResponse.builder()
                    .success(true)
                    .message("Payment created successfully")
                    .redirectUrl(approvalUrl)
                    .paymentId(paypalOrder.id())
                    .build();

        } catch (IOException e) {
            log.error("Error creating PayPal payment", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("Error creating payment: " + e.getMessage())
                    .build();
        }
    }

    @Override
    @Transactional
    public PaymentResponse executePayment(String paymentId, String payerId) {
        try {
            OrdersCaptureRequest request = new OrdersCaptureRequest(paymentId);
            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order capturedOrder = response.result();

            // Update order status based on the payment
            if ("COMPLETED".equals(capturedOrder.status())) {
                // Get the order ID from the reference ID
                String referenceId = capturedOrder.purchaseUnits().get(0).referenceId();
                Long orderId = Long.valueOf(referenceId);

                // Use the new method to update payment information
                orderRepository.findById(orderId)
                        .orElseThrow(() -> new EntityNotFoundException("Order not found"));

                orderService.updatePaymentInfo(orderId, paymentId, PaymentStatus.COMPLETED);

                return PaymentResponse.builder()
                        .success(true)
                        .message("Payment completed successfully")
                        .build();
            } else {
                // Get the order ID from the reference ID
                String referenceId = capturedOrder.purchaseUnits().get(0).referenceId();
                Long orderId = Long.valueOf(referenceId);

                // Update the payment status
                orderService.updatePaymentInfo(orderId, paymentId, PaymentStatus.FAILED);

                return PaymentResponse.builder()
                        .success(false)
                        .message("Payment not completed. Status: " + capturedOrder.status())
                        .build();
            }
        } catch (IOException e) {
            log.error("Error executing PayPal payment", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("Error executing payment: " + e.getMessage())
                    .build();
        }
    }

    @Override
    @Transactional
    public PaymentResponse cancelPayment(String paymentId) {
        // Try to find orders with this payment ID and update their status
        try {
            // Get the order from the database using the payment ID
            // Note: In a real implementation, you would need a way to map the payment ID to
            // the order
            // This is a simplified example

            // For demonstration, we'll assume that the order ID is stored in a variable
            // that's set during payment creation

            // Here you would typically look up the order by payment ID
            // OrderEntity order = orderRepository.findByPaymentId(paymentId)
            // .orElse(null);

            // if (order != null) {
            // orderService.updatePaymentInfo(order.getId(), paymentId,
            // PaymentStatus.CANCELLED);
            // }

            // No need to make API call to PayPal for cancellation
            return PaymentResponse.builder()
                    .success(false)
                    .message("Payment was cancelled by the user")
                    .build();
        } catch (Exception e) {
            log.error("Error cancelling payment", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("Error cancelling payment: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Creates the amount with breakdown for the PayPal order
     */
    private AmountWithBreakdown createAmountWithBreakdown(OrderEntity order) {
        BigDecimal itemTotalValue = BigDecimal.ZERO;
        for (OrderItemEntity orderItem : order.getItems()) {
            BigDecimal itemPrice = orderItem.getPrice();
            BigDecimal quantity = new BigDecimal(orderItem.getQuantity());
            itemTotalValue = itemTotalValue.add(itemPrice.multiply(quantity));
        }
        itemTotalValue = itemTotalValue.setScale(2, RoundingMode.HALF_UP);

        BigDecimal orderTotal = order.getTotalAmount().setScale(2, RoundingMode.HALF_UP);
        if (itemTotalValue.compareTo(orderTotal) != 0) {
            throw new IllegalStateException("Item total (" + itemTotalValue + ") does not match order total (" + orderTotal + ")");
        }

        AmountWithBreakdown amount = new AmountWithBreakdown()
                .currencyCode("USD")
                .value(orderTotal.toString());

        if (!order.getItems().isEmpty()) {
            AmountBreakdown breakdown = new AmountBreakdown();
            breakdown.itemTotal(
                    new Money()
                            .currencyCode("USD")
                            .value(itemTotalValue.toString())
            );
            amount.amountBreakdown(breakdown);
        }

        return amount;
    }

    /**
     * Creates the items list for the PayPal order
     */
    private List<Item> createItemsList(OrderEntity order) {
        List<Item> items = new ArrayList<>();

        for (OrderItemEntity orderItem : order.getItems()) {
            Item item = new Item()
                    .name(orderItem.getProduct().getName())
                    .unitAmount(
                            new Money()
                                    .currencyCode("USD")
                                    .value(orderItem.getPrice().setScale(2, RoundingMode.HALF_UP).toString()))
                    .quantity(String.valueOf(orderItem.getQuantity()))
                    .category("DIGITAL_GOODS"); // or PHYSICAL_GOODS if appropriate

            items.add(item);
        }

        return items;
    }
}
