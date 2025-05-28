import api from "@/api/axiosConfig";
import { StoreResponse } from "@/types/favoriteTypes";

export const fetchStoreById = async (storeId: number): Promise<StoreResponse | null> => {
    try {
        const response = await api.get<StoreResponse>(`/stores/${storeId}`);
        return response.data;
    } catch (error: any) {
        console.error(`Failed to fetch store ${storeId}:`, error.response?.data?.message || error.message);
        return null;
    }
};

export const fetchStores = async (): Promise<StoreResponse[]> => {
    try {
        const response = await api.get<StoreResponse[]>("/stores");
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch stores:', error.response?.data?.message || error.message);
        return [];
    }
};

export const fetchStoresByIds = async (storeIds: number[]): Promise<Map<number, StoreResponse>> => {
    try {
        const storeMap = new Map<number, StoreResponse>();

        // Fetch stores in parallel for better performance
        const storePromises = storeIds.map(id => fetchStoreById(id));
        const stores = await Promise.all(storePromises);

        stores.forEach((store, index) => {
            if (store) {
                storeMap.set(storeIds[index], store);
            }
        });

        return storeMap;
    } catch (error: any) {
        console.error('Failed to fetch stores by IDs:', error);
        return new Map();
    }
};
