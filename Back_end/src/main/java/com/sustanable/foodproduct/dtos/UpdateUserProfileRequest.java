package com.sustanable.foodproduct.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserProfileRequest {
    private String firstname;
    private String lastname;
    private String phoneNumber;
    private String profileImageUrl;
}
