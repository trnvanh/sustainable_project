package com.sustanable.foodproduct.dtos;

import java.util.List;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private List<OrderItemRequest> items;
    private String pickupTime;
}
