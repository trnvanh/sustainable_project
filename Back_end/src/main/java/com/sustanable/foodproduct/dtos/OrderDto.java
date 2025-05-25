package com.sustanable.foodproduct.dtos;

import java.math.BigDecimal;
import java.util.Set;

import lombok.Data;

@Data
public class OrderDto {
    private Long id;
    private Integer userId;
    private BigDecimal totalAmount;
    private String status;
    private String pickupTime;
    private Set<OrderItemDto> items;
}
