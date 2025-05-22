import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchHistoryOrders,
  fetchNearbyOffers,
  fetchCurrentDeals,
} from '@/api/products';
import { OrderItem } from '@/types/order';

type ExploreState = {
  historyOrders: OrderItem[];
  nearbyOffers: OrderItem[];
  currentDeals: OrderItem[];
  loading: boolean;
  selectedOffer: OrderItem | null;
  setSelectedOffer: (offer: OrderItem) => void;
  loadExploreData: () => Promise<void>;
};

export const useProductsStore = create<ExploreState>()(
  persist(
    (set) => ({
      historyOrders: [],
      nearbyOffers: [],
      currentDeals: [],
      loading: false,
      selectedOffer: null,

      setSelectedOffer: (offer) => set({ selectedOffer: offer }),

      loadExploreData: async () => {
        set({ loading: true });
        const [historyOrders, nearbyOffers, currentDeals] = await Promise.all([
          fetchHistoryOrders(),
          fetchNearbyOffers(),
          fetchCurrentDeals(),
        ]);
        set({ historyOrders, nearbyOffers, currentDeals, loading: false });
      },
    }),
    {
      name: 'products-storage', // storage key
    }
  )
);
