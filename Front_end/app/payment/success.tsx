import { useOrderStore } from '@/store/useOrderStore';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

export default function PaymentSuccessScreen() {
    const { status, paymentId, message } = useLocalSearchParams<{
        status: string;
        paymentId: string;
        message: string;
    }>();

    const [loading, setLoading] = useState(true);
    const { fetchOrders } = useOrderStore();

    useEffect(() => {
        // Handle the payment result
        handlePaymentResult();
    }, [status, paymentId, message]);

    const handlePaymentResult = async () => {
        try {
            // Refresh orders to get updated payment status
            await fetchOrders();

            if (status === 'success') {
                showMessage({
                    message: 'Payment Successful!',
                    description: message || 'Your payment has been processed successfully.',
                    type: 'success',
                    icon: 'success',
                    duration: 4000,
                });
            } else {
                showMessage({
                    message: 'Payment Failed',
                    description: message || 'There was an issue with your payment.',
                    type: 'danger',
                    icon: 'danger',
                    duration: 4000,
                });
            }
        } catch (error) {
            console.error('Error refreshing orders:', error);
        } finally {
            setLoading(false);
            // Navigate to orders page after a short delay
            setTimeout(() => {
                router.replace('/orders');
            }, 2000);
        }
    };

    const handleContinue = () => {
        router.replace('/orders');
    };

    const isSuccess = status === 'success';

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {loading ? (
                    <>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.loadingText}>Processing payment result...</Text>
                    </>
                ) : (
                    <>
                        <View style={[styles.iconContainer, isSuccess ? styles.successIcon : styles.errorIcon]}>
                            <Ionicons
                                name={isSuccess ? "checkmark-circle" : "close-circle"}
                                size={64}
                                color={isSuccess ? "#4CAF50" : "#f44336"}
                            />
                        </View>

                        <Text style={[styles.title, isSuccess ? styles.successText : styles.errorText]}>
                            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                        </Text>

                        <Text style={styles.message}>
                            {message || (isSuccess ? 'Your payment has been processed successfully.' : 'There was an issue with your payment.')}
                        </Text>

                        {paymentId && (
                            <Text style={styles.paymentId}>
                                Payment ID: {paymentId}
                            </Text>
                        )}

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <Text style={styles.continueButtonText}>Continue to Orders</Text>
                        </TouchableOpacity>
                    </>
                )}
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
        marginBottom: 24,
    },
    successIcon: {
        backgroundColor: '#E8F5E8',
    },
    errorIcon: {
        backgroundColor: '#FFEBEE',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    successText: {
        color: '#4CAF50',
    },
    errorText: {
        color: '#f44336',
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
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#335248',
    },
    continueButton: {
        backgroundColor: '#6A9C89',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 25,
        minWidth: 200,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
