package com.sustanable.foodproduct.auth;

import java.util.List;
import com.sustanable.foodproduct.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private boolean success;
    private String message;
    private List<String> errors;
    private String accessToken;
    private String refreshToken;
    private UserData userData;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserData {
        private Integer id;
        private String email;
        private String firstname;
        private String lastname;
        private Role role;
    }
}