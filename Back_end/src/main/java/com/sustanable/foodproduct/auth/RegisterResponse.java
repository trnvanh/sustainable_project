package com.sustanable.foodproduct.auth;

import java.util.List;
import com.sustanable.foodproduct.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private String message;
    private boolean success;
    private List<String> errors;
    private UserData userData;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserData {
        private String email;
        private String firstname;
        private String lastname;
        private Role role;
    }
}
