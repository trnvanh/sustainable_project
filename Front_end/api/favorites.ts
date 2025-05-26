import api from "@/api/axiosConfig";
import {FavoriteResponse, StoreResponse} from "@/types/favoriteTypes";

export const fetchFavorites = async () => {
    try {
        const response = await api.get<FavoriteResponse>("/products/favorites");
        return response.data;
    } catch (error: any) {
        // throw new Error(error.response?.data?.message || 'Loading failed');
    }
};

export const fetchStoreFavorites = async () => {
    try {
        const response = await api.get<StoreResponse>("/stores");
        return response.data;
    } catch (error: any) {
        // throw new Error(error.response?.data?.message || 'Loading failed');
    }
};
