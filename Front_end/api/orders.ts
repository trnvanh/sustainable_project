import { CartItem } from '@/store/useCartStore';
import api from './axiosConfig';

export interface OrderResponse {
    id: string;
    status: string;
    totalPrice: number;
    items: CartItem[];
    createdAt: string;
    pickupTime: string;
}

export interface OrderApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// Create a new order
export const createOrderApi = async (cartItems: CartItem[], pickupTime?: string): Promise<OrderApiResponse> => {
    try {
        // Generate pickup time for 1 hour after order creation if not provided
        const defaultPickupTime = pickupTime || new Date(Date.now() + 60 * 60 * 1000).toISOString();

        const response = await api.post('/orders', {
            pickupTime: defaultPickupTime,
            items: cartItems.map(item => ({
                productId: parseInt(item.id), // Convert to number as required by backend
                quantity: item.quantity
            }))
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create order',
        };
    }
};

// Pay for an order
export const payOrderApi = async (orderId: string): Promise<OrderApiResponse> => {
    try {
        const response = await api.post(`/orders/${orderId}/pay`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to process payment',
        };
    }
};

// Get all orders for the user
export const getOrdersApi = async (): Promise<OrderApiResponse> => {
    try {
        const response = await api.get('/orders');
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch orders',
        };
    }
};

// Cancel an order
export const cancelOrderApi = async (orderId: string): Promise<OrderApiResponse> => {
    try {
        const response = await api.post(`/orders/${orderId}/cancel`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to cancel order',
        };
    }
};

// Get specific order details
export const getOrderByIdApi = async (orderId: string): Promise<OrderApiResponse> => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch order details',
        };
    }
};

// Update order status
export const updateOrderStatusApi = async (orderId: string, status: string): Promise<OrderApiResponse> => {
    try {
        const response = await api.put(`/orders/${orderId}/status`, null, {
            params: { status }
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update order status',
        };
    }
};
