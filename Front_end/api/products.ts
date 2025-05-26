import {
    mockHistoryOrders,
    mockNearbyOffers,
    mockCurrentDeals,
    mockOtherProducts,
  } from '@/mocks/data/products';
import { mockStores } from '@/mocks/data/stores';
  
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  
  // fetch history orders (e.g., past purchases)
  export const fetchHistoryOrders = async () => {
    await delay(300);
    return mockHistoryOrders;
  };
  
  // fetch nearby offers (e.g., discounted meals from local stores)
  export const fetchNearbyOffers = async () => {
    await delay(300);
    return mockNearbyOffers;
  };
  
  // fetch current deals (e.g., limited-time offers)
  export const fetchCurrentDeals = async () => {
    await delay(300);
    return mockCurrentDeals;
  };

  // fetch other products (e.g., from different categories)
  export const fetchOtherProducts = async () => {
    await delay(300);
    return mockOtherProducts;
  };

  // fetch all stores
  export const fetchStores = async () => {
    await delay(300);
    return mockStores;
  };
  
  // update an order’s feedback and rating
  export const updateOrderFeedback = async (
  orderId: string,
  customerFeedback: { customerRating: number; feedback: string }
  ) => {
    await new Promise((res) => setTimeout(res, 300));

    const index = mockHistoryOrders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    mockHistoryOrders[index].customerFeedback = customerFeedback;

    return mockHistoryOrders[index];
  };