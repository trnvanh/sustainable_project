import { useAuthStore } from '@/store/useAuthStore';
import React, { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;

    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;

    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;

    // Accent colors
    accent: string;
    success: string;
    warning: string;
    error: string;

    // UI colors
    border: string;
    card: string;
    shadow: string;

    // Status bar
    statusBarStyle: 'light-content' | 'dark-content';
}

export const lightTheme: ThemeColors = {
    background: '#E7F0F1',
    surface: '#FFFFFF',
    surfaceVariant: '#C4DAD2',

    text: '#333333',
    textSecondary: '#555555',
    textMuted: '#666666',

    primary: '#16423C',
    primaryLight: '#6A9C89',
    primaryDark: '#335248',

    accent: '#4CAF50',
    success: '#4ADE80',
    warning: '#FACC15',
    error: '#F44336',

    border: '#E0E0E0',
    card: '#FFFFFF',
    shadow: '#000000',

    statusBarStyle: 'dark-content',
};

export const darkTheme: ThemeColors = {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2D2D2D',

    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#AAAAAA',

    primary: '#4CAF50',
    primaryLight: '#81C784',
    primaryDark: '#2E7D32',

    accent: '#66BB6A',
    success: '#4ADE80',
    warning: '#FFC107',
    error: '#F44336',

    border: '#444444',
    card: '#2D2D2D',
    shadow: '#000000',

    statusBarStyle: 'light-content',
};

interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    const currentTheme = user?.preferences?.theme || 'light';
    const colors = currentTheme === 'dark' ? darkTheme : lightTheme;

    const setTheme = async (newTheme: Theme) => {
        await updateUser({
            preferences: {
                theme: newTheme,
                language: user?.preferences?.language || 'en',
                notifications: user?.preferences?.notifications ?? true,
            },
        });
    };

    const toggleTheme = async () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        await setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme: currentTheme,
                colors,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
