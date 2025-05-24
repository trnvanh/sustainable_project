package com.sustanable.foodproduct.dtos;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private String image;
    private BigDecimal price;
    private String pickupTime;
    private Integer portionsLeft;
    private Double rating;
    private Date expiringDate;
    private Boolean status;
    private Long favourite;
    private Set<CategoryDto> categories = new HashSet<>();
    private Long storeId;
    
    // Audit fields
    private Date createdDate;
    private Date modifiedDate;
    private Integer createdBy;
    private Integer modifiedBy;
}
