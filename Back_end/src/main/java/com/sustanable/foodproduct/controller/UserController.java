package com.sustanable.foodproduct.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sustanable.foodproduct.dtos.ChangePasswordRequest;
import com.sustanable.foodproduct.dtos.FileResponse;
import com.sustanable.foodproduct.dtos.UpdateUserProfileRequest;
import com.sustanable.foodproduct.dtos.UserProfileResponse;
import com.sustanable.foodproduct.services.MinioService;
import com.sustanable.foodproduct.services.impl.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final MinioService minioService;

    @PatchMapping
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(Principal connectedUser) {
        UserProfileResponse profile = service.getUserProfile(connectedUser);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @RequestBody UpdateUserProfileRequest request,
            Principal connectedUser) {
        UserProfileResponse updatedProfile = service.updateUserProfile(request, connectedUser);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/profile/upload-image")
    public ResponseEntity<String> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Principal connectedUser) {
        try {
            // Upload single file using the convenience method
            FileResponse fileResponse = minioService.uploadSingleFile(file);

            // Get the filename from the response (this should be the accessible URL)
            String imageUrl = fileResponse.getFilename();

            // Update user profile with new image URL
            UpdateUserProfileRequest request = UpdateUserProfileRequest.builder()
                    .profileImageUrl(imageUrl)
                    .build();
            service.updateUserProfile(request, connectedUser);

            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
        }
    }
}
