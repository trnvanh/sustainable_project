import { fetchCategories } from "@/api/categories";
import {
  advancedSearchProducts,
  fetchCurrentDeals,
  fetchHistoryOrders,
  fetchNearbyOffers,
  fetchProductsByCategory,
  searchProducts,
  searchProductsByDescription,
  searchProductsByName,
  searchProductsByStore,
} from "@/api/products";
import { CategoryResponse } from "@/types/categoryTypes";
import { OrderItem } from "@/types/order";
import { ProductResponse } from "@/types/productTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ExploreState = {
  historyOrders: OrderItem[];
  nearbyOffers: OrderItem[];
  currentDeals: OrderItem[];
  categories: CategoryResponse[];
  categoryProducts: ProductResponse[];
  searchResults: ProductResponse[];
  loading: boolean;
  categoryLoading: boolean;
  searchLoading: boolean;
  searchQuery: string;
  selectedCategory: CategoryResponse | null;
  selectedOffer: OrderItem | null;
  isSearchMode: boolean;
  setSelectedOffer: (offer: OrderItem) => void;
  setSelectedCategory: (category: CategoryResponse) => void;
  loadExploreData: () => Promise<void>;
  loadProductsByCategory: (categoryId: number) => Promise<void>;
  searchProductsAction: (query: string) => Promise<void>;
  searchProductsByNameAction: (name: string) => Promise<void>;
  searchProductsByDescriptionAction: (description: string) => Promise<void>;
  searchProductsByStoreAction: (store: string) => Promise<void>;
  advancedSearchAction: (params: {
    searchTerm?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "price" | "distance" | "rating";
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;
  clearSearch: () => void;
  setSearchQuery: (query: string) => void;
};

export const useProductsStore = create<ExploreState>()(
  persist(
    (set, get) => ({
      historyOrders: [],
      nearbyOffers: [],
      currentDeals: [],
      categories: [],
      categoryProducts: [],
      searchResults: [],
      loading: false,
      categoryLoading: false,
      searchLoading: false,
      searchQuery: "",
      selectedCategory: null,
      selectedOffer: null,
      isSearchMode: false,

      setSelectedOffer: (offer) => set({ selectedOffer: offer }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      clearSearch: () =>
        set({
          searchResults: [],
          searchQuery: "",
          isSearchMode: false,
          searchLoading: false,
        }),

      loadExploreData: async () => {
        set({ loading: true });
        try {
          const historyOrdersData = (await fetchHistoryOrders()) || [];
          const nearbyOffersData = (await fetchNearbyOffers()) || [];
          const currentDealsData = (await fetchCurrentDeals()) || [];
          const categoriesData = (await fetchCategories()) || [];

          set({
            historyOrders: Array.isArray(historyOrdersData)
              ? historyOrdersData
              : [],
            nearbyOffers: Array.isArray(nearbyOffersData)
              ? nearbyOffersData
              : [],
            currentDeals: Array.isArray(currentDealsData)
              ? currentDealsData
              : [],
            categories: Array.isArray(categoriesData) ? categoriesData : [],
            loading: false,
          });
        } catch (error) {
          console.error("Error loading explore data:", error);
          set({ loading: false });
        }
      },

      loadProductsByCategory: async (categoryId: number) => {
        set({ categoryLoading: true });
        try {
          const products = (await fetchProductsByCategory(categoryId)) || [];
          set({
            categoryProducts: Array.isArray(products) ? products : [],
            categoryLoading: false,
          });
        } catch (error) {
          console.error("Error loading products by category:", error);
          set({ categoryProducts: [], categoryLoading: false });
        }
      },

      searchProductsAction: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [], isSearchMode: false });
          return;
        }

        set({ searchLoading: true, isSearchMode: true, searchQuery: query });
        try {
          const results = await searchProducts(query);
          set({
            searchResults: Array.isArray(results) ? results : [],
            searchLoading: false,
          });
        } catch (error) {
          console.error("Error searching products:", error);
          set({ searchResults: [], searchLoading: false });
        }
      },

      searchProductsByNameAction: async (name: string) => {
        if (!name.trim()) {
          set({ searchResults: [], isSearchMode: false });
          return;
        }

        set({ searchLoading: true, isSearchMode: true, searchQuery: name });
        try {
          const results = await searchProductsByName(name);
          set({
            searchResults: Array.isArray(results) ? results : [],
            searchLoading: false,
          });
        } catch (error) {
          console.error("Error searching products by name:", error);
          set({ searchResults: [], searchLoading: false });
        }
      },

      searchProductsByDescriptionAction: async (description: string) => {
        if (!description.trim()) {
          set({ searchResults: [], isSearchMode: false });
          return;
        }

        set({
          searchLoading: true,
          isSearchMode: true,
          searchQuery: description,
        });
        try {
          const results = await searchProductsByDescription(description);
          set({
            searchResults: Array.isArray(results) ? results : [],
            searchLoading: false,
          });
        } catch (error) {
          console.error("Error searching products by description:", error);
          set({ searchResults: [], searchLoading: false });
        }
      },

      searchProductsByStoreAction: async (store: string) => {
        if (!store.trim()) {
          set({ searchResults: [], isSearchMode: false });
          return;
        }

        set({ searchLoading: true, isSearchMode: true, searchQuery: store });
        try {
          const results = await searchProductsByStore(store);
          set({
            searchResults: Array.isArray(results) ? results : [],
            searchLoading: false,
          });
        } catch (error) {
          console.error("Error searching products by store:", error);
          set({ searchResults: [], searchLoading: false });
        }
      },

      advancedSearchAction: async (params: {
        searchTerm?: string;
        categoryId?: number;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: "price" | "distance" | "rating";
        sortOrder?: "asc" | "desc";
      }) => {
        set({
          searchLoading: true,
          isSearchMode: true,
          searchQuery: params.searchTerm || "Advanced Search",
        });
        try {
          const results = await advancedSearchProducts(params);
          set({
            searchResults: Array.isArray(results) ? results : [],
            searchLoading: false,
          });
        } catch (error) {
          console.error("Error in advanced search:", error);
          set({ searchResults: [], searchLoading: false });
        }
      },
    }),
    {
      name: "products-storage",
    }
  )
);
