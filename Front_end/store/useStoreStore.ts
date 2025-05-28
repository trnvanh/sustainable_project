import { fetchStoreById, fetchStores, fetchStoresByIds } from '@/api/stores';
import { StoreResponse } from '@/types/favoriteTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StoreState {
    stores: Record<number, StoreResponse>;
    loading: boolean;
    error: string | null;

    // Actions
    getStoreById: (storeId: number) => Promise<StoreResponse | null>;
    getStoresByIds: (storeIds: number[]) => Promise<Record<number, StoreResponse>>;
    loadAllStores: () => Promise<void>;
    getStoreAddressById: (storeId: number) => Promise<string>;
    clearStores: () => void;
}

export const useStoreStore = create<StoreState>()(
    persist(
        (set, get) => ({
            stores: {},
            loading: false,
            error: null,

            getStoreById: async (storeId: number): Promise<StoreResponse | null> => {
                const { stores } = get();

                // Check if store is already cached
                if (stores[storeId]) {
                    return stores[storeId];
                }

                // Fetch store from API
                try {
                    set({ loading: true, error: null });
                    const store = await fetchStoreById(storeId);

                    if (store) {
                        set(state => ({
                            stores: { ...state.stores, [storeId]: store },
                            loading: false
                        }));
                        return store;
                    }

                    set({ loading: false });
                    return null;
                } catch (error: any) {
                    set({ loading: false, error: error.message });
                    return null;
                }
            },

            getStoresByIds: async (storeIds: number[]): Promise<Record<number, StoreResponse>> => {
                const { stores } = get();
                const result: Record<number, StoreResponse> = {};
                const missingStoreIds: number[] = [];

                // Check cached stores first
                storeIds.forEach(id => {
                    if (stores[id]) {
                        result[id] = stores[id];
                    } else {
                        missingStoreIds.push(id);
                    }
                });

                // Fetch missing stores
                if (missingStoreIds.length > 0) {
                    try {
                        set({ loading: true, error: null });
                        const fetchedStoresMap = await fetchStoresByIds(missingStoreIds);

                        // Convert Map to Record and add to result
                        const fetchedStores: Record<number, StoreResponse> = {};
                        fetchedStoresMap.forEach((store, id) => {
                            fetchedStores[id] = store;
                            result[id] = store;
                        });

                        set(state => ({
                            stores: { ...state.stores, ...fetchedStores },
                            loading: false
                        }));
                    } catch (error: any) {
                        set({ loading: false, error: error.message });
                    }
                }

                return result;
            },

            loadAllStores: async () => {
                try {
                    set({ loading: true, error: null });
                    const storesList = await fetchStores();

                    const storesRecord: Record<number, StoreResponse> = {};
                    storesList.forEach(store => {
                        storesRecord[store.id] = store;
                    });

                    set({ stores: storesRecord, loading: false });
                } catch (error: any) {
                    set({ loading: false, error: error.message });
                }
            },

            getStoreAddressById: async (storeId: number): Promise<string> => {
                const store = await get().getStoreById(storeId);
                return store?.address || 'Address not available';
            },

            clearStores: () => {
                set({ stores: {}, error: null });
            }
        }),
        {
            name: 'store-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
