package com.sustanable.foodproduct.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "user_favorite_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFavoriteProduct extends BaseEntity {
    
    @EmbeddedId
    private UserFavoriteProductId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserFavoriteProductId implements Serializable {
        @Column(name = "user_id")
        private Integer userId;

        @Column(name = "product_id")
        private Long productId;
    }
}
