package com.sustanable.foodproduct.auth;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {
    private static final int MIN_LENGTH = 8;
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#$%^&*(),.?\":{}|<>]");
    private static final Pattern UPPER_CASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern LOWER_CASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("[0-9]");

    public List<String> validatePassword(String password) {
        List<String> validationErrors = new ArrayList<>();

        if (password == null || password.length() < MIN_LENGTH) {
            validationErrors.add("Password must be at least " + MIN_LENGTH + " characters long");
        }

        if (password != null) {
            if (!SPECIAL_CHAR_PATTERN.matcher(password).find()) {
                validationErrors.add("Password must contain at least one special character");
            }
            if (!UPPER_CASE_PATTERN.matcher(password).find()) {
                validationErrors.add("Password must contain at least one uppercase letter");
            }
            if (!LOWER_CASE_PATTERN.matcher(password).find()) {
                validationErrors.add("Password must contain at least one lowercase letter");
            }
            if (!DIGIT_PATTERN.matcher(password).find()) {
                validationErrors.add("Password must contain at least one digit");
            }
        }

        return validationErrors;
    }
}
