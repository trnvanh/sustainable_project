import { Ionicons } from '@expo/vector-icons/';
import * as Linking from 'expo-linking';
import { Slot, useNavigation, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { AuthProvider, useAuth } from '@/hooks/useAuth';
import FlashMessage from "react-native-flash-message";
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

function AppLayout() {
    const navigation = useNavigation();
    const router = useRouter();
    const pathname = usePathname();
    //const { user } = useAuth();
    const user = useAuthStore((state) => state.user);

    const hideNavRoutes = ['/login', '/register', '/welcome', '/email-signup', '/offer'];

    const shouldShowNav = user && !hideNavRoutes.includes(pathname);

    // Handle deep links for PayPal and Stripe redirects
    useEffect(() => {
        const handleDeepLink = (url: string) => {
            console.log('🔗 Deep link received:', url);

            // Parse the URL to extract path and query parameters
            const parsed = Linking.parse(url);
            console.log('📋 Parsed URL:', JSON.stringify(parsed, null, 2));

            // Handle payment success redirect (PayPal)
            if (parsed.path === 'payment/success') {
                console.log('✅ Redirecting to PayPal payment success screen');
                const queryParams = new URLSearchParams();

                // Add query parameters from the deep link
                Object.entries(parsed.queryParams || {}).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });

                const queryString = queryParams.toString();
                const route = queryString ? `/payment/success?${queryString}` : '/payment/success';
                console.log('🎯 Navigating to route:', route);
                router.push(route as any);
            }
            // Handle payment cancel redirect (PayPal)
            else if (parsed.path === 'payment/cancel') {
                console.log('❌ Redirecting to PayPal payment cancel screen');
                const queryParams = new URLSearchParams();

                // Add query parameters from the deep link
                Object.entries(parsed.queryParams || {}).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });

                const queryString = queryParams.toString();
                const route = queryString ? `/payment/cancel?${queryString}` : '/payment/cancel';
                console.log('🎯 Navigating to route:', route);
                router.push(route as any);
            }
            // Handle Stripe payment success redirect
            else if (parsed.path === 'payment/stripe/success') {
                console.log('✅ Redirecting to Stripe payment success screen');
                const queryParams = new URLSearchParams();

                // Add query parameters from the deep link
                Object.entries(parsed.queryParams || {}).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });

                const queryString = queryParams.toString();
                const route = queryString ? `/payment/success?${queryString}` : '/payment/success';
                console.log('🎯 Navigating to route:', route);
                router.push(route as any);
            }
            // Handle Stripe payment cancel redirect
            else if (parsed.path === 'payment/stripe/cancel') {
                console.log('❌ Redirecting to Stripe payment cancel screen');
                const queryParams = new URLSearchParams();

                // Add query parameters from the deep link
                Object.entries(parsed.queryParams || {}).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });

                const queryString = queryParams.toString();
                const route = queryString ? `/payment/cancel?${queryString}` : '/payment/cancel';
                console.log('🎯 Navigating to route:', route);
                router.push(route as any);
            } else {
                console.log('🔍 Unhandled deep link path:', parsed.path);
            }
        };

        // Handle the initial URL if the app was opened from a deep link
        const handleInitialURL = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl) {
                    console.log('🚀 Initial URL detected:', initialUrl);
                    handleDeepLink(initialUrl);
                } else {
                    console.log('📱 App opened normally (no initial URL)');
                }
            } catch (error) {
                console.error('❌ Error getting initial URL:', error);
            }
        };

        // Handle URLs when the app is already running
        const subscription = Linking.addEventListener('url', (event) => {
            console.log('🔄 URL event received while app running:', event.url);
            handleDeepLink(event.url);
        });

        // Check for initial URL
        handleInitialURL();

        // Cleanup subscription
        return () => {
            console.log('🧹 Cleaning up deep link subscription');
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
                        icon="receipt"
                        label="My Orders"
                        active={pathname === '/orders'}
                        onPress={() => router.push('/orders')}
                    />
                    <NavItem
                        icon="heart"
                        label="Favorite"
                        active={pathname === '/favorite'}
                        onPress={() => router.push('/favorite')}
                    />
                    <CartNavItem
                        active={pathname === '/cart'}
                        onPress={() => router.push('/cart')}
                    />
                    <NavItem
                        icon="person"
                        label="Profile"
                        active={pathname === '/profile'}
                        onPress={() => router.push('/profile')}
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
                size={22}
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
        paddingVertical: 8,
        paddingHorizontal: 4,
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
        flex: 1,
        paddingHorizontal: 2,
    },
    navLabel: {
        fontSize: 10,
        marginTop: 2,
        textAlign: 'center',
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
