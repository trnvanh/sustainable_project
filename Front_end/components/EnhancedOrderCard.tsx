import { Order, useOrderStore } from '@/store/useOrderStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

interface EnhancedOrderCardProps {
    order: Order;
}

export function EnhancedOrderCard({ order }: EnhancedOrderCardProps) {
    const { cancelOrder, payOrder, loading } = useOrderStore();

    const statusColors = {
        pending: '#FFA726',
        preparing: '#FACC15',
        ready: '#4ADE80',
        completed: '#A3A3A3',
        cancelled: '#F44336',
    };

    const statusText = {
        pending: 'Pending',
        preparing: 'Preparing',
        ready: 'Ready for Pickup',
        completed: 'Completed',
        cancelled: 'Cancelled',
    };

    const handleCancelOrder = () => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await cancelOrder(order.id);
                        if (success) {
                            showMessage({
                                message: 'Order cancelled successfully',
                                type: 'success',
                                icon: 'success',
                            });
                        }
                    },
                },
            ]
        );
    };

    const handlePayOrder = async () => {
        const success = await payOrder(order.id);
        if (success) {
            showMessage({
                message: 'Payment successful!',
                type: 'success',
                icon: 'success',
            });
        }
    };

    const getMainImage = () => {
        if (order.items.length > 0 && order.items[0].image) {
            const image = order.items[0].image;
            if (typeof image === 'string') {
                return { uri: image };
            } else if (typeof image === 'number') {
                return image;
            }
        }
        return { uri: 'https://via.placeholder.com/80x80.png?text=Food' };
    };

    const getMainItemName = () => {
        if (order.items.length === 1) {
            return order.items[0].name;
        } else if (order.items.length > 1) {
            return `${order.items[0].name} +${order.items.length - 1} more`;
        }
        return 'Order';
    };

    const getRestaurantName = () => {
        return order.items[0]?.location?.restaurant || 'Restaurant';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.card}>
            <Image source={getMainImage()} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{getMainItemName()}</Text>
                <Text style={styles.restaurant}>{getRestaurantName()}</Text>
                <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
                <Text style={styles.price}>€{order.totalPrice.toFixed(2)}</Text>

                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
                        <Text style={styles.statusText}>{statusText[order.status]}</Text>
                    </View>

                    {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
                        <View style={[styles.paymentBadge, styles.pendingPayment]}>
                            <Text style={styles.paymentText}>Payment Pending</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.actions}>
                {order.status === 'pending' && (
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelOrder}
                        disabled={loading}
                    >
                        <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                )}

                {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={handlePayOrder}
                        disabled={loading}
                    >
                        <Ionicons name="card" size={16} color="#fff" />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => router.push(`/orders/${order.id}`)}
                >
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        flexDirection: 'row',
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    restaurant: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4CAF50',
        marginBottom: 8,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    paymentBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    pendingPayment: {
        backgroundColor: '#FF9800',
    },
    paymentText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#fff',
    },
    actions: {
        flexDirection: 'column',
        gap: 8,
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
