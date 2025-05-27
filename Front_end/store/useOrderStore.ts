import {
  cancelOrderApi,
  createOrderApi,
  getOrderByIdApi,
  getOrdersApi,
  payOrderApi,
  updateOrderStatusApi,
} from "@/api/orders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem } from "./useCartStore";

export interface Order {
  id: string;
  status:
    | "pending"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled"
    | "PENDING"
    | "PREPARING"
    | "READY"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";
  totalPrice?: number; // Backend may use totalAmount instead
  totalAmount?: number; // Backend field
  items: CartItem[] | BackendOrderItem[];
  createdAt: string;
  pickupTime: string;
  paymentStatus: "pending" | "paid" | "failed" | "COMPLETED" | null;
  paymentId?: string | null; // PayPal payment ID from backend
}

// Interface to match backend order item structure
export interface BackendOrderItem {
  productId: number | string;
  quantity: number;
  price?: number;
  productName?: string;
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
  refreshOrderPaymentStatus: (orderId: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      error: null,

      createOrder: async (
        cartItems: CartItem[],
        pickupTime?: string
      ): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await createOrderApi(cartItems, pickupTime);
          if (response.success && response.data) {
            // Use the pickup time from the request, or the first item's pickup time, or 1 hour from now
            const orderPickupTime =
              pickupTime ||
              cartItems[0]?.pickupTime ||
              new Date(Date.now() + 60 * 60 * 1000).toISOString();

            const newOrder: Order = {
              id: response.data.id,
              status: response.data.status || "pending",
              // Handle backend returning totalAmount instead of totalPrice
              totalPrice:
                response.data.totalPrice || response.data.totalAmount || 0,
              totalAmount:
                response.data.totalAmount || response.data.totalPrice || 0,
              items: response.data.items || cartItems, // Use backend items if available
              createdAt: response.data.createdAt || new Date().toISOString(),
              pickupTime: response.data.pickupTime || orderPickupTime,
              paymentStatus: response.data.paymentStatus || "pending",
            };

            set((state) => ({
              orders: [newOrder, ...state.orders],
              loading: false,
            }));

            // Automatically initiate payment after successful order creation
            try {
              const paymentResponse = await payOrderApi(response.data.id);
              if (
                paymentResponse.success &&
                paymentResponse.data?.redirectUrl
              ) {
                // Open PayPal checkout page in the system browser
                const { Linking } = require("react-native");
                await Linking.openURL(paymentResponse.data.redirectUrl);
              } else {
                console.warn(
                  "Payment initiation failed:",
                  paymentResponse.message
                );
                // Still return true since order was created successfully
              }
            } catch (paymentError: any) {
              console.warn("Failed to initiate payment:", paymentError.message);
              // Still return true since order was created successfully
            }

            return true;
          } else {
            set({
              error: response.message || "Failed to create order",
              loading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to create order",
            loading: false,
          });
          return false;
        }
      },

      payOrder: async (orderId: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await payOrderApi(orderId);
          if (response.success && response.data?.redirectUrl) {
            // Open PayPal checkout page in the system browser
            const { Linking } = require("react-native");
            await Linking.openURL(response.data.redirectUrl);

            // Note: Payment status will be updated when the user returns from PayPal
            // or through a webhook notification from the backend
            set({ loading: false });
            return true;
          } else if (response.success && response.data?.success) {
            // Payment was already completed
            // Backend may use 'COMPLETED' instead of 'paid'
            const paymentStatus =
              response.data.paymentStatus === "COMPLETED"
                ? "COMPLETED"
                : "paid";

            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId
                  ? {
                      ...order,
                      paymentStatus: paymentStatus as Order["paymentStatus"],
                    }
                  : order
              ),
              loading: false,
            }));
            return true;
          } else {
            set({
              error: response.message || "Payment initiation failed",
              loading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({ error: error.message || "Payment failed", loading: false });
          return false;
        }
      },

      cancelOrder: async (orderId: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await cancelOrderApi(orderId);
          if (response.success) {
            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId
                  ? { ...order, status: "cancelled" as const }
                  : order
              ),
              loading: false,
            }));
            return true;
          } else {
            set({
              error: response.message || "Failed to cancel order",
              loading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to cancel order",
            loading: false,
          });
          return false;
        }
      },

      fetchOrders: async (): Promise<void> => {
        set({ loading: true, error: null });
        try {
          const response = await getOrdersApi();
          if (response.success && response.data) {
            const orders: Order[] = response.data.map((orderData: any) => {
              // Normalize status from backend (uppercase) to frontend format (lowercase)
              const normalizedStatus =
                orderData.status && typeof orderData.status === "string"
                  ? orderData.status.toLowerCase()
                  : "pending";

              // Normalize payment status - handle COMPLETED from backend
              const normalizedPaymentStatus =
                orderData.paymentStatus === "COMPLETED"
                  ? "paid"
                  : orderData.paymentStatus === null ||
                    orderData.paymentStatus === undefined
                  ? "pending"
                  : orderData.paymentStatus?.toLowerCase();

              return {
                id: orderData.id.toString(), // Ensure ID is string
                status: normalizedStatus,
                // Handle both totalPrice and totalAmount fields from backend
                totalPrice: orderData.totalAmount || orderData.totalPrice || 0,
                totalAmount: orderData.totalAmount || orderData.totalPrice || 0,
                items: orderData.items || [],
                createdAt: orderData.createdAt || new Date().toISOString(),
                pickupTime: orderData.pickupTime || "",
                paymentStatus: normalizedPaymentStatus || "pending",
                // Include paymentId for reference
                paymentId: orderData.paymentId || null,
              };
            });

            set({ orders, loading: false });
          } else {
            set({
              error: response.message || "Failed to fetch orders",
              loading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch orders",
            loading: false,
          });
        }
      },

      getOrderById: async (orderId: string): Promise<Order | null> => {
        set({ loading: true, error: null });
        try {
          const response = await getOrderByIdApi(orderId);
          if (response.success && response.data) {
            // Normalize status from backend (uppercase) to frontend format (lowercase)
            const normalizedStatus =
              response.data.status && typeof response.data.status === "string"
                ? response.data.status.toLowerCase()
                : "pending";

            // Normalize payment status
            const normalizedPaymentStatus =
              response.data.paymentStatus === "COMPLETED"
                ? "paid"
                : response.data.paymentStatus === null
                ? "pending"
                : response.data.paymentStatus?.toLowerCase();

            const order: Order = {
              id: response.data.id,
              status: response.data.status,
              // Handle both totalPrice and totalAmount fields
              totalPrice:
                response.data.totalPrice || response.data.totalAmount || 0,
              totalAmount:
                response.data.totalAmount || response.data.totalPrice || 0,
              items: response.data.items || [],
              createdAt: response.data.createdAt,
              pickupTime: response.data.pickupTime,
              paymentStatus: normalizedPaymentStatus || "pending",
            };
            set({ loading: false });
            return order;
          } else {
            set({
              error: response.message || "Order not found",
              loading: false,
            });
            return null;
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch order",
            loading: false,
          });
          return null;
        }
      },

      updateOrderStatus: async (
        orderId: string,
        status: string
      ): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          // Ensure status is uppercase for backend API
          const backendStatus = status.toUpperCase();
          const response = await updateOrderStatusApi(orderId, backendStatus);

          if (response.success) {
            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId
                  ? { ...order, status: backendStatus as Order["status"] }
                  : order
              ),
              loading: false,
            }));
            return true;
          } else {
            set({
              error: response.message || "Failed to update order status",
              loading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to update order status",
            loading: false,
          });
          return false;
        }
      },

      refreshOrderPaymentStatus: async (orderId: string): Promise<void> => {
        try {
          const order = await get().getOrderById(orderId);
          if (order) {
            // Update the order in the store with the latest status from the server
            set((state) => ({
              orders: state.orders.map((o) => (o.id === orderId ? order : o)),
            }));
          }
        } catch (error: any) {
          console.warn(
            "Failed to refresh order payment status:",
            error.message
          );
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
      name: "order-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
