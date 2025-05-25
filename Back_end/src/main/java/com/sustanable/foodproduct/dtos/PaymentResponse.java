package com.sustanable.foodproduct.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private boolean success;
    private String message;
    private String redirectUrl;
    private String paymentId;
    private String payerId;
}
