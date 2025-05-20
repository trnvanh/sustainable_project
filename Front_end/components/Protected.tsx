import React, { useEffect, useState } from 'react';
import { useAuthStore, useAuthHasHydrated } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthHasHydrated();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // This effect is used to wait for the router to be ready before checking the user state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true); // wait 1 tick for router to be ready
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // This effect checks if the user is logged in and redirects to the login page if not
  useEffect(() => {
    if (!hasHydrated || !isReady) return;

    if (user === null) {
      //console.log('Redirecting to /login...', user, hasHydrated);
      router.replace('/login');
    }
  }, [hasHydrated, isReady, user]);

  if (!hasHydrated || !isReady || user === null) {
    //console.log('Loading state...', user, hasHydrated);
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16423C" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D1E3DE',
  },
});
