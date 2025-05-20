import { create } from 'zustand';
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
  image?: string | number;
};

type ExploreState = {
  historyOrders: Offer[];
  nearbyOffers: Offer[];
  currentDeals: Offer[];
  loading: boolean;
  loadExploreData: () => Promise<void>;
};

export const useProductsStore = create<ExploreState>((set) => ({
  historyOrders: [],
  nearbyOffers: [],
  currentDeals: [],
  loading: false,

  loadExploreData: async () => {
    set({ loading: true });
    const [historyOrders, nearbyOffers, currentDeals] = await Promise.all([
      fetchHistoryOrders(),
      fetchNearbyOffers(),
      fetchCurrentDeals(),
    ]);

    set({ historyOrders, nearbyOffers, currentDeals, loading: false });
  },
}));
