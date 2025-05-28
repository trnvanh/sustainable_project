import { Ionicons } from '@expo/vector-icons/';
import * as Linking from 'expo-linking';
import { Slot, useNavigation, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import FlashMessage from "react-native-flash-message";
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

function AppLayout() {
    const navigation = useNavigation();
    const router = useRouter();
    const pathname = usePathname();
    //const { user } = useAuth();
    const user = useAuthStore((state) => state.user);
    const { colors } = useTheme();

    const hideNavRoutes = ['/login', '/register', '/welcome', '/email-signup', '/offer'];

    const shouldShowNav = user && !hideNavRoutes.includes(pathname);

    // Handle deep links for PayPal and Stripe redirects
    useEffect(() => {
        const handleDeepLink = (url: string) => {
            console.log('🔗 Deep link received:', url);

            try {
                // Parse the URL to extract path and query parameters
                const parsed = Linking.parse(url);
                console.log('📋 Parsed URL:', JSON.stringify(parsed, null, 2));

                // Extract payment parameters safely
                const extractParams = (queryParams: any) => {
                    const params = new URLSearchParams();
                    Object.entries(queryParams || {}).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            params.append(key, String(value));
                        }
                    });
                    return params.toString();
                };

                // Handle payment success redirect (PayPal)
                if (parsed.path === 'payment/success') {
                    console.log('✅ Redirecting to PayPal payment success screen');
                    const queryString = extractParams(parsed.queryParams);
                    const route = queryString ? `/payment/success?${queryString}` : '/payment/success';
                    console.log('🎯 Navigating to route:', route);

                    // Use replace to prevent going back to web payment page
                    router.replace(route as any);
                }
                // Handle payment cancel redirect (PayPal)
                else if (parsed.path === 'payment/cancel') {
                    console.log('❌ Redirecting to PayPal payment cancel screen');
                    const queryString = extractParams(parsed.queryParams);
                    const route = queryString ? `/payment/cancel?${queryString}` : '/payment/cancel';
                    console.log('🎯 Navigating to route:', route);

                    // Use replace to prevent going back to web payment page
                    router.replace(route as any);
                }
                // Handle Stripe payment success redirect
                else if (parsed.path === 'payment/stripe/success') {
                    console.log('✅ Redirecting to Stripe payment success screen');
                    const queryString = extractParams(parsed.queryParams);
                    const route = queryString ? `/payment/success?${queryString}` : '/payment/success';
                    console.log('🎯 Navigating to route:', route);

                    // Use replace to prevent going back to web payment page
                    router.replace(route as any);
                }
                // Handle Stripe payment cancel redirect
                else if (parsed.path === 'payment/stripe/cancel') {
                    console.log('❌ Redirecting to Stripe payment cancel screen');
                    const queryString = extractParams(parsed.queryParams);
                    const route = queryString ? `/payment/cancel?${queryString}` : '/payment/cancel';
                    console.log('🎯 Navigating to route:', route);

                    // Use replace to prevent going back to web payment page
                    router.replace(route as any);
                } else {
                    console.log('🔍 Unhandled deep link path:', parsed.path);
                    // For any unhandled payment-related paths, redirect to orders
                    if (parsed.path?.includes('payment')) {
                        console.log('🔄 Redirecting unhandled payment path to orders');
                        router.replace('/orders');
                    }
                }
            } catch (error) {
                console.error('❌ Error parsing deep link:', error);
                // If there's an error parsing, but it's a payment link, go to orders
                if (url.includes('payment')) {
                    console.log('🔄 Error parsing payment link, redirecting to orders');
                    router.replace('/orders');
                }
            }
        };

        // Handle the initial URL if the app was opened from a deep link
        const handleInitialURL = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl) {
                    console.log('🚀 Initial URL detected:', initialUrl);
                    // Add a small delay to ensure the app is fully loaded
                    setTimeout(() => {
                        handleDeepLink(initialUrl);
                    }, 500);
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
                <View style={[styles.navBar, { backgroundColor: colors.primary }]}>
                    <NavItem
                        icon="search"
                        label="Explore"
                        active={pathname === '/explore'}
                        onPress={() => router.push('/explore')}
                        colors={colors}
                    />
                    <NavItem
                        icon="receipt"
                        label="My Orders"
                        active={pathname === '/orders'}
                        onPress={() => router.push('/orders')}
                        colors={colors}
                    />
                    <NavItem
                        icon="heart"
                        label="Favorite"
                        active={pathname === '/favorite'}
                        onPress={() => router.push('/favorite')}
                        colors={colors}
                    />
                    <CartNavItem
                        active={pathname === '/cart'}
                        onPress={() => router.push('/cart')}
                        colors={colors}
                    />
                    <NavItem
                        icon="person"
                        label="Profile"
                        active={pathname === '/profile'}
                        onPress={() => router.push('/profile')}
                        colors={colors}
                    />
                </View>
            )}
            <FlashMessage position="top" />
        </View>
    );
}

// Wrapping AppLayout with ThemeProvider
export default function LayoutWrapper() {
    return (
        <ThemeProvider>
            <AppLayout />
            <FlashMessage position="top" />
        </ThemeProvider>
    );
}


function NavItem({ icon, label, active, onPress, colors }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    active: boolean;
    onPress: () => void;
    colors: any;
}) {
    return (
        <TouchableOpacity style={styles.navItem} onPress={onPress}>
            <Ionicons
                name={active ? icon : `${icon}-outline` as keyof typeof Ionicons.glyphMap}
                size={22}
                color={active ? colors.accent : colors.textMuted}
            />
            <Text style={[styles.navLabel, { color: active ? colors.accent : colors.textMuted }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function CartNavItem({ active, onPress, colors }: { active: boolean; onPress: () => void; colors: any }) {
    const { getTotalItems } = useCartStore();
    const itemCount = getTotalItems();

    return (
        <TouchableOpacity style={styles.navItem} onPress={onPress}>
            <View style={styles.cartIconContainer}>
                <Ionicons
                    name={active ? 'cart' : 'cart-outline'}
                    size={24}
                    color={active ? colors.accent : colors.textMuted}
                />
                {itemCount > 0 && (
                    <View style={[styles.cartBadge, { backgroundColor: colors.error }]}>
                        <Text style={styles.cartBadgeText}>
                            {itemCount > 99 ? '99+' : itemCount}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={[styles.navLabel, { color: active ? colors.accent : colors.textMuted }]}>
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
        borderTopWidth: 1,
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
