package com.sustanable.foodproduct.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image")
    private String image;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "pickup_time", nullable = false)
    private String pickupTime;

    @Column(name = "distance")
    private Double distance;

    @Column(name = "portions_left", nullable = false)
    @Min(0)
    private Integer portionsLeft;

    @Column(name = "rating")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "5.0")
    private Double rating;

    @Column(name = "expiring_date")
    private Date expiringDate;

    @Column(name = "status")
    @Builder.Default
    private Boolean status = true;

    @NotNull
    @Min(0)
    @Builder.Default
    @Column(name = "favourite")
    private Long favourite = 0L;

    @Embedded
    private Location location;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Location {
        @Column(name = "restaurant")
        private String restaurant;

        @Column(name = "address")
        private String address;
    }
}
