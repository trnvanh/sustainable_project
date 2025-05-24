package com.sustanable.foodproduct.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sustanable.foodproduct.entities.StoreEntity;
import com.sustanable.foodproduct.entities.User;
import com.sustanable.foodproduct.repositories.StoreRepository;
import com.sustanable.foodproduct.repositories.UserRepository;
import com.sustanable.foodproduct.services.StoreService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    @Override
    public StoreEntity createStore(StoreEntity store, Integer ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + ownerId));
        store.setOwner(owner);
        return storeRepository.save(store);
    }

    @Override
    public List<StoreEntity> getAllStores() {
        return storeRepository.findAll();
    }

    @Override
    public StoreEntity getStoreById(Long id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Store not found with id: " + id));
    }

    @Override
    public List<StoreEntity> getStoresByOwnerId(Integer ownerId) {
        return storeRepository.findByOwnerId(ownerId);
    }

    @Override
    public StoreEntity updateStore(Long id, StoreEntity store) {
        StoreEntity existingStore = getStoreById(id);

        existingStore.setName(store.getName());
        existingStore.setDescription(store.getDescription());
        existingStore.setAddress(store.getAddress());
        existingStore.setPhoneNumber(store.getPhoneNumber());
        existingStore.setEmail(store.getEmail());
        existingStore.setWebsite(store.getWebsite());
        existingStore.setImage(store.getImage());
        existingStore.setRating(store.getRating());
        existingStore.setOpeningHours(store.getOpeningHours());

        return storeRepository.save(existingStore);
    }

    @Override
    public void deleteStore(Long id) {
        StoreEntity store = getStoreById(id);
        storeRepository.delete(store);
    }
}
