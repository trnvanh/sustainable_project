import { Ionicons } from '@expo/vector-icons/';
import * as Linking from 'expo-linking';
import { Slot, useNavigation, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import FlashMessage from "react-native-flash-message";

function AppLayout() {
    const navigation = useNavigation();
    const router = useRouter();
    const pathname = usePathname();
    //const { user } = useAuth();
    const user = useAuthStore((state) => state.user);

    const hideNavRoutes = ['/login', '/register', '/welcome', '/prelogin', '/email-signup', '/offer'];

    const shouldShowNav = user && !hideNavRoutes.includes(pathname);

    // Handle deep links for PayPal redirects
    useEffect(() => {
        const handleDeepLink = (url: string) => {
            console.log('Deep link received:', url);

            // Parse the URL to extract path and query parameters
            const parsed = Linking.parse(url);
            console.log('Parsed URL:', parsed);

            // Handle payment success redirect
            if (parsed.path === 'payment/success') {
                console.log('Redirecting to payment success screen');
                router.push('/(app)/payment/success' as any);
            }
            // Handle payment cancel redirect
            else if (parsed.path === 'payment/cancel') {
                console.log('Redirecting to payment cancel screen');
                router.push('/(app)/payment/cancel' as any);
            }
        };

        // Handle the initial URL if the app was opened from a deep link
        const handleInitialURL = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl) {
                    console.log('Initial URL:', initialUrl);
                    handleDeepLink(initialUrl);
                }
            } catch (error) {
                console.error('Error getting initial URL:', error);
            }
        };

        // Handle URLs when the app is already running
        const subscription = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        // Check for initial URL
        handleInitialURL();

        // Cleanup subscription
        return () => {
            subscription?.remove();
        };
    }, [router]);

    return (
        <View style={{ flex: 1, paddingBottom: shouldShowNav ? 70 : 0 }}>
            <Slot />
            {shouldShowNav && (
                <View style={styles.navBar}>
                    <NavItem
                        icon="search"
                        label="Explore"
                        active={pathname === '/explore'}
                        onPress={() => router.push('/explore')}
                    />
                    <NavItem
                        icon="heart"
                        label="Favorite"
                        active={pathname === '/favorite'}
                        onPress={() => router.push('/favorite')}
                    />
                    <NavItem
                        icon="person"
                        label="Profile"
                        active={pathname === '/profile'}
                        onPress={() => router.push('/profile')}
                    />
                    <CartNavItem
                        active={pathname === '/cart'}
                        onPress={() => router.push('/cart')}
                    />
                </View>
            )}
            <FlashMessage position="top" />
        </View>
    );
}

// Wrapping AppLayout with AuthProvider
// export default function LayoutWrapper() {
//   return (
//     <AuthProvider>
//       <AppLayout />
//     </AuthProvider>
//   );
// }
export default AppLayout;


function NavItem({ icon, label, active, onPress }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.navItem} onPress={onPress}>
            <Ionicons
                name={active ? icon : `${icon}-outline` as keyof typeof Ionicons.glyphMap}
                size={24}
                color={active ? '#ff6600' : '#fff'}
            />
            <Text style={[styles.navLabel, { color: active ? '#ff6600' : '#fff' }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function CartNavItem({ active, onPress }: { active: boolean; onPress: () => void }) {
    const { getTotalItems } = useCartStore();
    const itemCount = getTotalItems();

    return (
        <TouchableOpacity style={styles.navItem} onPress={onPress}>
            <View style={styles.cartIconContainer}>
                <Ionicons
                    name={active ? 'cart' : 'cart-outline'}
                    size={24}
                    color={active ? '#ff6600' : '#fff'}
                />
                {itemCount > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>
                            {itemCount > 99 ? '99+' : itemCount}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={[styles.navLabel, { color: active ? '#ff6600' : '#fff' }]}>
                Cart
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        paddingBottom: 20,
        backgroundColor: '#16423C',
        borderTopWidth: 1,
        borderTopColor: '#16423C',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    cartIconContainer: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#FF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
});
