package com.sustanable.foodproduct.entities;

public enum PaymentStatus {
    PENDING, // Payment has been initiated but not completed
    COMPLETED, // Payment has been successfully completed
    FAILED, // Payment attempt failed
    CANCELLED // Payment was cancelled by the user
}