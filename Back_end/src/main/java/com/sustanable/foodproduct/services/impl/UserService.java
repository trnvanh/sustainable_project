package com.sustanable.foodproduct.services.impl;

import java.security.Principal;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.dtos.ChangePasswordRequest;
import com.sustanable.foodproduct.dtos.UpdateUserProfileRequest;
import com.sustanable.foodproduct.dtos.UserProfileResponse;
import com.sustanable.foodproduct.entities.User;
import com.sustanable.foodproduct.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var customUserDetails = (CustomUserDetails) ((UsernamePasswordAuthenticationToken) connectedUser)
                .getPrincipal();
        var user = customUserDetails.getUser();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        repository.save(user);
    }

    public UserProfileResponse getUserProfile(Principal connectedUser) {
        var customUserDetails = (CustomUserDetails) ((UsernamePasswordAuthenticationToken) connectedUser)
                .getPrincipal();
        var user = customUserDetails.getUser();

        return UserProfileResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .build();
    }

    public UserProfileResponse updateUserProfile(UpdateUserProfileRequest request, Principal connectedUser) {
        var customUserDetails = (CustomUserDetails) ((UsernamePasswordAuthenticationToken) connectedUser)
                .getPrincipal();
        var user = customUserDetails.getUser();

        // Update fields if provided
        if (request.getFirstname() != null && !request.getFirstname().trim().isEmpty()) {
            user.setFirstname(request.getFirstname().trim());
        }
        if (request.getLastname() != null && !request.getLastname().trim().isEmpty()) {
            user.setLastname(request.getLastname().trim());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        // Save updated user
        User savedUser = repository.save(user);

        return UserProfileResponse.builder()
                .id(savedUser.getId())
                .firstname(savedUser.getFirstname())
                .lastname(savedUser.getLastname())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .profileImageUrl(savedUser.getProfileImageUrl())
                .role(savedUser.getRole())
                .build();
    }
}
