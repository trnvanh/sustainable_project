import {
    cancelOrderApi,
    createOrderApi,
    getOrderByIdApi,
    getOrdersApi,
    payOrderApi,
    updateOrderStatusApi
} from '@/api/orders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CartItem } from './useCartStore';

export interface Order {
    id: string;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    totalPrice: number;
    items: CartItem[];
    createdAt: string;
    pickupTime: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
}

interface OrderStore {
    orders: Order[];
    loading: boolean;
    error: string | null;

    // Actions
    createOrder: (cartItems: CartItem[], pickupTime?: string) => Promise<boolean>;
    payOrder: (orderId: string) => Promise<boolean>;
    cancelOrder: (orderId: string) => Promise<boolean>;
    fetchOrders: () => Promise<void>;
    getOrderById: (orderId: string) => Promise<Order | null>;
    updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

export const useOrderStore = create<OrderStore>()(
    persist(
        (set, get) => ({
            orders: [],
            loading: false,
            error: null,

            createOrder: async (cartItems: CartItem[], pickupTime?: string): Promise<boolean> => {
                set({ loading: true, error: null });
                try {
                    const response = await createOrderApi(cartItems, pickupTime);
                    if (response.success && response.data) {
                        // Use the pickup time from the request, or the first item's pickup time, or 1 hour from now
                        const orderPickupTime = pickupTime || cartItems[0]?.pickupTime || new Date(Date.now() + 60 * 60 * 1000).toISOString();

                        const newOrder: Order = {
                            id: response.data.id,
                            status: response.data.status || 'pending',
                            totalPrice: response.data.totalPrice,
                            items: cartItems,
                            createdAt: response.data.createdAt || new Date().toISOString(),
                            pickupTime: response.data.pickupTime || orderPickupTime,
                            paymentStatus: 'pending'
                        };

                        set(state => ({
                            orders: [newOrder, ...state.orders],
                            loading: false
                        }));
                        return true;
                    } else {
                        set({ error: response.message || 'Failed to create order', loading: false });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to create order', loading: false });
                    return false;
                }
            },

            payOrder: async (orderId: string): Promise<boolean> => {
                set({ loading: true, error: null });
                try {
                    const response = await payOrderApi(orderId);
                    if (response.success) {
                        set(state => ({
                            orders: state.orders.map(order =>
                                order.id === orderId
                                    ? { ...order, paymentStatus: 'paid' as const }
                                    : order
                            ),
                            loading: false
                        }));
                        return true;
                    } else {
                        set({ error: response.message || 'Payment failed', loading: false });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Payment failed', loading: false });
                    return false;
                }
            },

            cancelOrder: async (orderId: string): Promise<boolean> => {
                set({ loading: true, error: null });
                try {
                    const response = await cancelOrderApi(orderId);
                    if (response.success) {
                        set(state => ({
                            orders: state.orders.map(order =>
                                order.id === orderId
                                    ? { ...order, status: 'cancelled' as const }
                                    : order
                            ),
                            loading: false
                        }));
                        return true;
                    } else {
                        set({ error: response.message || 'Failed to cancel order', loading: false });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to cancel order', loading: false });
                    return false;
                }
            },

            fetchOrders: async (): Promise<void> => {
                set({ loading: true, error: null });
                try {
                    const response = await getOrdersApi();
                    if (response.success && response.data) {
                        const orders: Order[] = response.data.map((orderData: any) => ({
                            id: orderData.id,
                            status: orderData.status,
                            totalPrice: orderData.totalPrice,
                            items: orderData.items || [],
                            createdAt: orderData.createdAt,
                            pickupTime: orderData.pickupTime,
                            paymentStatus: orderData.paymentStatus || 'pending'
                        }));

                        set({ orders, loading: false });
                    } else {
                        set({ error: response.message || 'Failed to fetch orders', loading: false });
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch orders', loading: false });
                }
            },

            getOrderById: async (orderId: string): Promise<Order | null> => {
                set({ loading: true, error: null });
                try {
                    const response = await getOrderByIdApi(orderId);
                    if (response.success && response.data) {
                        const order: Order = {
                            id: response.data.id,
                            status: response.data.status,
                            totalPrice: response.data.totalPrice,
                            items: response.data.items || [],
                            createdAt: response.data.createdAt,
                            pickupTime: response.data.pickupTime,
                            paymentStatus: response.data.paymentStatus || 'pending'
                        };
                        set({ loading: false });
                        return order;
                    } else {
                        set({ error: response.message || 'Order not found', loading: false });
                        return null;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch order', loading: false });
                    return null;
                }
            },

            updateOrderStatus: async (orderId: string, status: string): Promise<boolean> => {
                set({ loading: true, error: null });
                try {
                    const response = await updateOrderStatusApi(orderId, status);
                    if (response.success) {
                        set(state => ({
                            orders: state.orders.map(order =>
                                order.id === orderId
                                    ? { ...order, status: status as Order['status'] }
                                    : order
                            ),
                            loading: false
                        }));
                        return true;
                    } else {
                        set({ error: response.message || 'Failed to update order status', loading: false });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to update order status', loading: false });
                    return false;
                }
            },

            clearError: () => {
                set({ error: null });
            },

            setLoading: (loading: boolean) => {
                set({ loading });
            },
        }),
        {
            name: 'order-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
