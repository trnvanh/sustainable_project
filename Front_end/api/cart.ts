import { CartItem } from '@/store/useCartStore';
import api from './axiosConfig';

export interface CartApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const addToCartApi = async (productId: number, quantity: number = 1): Promise<CartApiResponse> => {
    console.log("------------------------",productId,quantity)
    try {
        const response = await api.post('/cart/add', {
            productId,
            quantity,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add item to cart',
        };
    }
};

export const removeFromCartApi = async (productId: string): Promise<CartApiResponse> => {
    try {
        const response = await api.delete(`/cart/remove/${productId}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove item from cart',
        };
    }
};

export const updateCartQuantityApi = async (productId: string, quantity: number): Promise<CartApiResponse> => {
    try {
        const response = await api.put('/cart/update', {
            productId,
            quantity,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update cart item',
        };
    }
};

export const getCartItemsApi = async (): Promise<CartApiResponse> => {
    try {
        const response = await api.get('/cart');
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch cart items',
        };
    }
};

export const clearCartApi = async (): Promise<CartApiResponse> => {
    try {
        const response = await api.delete('/cart/clear');
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to clear cart',
        };
    }
};

export const checkoutApi = async (cartItems: CartItem[]): Promise<CartApiResponse> => {
    try {
        const response = await api.post('/cart/checkout', {
            items: cartItems,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to process checkout',
        };
    }
};