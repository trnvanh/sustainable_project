package com.sustanable.foodproduct;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.HashSet;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.Order;
import com.paypal.orders.OrdersCreateRequest;
import com.sustanable.foodproduct.dtos.PaymentRequest;
import com.sustanable.foodproduct.dtos.PaymentResponse;
import com.sustanable.foodproduct.entities.OrderEntity;
import com.sustanable.foodproduct.entities.OrderStatus;
import com.sustanable.foodproduct.entities.User;
import com.sustanable.foodproduct.repositories.OrderRepository;
import com.sustanable.foodproduct.services.OrderService;
import com.sustanable.foodproduct.services.impl.PayPalService;

/**
 * Integration tests for PayPal payment service
 * Note: These tests mock the PayPal API interaction
 */
@SpringBootTest
public class PaymentIntegrationTest {

    @Mock
    private PayPalHttpClient payPalHttpClient;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private PayPalService payPalService;

    private OrderEntity testOrder;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);

        // Create a test order
        User testUser = new User();
        testUser.setId(1);
        testUser.setEmail("test@example.com");

        testOrder = OrderEntity.builder()
                .id(1L)
                .user(testUser)
                .totalAmount(new BigDecimal("50.00"))
                .status(OrderStatus.PENDING)
                .pickupTime("2023-06-01T15:30:00")
                .items(new HashSet<>())
                .build();

        // Mock repository response
        when(orderRepository.findById(1L)).thenReturn(java.util.Optional.of(testOrder));

        // Mock PayPal API response for create payment
        HttpResponse<Order> mockResponse = mock(HttpResponse.class);
        Order mockOrder = mock(Order.class);

        when(mockResponse.result()).thenReturn(mockOrder);
        when(mockOrder.id()).thenReturn("TEST_PAYMENT_ID");
        when(mockOrder.status()).thenReturn("CREATED");

        // Mock links in order response
        com.paypal.orders.LinkDescription approvalLink = new com.paypal.orders.LinkDescription();
        approvalLink.href("https://www.sandbox.paypal.com/checkoutnow?token=TEST_TOKEN");
        approvalLink.rel("approve");

        when(mockOrder.links()).thenReturn(java.util.List.of(approvalLink));

        // Mock successful API call
        when(payPalHttpClient.execute(any(OrdersCreateRequest.class))).thenReturn(mockResponse);
    }

    @Test
    void testCreatePayment() {
        // Create payment request
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setCurrency("USD");
        request.setMethod("paypal");
        request.setIntent("CAPTURE");
        request.setDescription("Test payment");

        // Call service method
        PaymentResponse response = payPalService.createPayment(request);

        // Verify response
        assertTrue(response.isSuccess());
        assertNotNull(response.getRedirectUrl());
        assertEquals("TEST_PAYMENT_ID", response.getPaymentId());
        assertTrue(response.getRedirectUrl().contains("sandbox.paypal.com"));
    }
}