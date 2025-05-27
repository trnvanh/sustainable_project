import { CartItem } from "@/store/useCartStore";
import api from "./axiosConfig";

export interface OrderResponse {
  id: string;
  status: string; // PENDING, PREPARING, READY, CONFIRMED, COMPLETED, CANCELLED
  totalAmount?: number; // Backend uses totalAmount instead of totalPrice
  totalPrice?: number; // For backwards compatibility
  items: any[]; // Backend returns items with productId, quantity, price, productName
  createdAt: string;
  pickupTime: string;
  paymentStatus?: string | null; // COMPLETED, FAILED, or null
}

export interface OrderApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Create a new order
export const createOrderApi = async (
  cartItems: CartItem[],
  pickupTime?: string
): Promise<OrderApiResponse> => {
  try {
    // Generate pickup time for 1 hour after order creation if not provided
    const defaultPickupTime =
      pickupTime || new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const response = await api.post("/orders", {
      pickupTime: defaultPickupTime,
      items: cartItems.map((item) => ({
        productId: parseInt(item.id), // Convert to number as required by backend
        quantity: item.quantity,
      })),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create order",
    };
  }
};

// Pay for an order (with optional payment provider)
export const payOrderApi = async (
  orderId: string,
  paymentProvider?: "paypal" | "stripe"
): Promise<OrderApiResponse> => {
  try {
    const url = paymentProvider
      ? `/orders/${orderId}/pay?provider=${paymentProvider}`
      : `/orders/${orderId}/pay`; // Default to PayPal for backward compatibility

    const response = await api.post(url);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to process payment",
    };
  }
};

// Get all orders for the user
export const getOrdersApi = async (): Promise<OrderApiResponse> => {
  try {
    const response = await api.get("/orders");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};

// Cancel an order
export const cancelOrderApi = async (
  orderId: string
): Promise<OrderApiResponse> => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to cancel order",
    };
  }
};

// Get specific order details
export const getOrderByIdApi = async (
  orderId: string
): Promise<OrderApiResponse> => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch order details",
    };
  }
};

// Update order status
export const updateOrderStatusApi = async (
  orderId: string,
  status: string
): Promise<OrderApiResponse> => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, null, {
      params: { status },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update order status",
    };
  }
};

// Get available payment providers
export const getPaymentProvidersApi = async (): Promise<OrderApiResponse> => {
  try {
    const response = await api.get("/payment-providers");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch payment providers",
    };
  }
};
