package com.sustanable.foodproduct.dtos;

import java.util.List;

import lombok.Data;

public class CreateOrderRequest {
    private List<OrderItemRequest> items;
    private String pickupTime;

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public String getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(String pickupTime) {
        this.pickupTime = pickupTime;
    }
}
