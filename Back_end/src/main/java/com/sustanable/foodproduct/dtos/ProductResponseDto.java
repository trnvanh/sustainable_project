package com.sustanable.foodproduct.dtos;

import com.sustanable.foodproduct.entities.CategoryEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProductResponseDto extends ProductDto {
    private boolean isFavorited;
    private Long favoriteCount;
}
