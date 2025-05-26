import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

export default function PaymentCancelScreen() {
    const { paymentId, message } = useLocalSearchParams<{
        paymentId: string;
        message: string;
    }>();

    useEffect(() => {
        // Show cancellation message
        showMessage({
            message: 'Payment Cancelled',
            description: message || 'Your payment has been cancelled.',
            type: 'warning',
            icon: 'warning',
            duration: 4000,
        });
    }, [message]);

    const handleReturnToOrders = () => {
        router.replace('/orders');
    };

    const handleReturnToCart = () => {
        router.replace('/cart');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="close-circle" size={64} color="#ff9800" />
                </View>

                <Text style={styles.title}>Payment Cancelled</Text>

                <Text style={styles.message}>
                    {message || 'Your payment has been cancelled. You can try again or return to your cart.'}
                </Text>

                {paymentId && (
                    <Text style={styles.paymentId}>
                        Payment ID: {paymentId}
                    </Text>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleReturnToOrders}>
                        <Text style={styles.primaryButtonText}>View Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleReturnToCart}>
                        <Text style={styles.secondaryButtonText}>Return to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4DAD2',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ff9800',
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#335248',
        marginBottom: 16,
        lineHeight: 24,
    },
    paymentId: {
        fontSize: 14,
        color: '#666',
        marginBottom: 32,
        fontFamily: 'monospace',
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#6A9C89',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 25,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#6A9C89',
    },
    secondaryButtonText: {
        color: '#6A9C89',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
