package com.sustanable.foodproduct.dtos;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long id;
    private Long productId;
    private Integer quantity;
    private BigDecimal price;
    private String productName;
}
