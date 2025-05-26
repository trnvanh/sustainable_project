import { ProductResponse } from '@/types/productTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: string;
    image: string | number;
    quantity: number;
    pickupTime: string;
    location: {
        restaurant: string;
        address: string;
    };
    maxQuantity?: number; // Based on portionsLeft
}

interface CartStore {
    items: CartItem[];
    loading: boolean;
    error: string | null;

    // Actions
    addToCart: (product: ProductResponse, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getItemById: (productId: string) => CartItem | undefined;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,
            error: null,

            addToCart: (product: ProductResponse, quantity = 1) => {
                const existingItem = get().items.find(item => item.id === product.id.toString());

                if (existingItem) {
                    // Update quantity if item already exists
                    const newQuantity = existingItem.quantity + quantity;
                    const maxQuantity = product.portionsLeft || 1;

                    if (newQuantity <= maxQuantity) {
                        set(state => ({
                            items: state.items.map(item =>
                                item.id === product.id.toString()
                                    ? { ...item, quantity: newQuantity }
                                    : item
                            ),
                            error: null
                        }));
                    } else {
                        set({ error: `Only ${maxQuantity} portions available` });
                    }
                } else {
                    // Add new item to cart
                    if (quantity <= (product.portionsLeft || 1)) {
                        const cartItem: CartItem = {
                            id: product.id.toString(),
                            name: product.name,
                            price: product.price.toString(),
                            image: product.image,
                            quantity,
                            pickupTime: product.pickupTime,
                            location: product.location,
                            maxQuantity: product.portionsLeft || 1
                        };

                        set(state => ({
                            items: [...state.items, cartItem],
                            error: null
                        }));
                    } else {
                        set({ error: `Only ${product.portionsLeft} portions available` });
                    }
                }
            },

            removeFromCart: (productId: string) => {
                console.log('removeFromCart called with ID:', productId);

                // Check if product exists before removal
                const itemToRemove = get().items.find(item => item.id === productId);
                if (!itemToRemove) {
                    console.log('Item not found in cart:', productId);
                    return;
                }

                // Ensure the ID is a string for consistent comparison
                const idToRemove = productId.toString();
                console.log('Removing item with ID (toString):', idToRemove);

                // Print debug info
                console.log('Current items before removal:',
                    get().items.map(i => ({ id: i.id, name: i.name })));

                // Update the state by filtering out the item with the matching ID
                set(state => {
                    const newItems = state.items.filter(item => {
                        const result = item.id !== idToRemove;
                        console.log(`Comparing item ID ${item.id} with ${idToRemove}: keep=${result}`);
                        return result;
                    });

                    console.log('Items removed:', state.items.length - newItems.length);

                    return {
                        items: newItems,
                        error: null
                    };
                });

                // Verify removal was successful
                const remainingItems = get().items;
                console.log('Items after removal:', remainingItems.map(i => ({ id: i.id, name: i.name })));
                console.log('Was item removed?', !remainingItems.some(i => i.id === idToRemove));
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }

                const item = get().items.find(item => item.id === productId);
                if (item && item.maxQuantity && quantity > item.maxQuantity) {
                    set({ error: `Only ${item.maxQuantity} portions available` });
                    return;
                }

                set(state => ({
                    items: state.items.map(item =>
                        item.id === productId
                            ? { ...item, quantity }
                            : item
                    ),
                    error: null
                }));
            },

            clearCart: () => {
                set({ items: [], error: null });
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => {
                    const price = typeof item.price === 'string'
                        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                        : item.price;
                    return total + (price * item.quantity);
                }, 0);
            },

            getItemById: (productId: string) => {
                return get().items.find(item => item.id === productId);
            },

            setLoading: (loading: boolean) => {
                set({ loading });
            },

            setError: (error: string | null) => {
                set({ error });
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                console.log('Cart state rehydrated:', state);
            },
        }
    )
);