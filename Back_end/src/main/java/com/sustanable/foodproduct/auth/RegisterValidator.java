package com.sustanable.foodproduct.auth;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class RegisterValidator {
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String PHONE_PATTERN = "^\\+?[1-9][0-9]{7,14}$";
    private static final int MIN_PASSWORD_LENGTH = 8;

    public List<String> validate(RegisterRequest request) {
        List<String> errors = new ArrayList<>();

        // Validate firstname
        if (isNullOrEmpty(request.getFirstname())) {
            errors.add("First name is required");
        }

        // Validate lastname
        if (isNullOrEmpty(request.getLastname())) {
            errors.add("Last name is required");
        }

        // Validate email
        if (isNullOrEmpty(request.getEmail())) {
            errors.add("Email is required");
        } else if (!Pattern.matches(EMAIL_PATTERN, request.getEmail())) {
            errors.add("Invalid email format");
        }

        // Validate phone number
        if (isNullOrEmpty(request.getPhoneNumber())) {
            errors.add("Phone number is required");
        } else if (!Pattern.matches(PHONE_PATTERN, request.getPhoneNumber())) {
            errors.add("Invalid phone number format. Please use international format (e.g., +1234567890)");
        }

        // Validate password
        if (isNullOrEmpty(request.getPassword())) {
            errors.add("Password is required");
        } else {
            if (request.getPassword().length() < MIN_PASSWORD_LENGTH) {
                errors.add("Password must be at least 8 characters long");
            }
            if (!containsUpperCase(request.getPassword())) {
                errors.add("Password must contain at least one uppercase letter");
            }
            if (!containsLowerCase(request.getPassword())) {
                errors.add("Password must contain at least one lowercase letter");
            }
            if (!containsNumber(request.getPassword())) {
                errors.add("Password must contain at least one number");
            }
            if (!containsSpecialChar(request.getPassword())) {
                errors.add("Password must contain at least one special character");
            }
        }

        return errors;
    }

    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    private boolean containsUpperCase(String str) {
        return str.chars().anyMatch(Character::isUpperCase);
    }

    private boolean containsLowerCase(String str) {
        return str.chars().anyMatch(Character::isLowerCase);
    }

    private boolean containsNumber(String str) {
        return str.chars().anyMatch(Character::isDigit);
    }

    private boolean containsSpecialChar(String str) {
        return Pattern.compile("[!@#$%^&*(),.?\":{}|<>]").matcher(str).find();
    }
}
