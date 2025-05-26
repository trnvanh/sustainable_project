import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '@/types/order';
import { mockUsers } from '@/mocks/data/users';
import { Store } from '@/types/store';
import { useProductsStore } from '@/store/useProductsStore';

type FavoritesState = {
  favoriteItemIds: string[];
  favoriteStoreIds: string[];

  favoriteItems: OrderItem[]; // Full data for display
  favoriteStores: Store[]; // Full data for display

  loadFavorites: (userId: string) => void;
  removeFavoriteItem: (itemId: string) => void;
  removeFavoriteStore: (storeId: string) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteItemIds: [],
      favoriteStoreIds: [],
      favoriteItems: [],
      favoriteStores: [],

      loadFavorites: (userId) => {
        const user = mockUsers.find((u) => u.id === userId);
        if (!user || !user.favorites) {
          set({
            favoriteItemIds: [],
            favoriteStoreIds: [],
            favoriteItems: [],
            favoriteStores: [],
          });
          return;
        }

        const { items: itemIds, stores: storeIds } = user.favorites;

        // Get all products and stores from the ProductsStore
        const {
          historyOrders,
          nearbyOffers,
          currentDeals,
          otherProducts,
          stores,
        } = useProductsStore.getState();

        const allProducts: OrderItem[] = [
          ...historyOrders,
          ...nearbyOffers,
          ...currentDeals,
          ...otherProducts,
        ];

        const favoriteItems = allProducts.filter((p) => itemIds.includes(p.id));
        const favoriteStores = stores.filter((s) =>
          storeIds.includes(s.id)
        );

        set({
          favoriteItemIds: itemIds,
          favoriteStoreIds: storeIds,
          favoriteItems,
          favoriteStores,
        });
      },

      removeFavoriteItem: (itemId) => {
        set((state) => ({
          favoriteItemIds: state.favoriteItemIds.filter((id) => id !== itemId),
          favoriteItems: state.favoriteItems.filter((item) => item.id !== itemId),
        }));
      },

      removeFavoriteStore: (storeId) => {
        set((state) => ({
          favoriteStoreIds: state.favoriteStoreIds.filter((id) => id !== storeId),
          favoriteStores: state.favoriteStores.filter((s) => s.id !== storeId),
        }));
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
