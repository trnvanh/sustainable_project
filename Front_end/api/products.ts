import api from "@/api/axiosConfig";
import { OrderItem } from "@/types/order";
import { ProductRequest, ProductResponse } from "@/types/productTypes";

// const API_BASE_URL = "https://sustainable-be.code4fun.xyz/api/v1/products";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchHistoryOrders = async () => {
  try {
    const response = await api.get<OrderItem>(
      "/products",
      {} as ProductRequest
    );
    return response.data;
  } catch (error: any) {
    // throw new Error(error.response?.data?.message || 'Loading failed');
  }
};

export const fetchNearbyOffers = async () => {
  try {
    const response = await api.get<OrderItem>(
      "/products",
      {} as ProductRequest
    );
    return response.data;
  } catch (error: any) {
    // throw new Error(error.response?.data?.message || 'Loading failed');
  }
};

export const fetchCurrentDeals = async () => {
  try {
    const response = await api.get<OrderItem>(
      "/products",
      {} as ProductRequest
    );
    return response.data;
  } catch (error: any) {
    // throw new Error(error.response?.data?.message || 'Loading failed');
  }
};

export const fetchProductsByCategory = async (categoryId: number) => {
  try {
    // Use the authenticated api instance which includes the token in the request headers
    // The token is automatically added by the interceptor in axiosConfig.ts
    const response = await api.get<ProductResponse[]>(
      `products/category/${categoryId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products by category:", error);
    // throw new Error(error.response?.data?.message || 'Failed to load products for this category');
    return [];
  }
};

// Search functions
export const searchProducts = async (searchTerm: string) => {
  try {
    const response = await api.get<ProductResponse[]>(
      `/products/search?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const searchProductsByName = async (name: string) => {
  try {
    const response = await api.get<ProductResponse[]>(
      `/products/search?name=${encodeURIComponent(name)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error searching products by name:", error);
    return [];
  }
};

export const searchProductsByDescription = async (description: string) => {
  try {
    const response = await api.get<ProductResponse[]>(
      `/products/search?description=${encodeURIComponent(description)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error searching products by description:", error);
    return [];
  }
};

export const searchProductsByStore = async (store: string) => {
  try {
    const response = await api.get<ProductResponse[]>(
      `/products/search?store=${encodeURIComponent(store)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error searching products by store:", error);
    return [];
  }
};

export const advancedSearchProducts = async (params: {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "distance" | "rating";
  sortOrder?: "asc" | "desc";
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.searchTerm) queryParams.append("q", params.searchTerm);
    if (params.categoryId)
      queryParams.append("categoryId", params.categoryId.toString());
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await api.get<ProductResponse[]>(
      `/products/search/advanced?${queryParams}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in advanced search:", error);
    return [];
  }
};
