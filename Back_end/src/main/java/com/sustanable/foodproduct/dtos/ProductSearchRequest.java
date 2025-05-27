package com.sustanable.foodproduct.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {
    private String searchTerm;
    private String name;
    private String description;
    private String storeName;
    private Long categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    // Sorting options
    private String sortBy; // name, price, rating, createdDate
    private String sortDirection; // asc, desc

    // Pagination
    private Integer page;
    private Integer size;
}
