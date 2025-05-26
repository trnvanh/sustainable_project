import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest, registerRequest, updateUserRequest } from '@/api/authentication';
import { router } from 'expo-router';
import { UserProfile } from '@/types/user';
import { showMessage } from 'react-native-flash-message';

type AuthState = {
    user: UserProfile | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (firstname: string, lastname: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (updatedFields: Partial<UserProfile>) => Promise<void>;
    loading: boolean;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,

            // Function to log in a user
            login: async (email, password) => {
                set({ loading: true });
                try {
                    const response = await loginRequest(email, password);
                    if (!response.success) {
                        showMessage({
                            message: 'Failed to login',
                            type: 'danger',
                            icon: 'danger',
                        });
                        router.replace('/login');
                    } else {
                        set({
                            user: {
                                id: response.user.id,
                                email: response.user.email,
                                name: `${response.user.firstname} ${response.user.lastname}`,
                                phone: '0964434888',
                                credits: 748,
                                rescuedMeals: 6,
                                co2SavedKg: 6,
                                moneySavedEur: 123,
                                historyOrderIds: ['1', '2', '3'],
                                preferences: {
                                    theme: 'light',
                                    language: 'en',
                                    notifications: false,
                                },
                            },
                            accessToken: response.accessToken,
                            refreshToken: response.refreshToken,
                            loading: false,
                        });
                        showMessage({
                            message: 'Successfully logged in',
                            type: 'success',
                            icon: 'success',
                        });
                        router.replace('/explore');
                    }
                } catch (error) {
                    set({ loading: false });
                    showMessage({
                        message: 'Failed to login',
                        type: 'danger',
                        icon: 'danger',
                    });
                    router.replace('/login');
                    throw error;
                }
            },

            // Function to register a new user
            register: async (firstname, lastname, email, password) => {
                set({ loading: true });
                try {
                    const response = await registerRequest(firstname, lastname, email, password);
                    if (!response.success) {
                        showMessage({
                            message: 'Failed to register',
                            type: 'danger',
                            icon: 'danger',
                        });
                        router.replace('/welcome');
                    } else {
                        set({
                            user: {
                                id: response.userData?.id,
                                email: response.userData?.email || '',
                                name: `${response.userData?.firstname || ''} ${response.userData?.lastname || ''}`,
                                phone: '0964434888',
                                credits: 748,
                                rescuedMeals: 6,
                                co2SavedKg: 6,
                                moneySavedEur: 123,
                                historyOrderIds: ['1', '2', '3'],
                                preferences: {
                                    theme: 'light',
                                    language: 'en',
                                    notifications: false,
                                },
                            },
                            accessToken: response.accessToken,
                            refreshToken: response.refreshToken,
                            loading: false,
                        });
                        showMessage({
                            message: 'Successfully registered',
                            type: 'success',
                            icon: 'success',
                        });
                        router.replace('/explore');
                    }
                } catch (error) {
                    set({ loading: false });
                    showMessage({
                        message: 'Failed to register',
                        type: 'danger',
                        icon: 'danger',
                    });
                    router.replace('/welcome');
                    throw error;
                }
            },

            // Function to log out the user
            logout: () => {
                set({ user: null, accessToken: null, refreshToken: null, loading: false });
                showMessage({
                    message: 'Successfully logged out',
                    type: 'success',
                    icon: 'success',
                });
                router.replace('/welcome');
            },

            // Update user fields (name, preferences, etc.)
            updateUser: async (updatedFields) => {
                const currentUser = get().user;
                if (!currentUser) return;

                set({ loading: true });
                try {
                    const updatedUser = await updateUserRequest(currentUser.id, updatedFields);
                    set({ user: updatedUser, loading: false });
                    showMessage({
                        message: 'Successfully updated',
                        type: 'success',
                        icon: 'success',
                    });
                } catch (error) {
                    set({ loading: false });
                    showMessage({
                        message: 'Failed to update',
                        type: 'danger',
                        icon: 'danger',
                    });
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);

// Simple hook to track hydration safely
export const useAuthHasHydrated = () => useAuthStore.persist?.hasHydrated() ?? false;