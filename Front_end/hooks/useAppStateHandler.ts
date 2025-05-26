import { useOrderStore } from '@/store/useOrderStore';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook to handle app state changes and refresh order status when returning from PayPal
 */
export const useAppStateHandler = () => {
    const appState = useRef(AppState.currentState);
    const { fetchOrders } = useOrderStore();

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            // If app becomes active after being in background, refresh orders
            // This is useful when user returns from PayPal payment
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App has come to the foreground, refreshing orders...');
                fetchOrders();
            }

            appState.current = nextAppState;
        });

        return () => subscription?.remove();
    }, [fetchOrders]);
};
