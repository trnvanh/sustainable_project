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