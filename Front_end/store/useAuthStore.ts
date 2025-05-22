import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest, registerRequest, updateUserRequest } from '@/api/authentication';
import { router } from 'expo-router';
import { UserProfile } from '@/types/user';

type AuthState = {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<UserProfile>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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

      // Update user fields (name, preferences, etc.)
      updateUser: async (updatedFields) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = await updateUserRequest(currentUser.id, updatedFields);

        set({ user: updatedUser });
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
