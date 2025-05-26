import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CartBadgeProps {
    size?: number;
    color?: string;
    badgeColor?: string;
    showZero?: boolean;
    onPress?: () => void;
}

export default function CartBadge({
    size = 24,
    color = '#333',
    badgeColor = '#FF4444',
    showZero = false,
    onPress
}: CartBadgeProps) {
    const { getTotalItems } = useCartStore();
    const itemCount = getTotalItems();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push('/cart');
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <Ionicons name="cart-outline" size={size} color={color} />
            {(itemCount > 0 || showZero) && (
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>
                        {itemCount > 99 ? '99+' : itemCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
});