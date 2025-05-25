package com.sustanable.foodproduct.services.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sustanable.foodproduct.auth.AuthenticationRequest;
import com.sustanable.foodproduct.auth.AuthenticationResponse;
import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.auth.RegisterRequest;
import com.sustanable.foodproduct.auth.RegisterResponse;
import com.sustanable.foodproduct.auth.RegisterValidator;
import com.sustanable.foodproduct.config.JwtService;
import com.sustanable.foodproduct.config.SecurityEventLogger;
import com.sustanable.foodproduct.entities.Role;
import com.sustanable.foodproduct.entities.Token;
import com.sustanable.foodproduct.entities.User;
import com.sustanable.foodproduct.repositories.TokenRepository;
import com.sustanable.foodproduct.repositories.UserRepository;
import com.sustanable.foodproduct.token.TokenType;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final SecurityEventLogger securityEventLogger;
    private final HttpServletRequest request;
    private final RegisterValidator registerValidator;

    public RegisterResponse register(RegisterRequest request) {
        try {
            var user = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.ADMIN)
                    .build();

            var savedUser = repository.save(user);

            // Generate tokens for the newly registered user
            var userDetails = new CustomUserDetails(savedUser);
            var accessToken = jwtService.generateToken(userDetails);
            var refreshToken = jwtService.generateRefreshToken(userDetails);

            // Save the access token
            saveUserToken(savedUser, accessToken);

            return RegisterResponse.builder()
                    .success(true)
                    .message("Registration successful!")
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .userData(RegisterResponse.UserData.builder()
                            .id(savedUser.getId())
                            .email(savedUser.getEmail())
                            .firstname(savedUser.getFirstname())
                            .lastname(savedUser.getLastname())
                            .role(savedUser.getRole())
                            .build())
                    .build();
        } catch (DataIntegrityViolationException e) {
            return RegisterResponse.builder()
                    .success(false)
                    .message("Registration failed")
                    .errors(List.of("Email already registered"))
                    .build();
        } catch (Exception e) {
            return RegisterResponse.builder()
                    .success(false)
                    .message("Registration failed")
                    .errors(List.of("An unexpected error occurred"))
                    .build();
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            var user = repository.findByEmail(request.getEmail())
                    .orElseThrow();

            var userDetails = new CustomUserDetails(user);

            securityEventLogger.logAuthenticationSuccess(user.getEmail(), this.request);

            var jwtToken = jwtService.generateToken(userDetails);
            var refreshToken = jwtService.generateRefreshToken(userDetails);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);

            return AuthenticationResponse.builder()
                    .success(true)
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .user(AuthenticationResponse.UserData.builder()
                            .id(user.getId())
                            .firstname(user.getFirstname())
                            .lastname(user.getLastname())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .build())
                    .build();
        } catch (Exception e) {
            securityEventLogger.logAuthenticationFailure(request.getEmail(), this.request, e.getMessage());
            return AuthenticationResponse.builder()
                    .success(false)
                    .build();
        }
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail).orElseThrow();
            var userDetails = new CustomUserDetails(user);

            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                var accessToken = jwtService.generateToken(userDetails);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);

                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();

                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
            securityEventLogger.logTokenRevoked(user.getEmail());
        });
        tokenRepository.saveAll(validUserTokens);
    }
}
