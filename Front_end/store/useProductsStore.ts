import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchHistoryOrders,
  fetchNearbyOffers,
  fetchCurrentDeals,
} from '@/api/products';

export type Offer = {
  id: string;
  name: string;
  price: string;
  pickupTime?: string;
  distance?: string;
  portionsLeft: number;
  rating?: number;
  image?: string | number;
  location?: {
    restaurant: string;
    address: string;
  };
  description?: string;
};

type ExploreState = {
  historyOrders: Offer[];
  nearbyOffers: Offer[];
  currentDeals: Offer[];
  loading: boolean;
  selectedOffer: Offer | null;
  setSelectedOffer: (offer: Offer) => void;
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
