package com.sustanable.foodproduct.dtos;

import com.sustanable.foodproduct.entities.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private String phoneNumber;
    private String profileImageUrl;
    private Role role;
}
