package com.sustanable.foodproduct.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sustanable.foodproduct.entities.Role;
import com.sustanable.foodproduct.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private boolean success;
    private String accessToken;
    private String refreshToken;
    private UserData user;

    @Builder
    @Data
    public static class UserData {
        private Integer id;
        private String firstname;
        private String lastname;
        private String email;
        private String phoneNumber;
        private Role role;
    }
}