import { fetchCategories } from "@/api/categories";
import {
    fetchCurrentDeals,
    fetchHistoryOrders,
    fetchNearbyOffers,
    fetchProductsByCategory,
} from '@/api/products';
import { CategoryResponse } from "@/types/categoryTypes";
import { OrderItem } from '@/types/order';
import { ProductResponse } from "@/types/productTypes";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ExploreState = {
    historyOrders: OrderItem[];
    nearbyOffers: OrderItem[];
    currentDeals: OrderItem[];
    categories: CategoryResponse[];
    categoryProducts: ProductResponse[];
    loading: boolean;
    categoryLoading: boolean;
    selectedCategory: CategoryResponse | null;
    selectedOffer: OrderItem | null;
    setSelectedOffer: (offer: OrderItem) => void;
    setSelectedCategory: (category: CategoryResponse) => void;
    loadExploreData: () => Promise<void>;
    loadProductsByCategory: (categoryId: number) => Promise<void>;
};

export const useProductsStore = create<ExploreState>()(
    persist(
        (set) => ({
            historyOrders: [],
            nearbyOffers: [],
            currentDeals: [],
            categories: [],
            categoryProducts: [],
            loading: false,
            categoryLoading: false,
            selectedCategory: null,
            selectedOffer: null,

            setSelectedOffer: (offer) => set({ selectedOffer: offer }),

            setSelectedCategory: (category) => set({ selectedCategory: category }),

            loadExploreData: async () => {
                set({ loading: true });
                try {
                    const historyOrdersData = await fetchHistoryOrders() || [];
                    const nearbyOffersData = await fetchNearbyOffers() || [];
                    const currentDealsData = await fetchCurrentDeals() || [];
                    const categoriesData = await fetchCategories() || [];

                    set({
                        historyOrders: Array.isArray(historyOrdersData) ? historyOrdersData : [],
                        nearbyOffers: Array.isArray(nearbyOffersData) ? nearbyOffersData : [],
                        currentDeals: Array.isArray(currentDealsData) ? currentDealsData : [],
                        categories: Array.isArray(categoriesData) ? categoriesData : [],
                        loading: false
                    });
                } catch (error) {
                    console.error("Error loading explore data:", error);
                    set({ loading: false });
                }
            },

            loadProductsByCategory: async (categoryId: number) => {
                set({ categoryLoading: true });
                try {
                    const products = await fetchProductsByCategory(categoryId) || [];
                    set({
                        categoryProducts: Array.isArray(products) ? products : [],
                        categoryLoading: false
                    });
                } catch (error) {
                    console.error("Error loading products by category:", error);
                    set({ categoryProducts: [], categoryLoading: false });
                }
            },
        }),
        {
            name: 'products-storage',
        }
    )
);
