import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { user, accessToken } = useAuthStore();
    const isAuthenticated = user !== null && accessToken !== null;

    React.useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/prelogin');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    return <View style={{ flex: 1 }}>{children}</View>;
};

export default AuthGuard;