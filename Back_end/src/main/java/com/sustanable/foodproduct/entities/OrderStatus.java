package com.sustanable.foodproduct.entities;

public enum OrderStatus {
    PENDING, // Order is created but not confirmed
    CONFIRMED, // Order is confirmed by the store
    READY, // Order is ready for pickup
    COMPLETED, // Order has been picked up
    CANCELLED // Order was cancelled
}
