import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useOrderStore } from '../../store/useOrderStore';

export default function PaymentSuccessScreen() {
    const { status, paymentId, sessionId, message } = useLocalSearchParams<{
        status: string;
        paymentId: string;
        sessionId: string;
        message: string;
    }>();

    const [loading, setLoading] = useState(true);
    const [paymentProvider, setPaymentProvider] = useState<'paypal' | 'stripe' | 'unknown'>('unknown');
    const { fetchOrders } = useOrderStore();

    // Determine payment provider and effective payment ID
    const effectivePaymentId = paymentId || sessionId;

    useEffect(() => {
        // Determine payment provider based on parameters
        if (paymentId && !sessionId) {
            setPaymentProvider('paypal');
        } else if (sessionId && !paymentId) {
            setPaymentProvider('stripe');
        } else if (paymentId && sessionId) {
            // If both are present, prioritize the one that's not empty
            setPaymentProvider(paymentId.length > sessionId.length ? 'paypal' : 'stripe');
        }
    }, [paymentId, sessionId]);

    // Debug logging
    useEffect(() => {
        console.log('=== Payment Success Screen Loaded ===');
        console.log('Status:', status);
        console.log('PaymentId (PayPal):', paymentId);
        console.log('SessionId (Stripe):', sessionId);
        console.log('Message:', message);
        console.log('Effective Payment ID:', effectivePaymentId);
        console.log('Detected Provider:', paymentProvider);
        console.log('==========================================');
    }, [status, paymentId, sessionId, message, paymentProvider]);

    useEffect(() => {
        // Handle the payment result
        handlePaymentResult();
    }, [status, paymentId, sessionId, message]);

    const handlePaymentResult = async () => {
        try {
            // Add a small delay to ensure the app is ready
            setTimeout(async () => {
                // Refresh orders to get updated payment status
                await fetchOrders();

                if (status === 'success') {
                    const providerName = paymentProvider === 'paypal' ? 'PayPal' :
                        paymentProvider === 'stripe' ? 'Stripe' : 'Payment';

                    showMessage({
                        message: `${providerName} Payment Successful!`,
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
            }, 100); // 100ms delay
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

                        {effectivePaymentId && (
                            <Text style={styles.paymentId}>
                                Payment ID: {effectivePaymentId}
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
