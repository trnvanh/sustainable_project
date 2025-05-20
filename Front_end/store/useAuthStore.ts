import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest, registerRequest } from '@/api/authentication';
import { router } from 'expo-router';

type User = {
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      // Function to set the user state
      login: async (email, password) => {
        const user = await loginRequest(email, password);
        set({ user });
        router.replace('/explore');
      },

      // Function to register a new user
      register: async (fullName, email, password) => {
        const user = await registerRequest(fullName, email, password);
        set({ user });
        router.replace('/explore');
      },

      // Function to log out the user
      logout: () => {
        set({ user: null });
        router.replace('/welcome');
      },
    }),
    {
      name: 'auth-storage', // Unique name for the storage
      partialize: (state) => ({ user: state.user }), // Only persist the user state
    }
  )
);

// Simple hook to track hydration safely
export const useAuthHasHydrated = () =>
  useAuthStore.persist?.hasHydrated() ?? false;
