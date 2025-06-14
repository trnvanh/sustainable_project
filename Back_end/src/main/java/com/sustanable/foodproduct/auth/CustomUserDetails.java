package com.sustanable.foodproduct.auth;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.sustanable.foodproduct.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CustomUserDetails implements UserDetails {

    private final User user;

    public Integer getId() {
        return user.getId();
    }

    public String getFirstname() {
        return user.getFirstname();
    }

    public String getLastname() {
        return user.getLastname();
    }

    public String getEmail() {
        return user.getEmail();
    }

    public String getPhoneNumber() {
        return user.getPhoneNumber();
    }

    public String getProfileImageUrl() {
        return user.getProfileImageUrl();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRole().getAuthorities();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // used for authentication
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
