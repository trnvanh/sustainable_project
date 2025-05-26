import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    fetchHistoryOrders,
    fetchNearbyOffers,
    fetchCurrentDeals,
} from '@/api/products';
import { OrderItem } from '@/types/order';
import {CategoryResponse} from "@/types/categoryTypes";
import {fetchCategories} from "@/api/categories";
import {FavoriteResponse, StoreResponse} from "@/types/favoriteTypes";
import {fetchFavorites, fetchStoreFavorites} from "@/api/favorites";

type ExploreState = {
    favorites: FavoriteResponse[];
    stores: StoreResponse[];
    loading: boolean;
    loadExploreData: () => Promise<void>;
};

export const useFavoritesStore = create<ExploreState>()(
    persist(
        (set) => ({
            favorites: [],
            stores: [],
            loading: false,

            loadExploreData: async () => {
                set({ loading: true });
                const [favorites, stores] = await Promise.all([
                    fetchFavorites(),
                    fetchStoreFavorites(),
                ]);
                set({ favorites, stores, loading: false });
            },
        }),
        {
            name: 'favorites-storage',
        }
    )
);
