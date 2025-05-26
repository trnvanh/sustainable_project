import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchHistoryOrders,
  fetchNearbyOffers,
  fetchCurrentDeals,
  fetchOtherProducts,
  fetchStores,
  updateOrderFeedback,
} from '@/api/products';
import { OrderItem } from '@/types/order';
import { Store } from '@/types/store';

type ExploreState = {
  historyOrders: OrderItem[];
  nearbyOffers: OrderItem[];
  currentDeals: OrderItem[];
  otherProducts: OrderItem[];
  stores: Store[];

  loading: boolean;
  selectedOffer: OrderItem | null;
  setSelectedOffer: (offer: OrderItem) => void;

  loadExploreData: () => Promise<void>;
  updateOrderFeedback: (
    orderId: string,
    customerFeedback: { customerRating: number; feedback: string }
  ) => Promise<void>;
};

export const useProductsStore = create<ExploreState>()(
  persist(
    (set) => ({
      historyOrders: [],
      nearbyOffers: [],
      currentDeals: [],
      otherProducts: [],
      stores: [],

      loading: false,
      selectedOffer: null,

      setSelectedOffer: (offer) => set({ selectedOffer: offer }),

      loadExploreData: async () => {
        set({ loading: true });
        const [historyOrders, nearbyOffers, currentDeals, otherProducts, stores] = await Promise.all([
          fetchHistoryOrders(),
          fetchNearbyOffers(),
          fetchCurrentDeals(),
          fetchOtherProducts(),
          fetchStores(),
        ]);
        set({
          historyOrders,
          nearbyOffers,
          currentDeals,
          otherProducts,
          stores,
          loading: false,
        });
      },

      updateOrderFeedback: async (orderId, customerFeedback) => {
        const updatedOrder = await updateOrderFeedback(orderId, customerFeedback);
        set((state) => ({
          historyOrders: state.historyOrders.map((order) =>
            order.id === orderId ? updatedOrder : order
          ),
        }));
      },
    }),
    {
      name: 'products-storage',
    }
  )
);

