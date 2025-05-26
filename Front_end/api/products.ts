import api from "@/api/axiosConfig";
import { OrderItem } from "@/types/order";
import { ProductRequest, ProductResponse } from "@/types/productTypes";

// const API_BASE_URL = "https://sustainable-be.code4fun.xyz/api/v1/products";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchHistoryOrders = async () => {
    try {
        const response = await api.get<OrderItem>("/products", {} as ProductRequest);
        return response.data;
    } catch (error: any) {
        // throw new Error(error.response?.data?.message || 'Loading failed');
    }
};

export const fetchNearbyOffers = async () => {
    try {
        const response = await api.get<OrderItem>("/products", {} as ProductRequest);
        return response.data;
    } catch (error: any) {
        // throw new Error(error.response?.data?.message || 'Loading failed');
    }
};

export const fetchCurrentDeals = async () => {
    try {
        const response = await api.get<OrderItem>("/products", {} as ProductRequest);
        return response.data;
    } catch (error: any) {
        // throw new Error(error.response?.data?.message || 'Loading failed');
    }
};

export const fetchProductsByCategory = async (categoryId: number) => {
    try {
        // Use the authenticated api instance which includes the token in the request headers
        // The token is automatically added by the interceptor in axiosConfig.ts
        const response = await api.get<ProductResponse[]>(`products/category/${categoryId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching products by category:", error);
        // throw new Error(error.response?.data?.message || 'Failed to load products for this category');
        return [];
    }
};
