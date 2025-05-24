package com.sustanable.foodproduct.controller;

import java.util.List;

import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sustanable.foodproduct.entities.StoreEntity;
import com.sustanable.foodproduct.services.StoreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping
    public ResponseEntity<StoreEntity> createStore(
            @RequestBody StoreEntity store,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Integer userId = userDetails.getId();
        return ResponseEntity.ok(storeService.createStore(store, userId));
    }


    @GetMapping
    public ResponseEntity<List<StoreEntity>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreEntity> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping("/my-stores")
    public ResponseEntity<List<StoreEntity>> getMyStores(
            @AuthenticationPrincipal UserDetails userDetails) {
        Integer userId = ((com.sustanable.foodproduct.entities.User) userDetails).getId();
        return ResponseEntity.ok(storeService.getStoresByOwnerId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreEntity> updateStore(
            @PathVariable Long id,
            @RequestBody StoreEntity store) {
        return ResponseEntity.ok(storeService.updateStore(id, store));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.ok().build();
    }
}
