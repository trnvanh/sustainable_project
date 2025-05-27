import { getPaymentProvidersApi } from '@/api/orders';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface PaymentProviderSelectorProps {
    visible: boolean;
    onClose: () => void;
    onSelectProvider: (provider: "paypal" | "stripe") => void;
    selectedProvider?: "paypal" | "stripe" | null;
}

interface PaymentProvider {
    id: string;
    name: string;
    enabled: boolean;
}

export function PaymentProviderSelector({
    visible,
    onClose,
    onSelectProvider,
    selectedProvider,
}: PaymentProviderSelectorProps) {
    const [providers, setProviders] = useState<PaymentProvider[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchAvailableProviders();
        }
    }, [visible]);

    const fetchAvailableProviders = async () => {
        setLoading(true);
        try {
            const response = await getPaymentProvidersApi();
            console.log('Payment providers API response:', response);

            if (response.success && response.data) {
                console.log('Payment providers data:', response.data);

                // Transform the array of strings to array of PaymentProvider objects
                const providerData = Array.isArray(response.data)
                    ? response.data.map((providerId: string) => ({
                        id: providerId,
                        name: providerId === 'paypal' ? 'PayPal' : 'Credit Card (Stripe)',
                        enabled: true
                    }))
                    : response.data; // In case the backend already returns objects

                console.log('Transformed provider data:', providerData);
                setProviders(providerData);
            } else {
                console.log('API response not successful or no data');
                // Fallback to default providers if API fails
                setProviders([
                    { id: 'paypal', name: 'PayPal', enabled: true },
                    { id: 'stripe', name: 'Credit Card (Stripe)', enabled: true },
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch payment providers:', error);
            // Fallback to default providers
            setProviders([
                { id: 'paypal', name: 'PayPal', enabled: true },
                { id: 'stripe', name: 'Credit Card (Stripe)', enabled: true },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleProviderSelect = (providerId: string) => {
        if (providerId === 'paypal' || providerId === 'stripe') {
            onSelectProvider(providerId);
            onClose();
        }
    };

    const getProviderIcon = (providerId: string) => {
        switch (providerId) {
            case 'paypal':
                return 'logo-paypal';
            case 'stripe':
                return 'card';
            default:
                return 'card';
        }
    };

    const getProviderColor = (providerId: string) => {
        switch (providerId) {
            case 'paypal':
                return '#0070ba';
            case 'stripe':
                return '#6772e5';
            default:
                return '#666';
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Choose Payment Method</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Select your preferred payment method to continue
                    </Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4CAF50" />
                            <Text style={styles.loadingText}>Loading payment options...</Text>
                        </View>
                    ) : (
                        <View style={styles.providersContainer}>
                            {providers
                                .filter(provider => provider.enabled)
                                .map((provider) => (
                                    <TouchableOpacity
                                        key={provider.id}
                                        style={[
                                            styles.providerOption,
                                            selectedProvider === provider.id && styles.selectedProvider,
                                        ]}
                                        onPress={() => handleProviderSelect(provider.id)}
                                    >
                                        <View style={styles.providerInfo}>
                                            <View style={[
                                                styles.iconContainer,
                                                { backgroundColor: `${getProviderColor(provider.id)}15` }
                                            ]}>
                                                <Ionicons
                                                    name={getProviderIcon(provider.id) as any}
                                                    size={24}
                                                    color={getProviderColor(provider.id)}
                                                />
                                            </View>
                                            <Text style={styles.providerName}>{provider.name}</Text>
                                        </View>
                                        <View style={[
                                            styles.radioButton,
                                            selectedProvider === provider.id && styles.selectedRadio,
                                        ]}>
                                            {selectedProvider === provider.id && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    )}

                    {!loading && providers.filter(p => p.enabled).length === 0 && (
                        <View style={styles.noProvidersContainer}>
                            <Text style={styles.noProvidersText}>
                                No payment methods available at the moment.
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
        minHeight: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    providersContainer: {
        gap: 12,
    },
    providerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#f0f0f0',
        backgroundColor: '#fafafa',
    },
    selectedProvider: {
        borderColor: '#4CAF50',
        backgroundColor: '#f8fff8',
    },
    providerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedRadio: {
        borderColor: '#4CAF50',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    noProvidersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    noProvidersText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
