package com.sustanable.foodproduct.services;

import java.util.List;

import com.sustanable.foodproduct.entities.StoreEntity;

public interface StoreService {
    StoreEntity createStore(StoreEntity store, Integer ownerId);

    List<StoreEntity> getAllStores();

    StoreEntity getStoreById(Long id);

    List<StoreEntity> getStoresByOwnerId(Integer ownerId);

    StoreEntity updateStore(Long id, StoreEntity store);

    void deleteStore(Long id);
}
