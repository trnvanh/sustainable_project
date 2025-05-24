package com.sustanable.foodproduct.controller;

import java.util.List;

import com.sustanable.foodproduct.auth.CustomUserDetails;
import com.sustanable.foodproduct.converter.Converter;
import com.sustanable.foodproduct.dtos.StoreDto;
import com.sustanable.foodproduct.entities.StoreEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.sustanable.foodproduct.services.StoreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping
    public ResponseEntity<StoreDto> createStore(
            @RequestBody StoreDto storeDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var store = Converter.toModel(storeDto, StoreEntity.class);
        var savedStore = storeService.createStore(store, userDetails.getId());
        return ResponseEntity.ok(Converter.toModel(savedStore, StoreDto.class));
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> getAllStores() {
        var stores = storeService.getAllStores();
        return ResponseEntity.ok(Converter.toList(stores, StoreDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable Long id) {
        var store = storeService.getStoreById(id);
        return ResponseEntity.ok(Converter.toModel(store, StoreDto.class));
    }

    @GetMapping("/my-stores")
    public ResponseEntity<List<StoreDto>> getMyStores(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var stores = storeService.getStoresByOwnerId(userDetails.getId());
        return ResponseEntity.ok(Converter.toList(stores, StoreDto.class));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreDto> updateStore(
            @PathVariable Long id,
            @RequestBody StoreDto storeDto) {
        var store = Converter.toModel(storeDto, StoreEntity.class);
        var updatedStore = storeService.updateStore(id, store);
        return ResponseEntity.ok(Converter.toModel(updatedStore, StoreDto.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.ok().build();
    }
}
