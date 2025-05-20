import {
    mockHistoryOrders,
    mockNearbyOffers,
    mockCurrentDeals,
  } from '@/mocks/data/products';
  
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  
  export const fetchHistoryOrders = async () => {
    await delay(300);
    return mockHistoryOrders;
  };
  
  export const fetchNearbyOffers = async () => {
    await delay(300);
    return mockNearbyOffers;
  };
  
  export const fetchCurrentDeals = async () => {
    await delay(300);
    return mockCurrentDeals;
  };
  