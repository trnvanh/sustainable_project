import { Order, useOrderStore } from '@/store/useOrderStore';
import { Ionicons } from '@expo/vector-icons';
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
        confirmed: '#4ADE80',
        // Add backend status mappings
        PENDING: '#FFA726',
        PREPARING: '#FACC15',
        READY: '#4ADE80',
        COMPLETED: '#A3A3A3',
        CANCELLED: '#F44336',
        CONFIRMED: '#4ADE80',
    };

    const statusText = {
        pending: 'Pending',
        preparing: 'Preparing',
        ready: 'Ready for Pickup',
        completed: 'Completed',
        cancelled: 'Cancelled',
        confirmed: 'Confirmed',
        // Add backend status mappings
        PENDING: 'Pending',
        PREPARING: 'Preparing',
        READY: 'Ready for Pickup',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
        CONFIRMED: 'Confirmed',
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
        showMessage({
            message: 'Initiating PayPal payment...',
            type: 'info',
            icon: 'info',
            duration: 2000,
        });

        const success = await payOrder(order.id);
        if (success) {
            showMessage({
                message: 'Redirecting to PayPal for payment...',
                type: 'success',
                icon: 'success',
                duration: 3000,
            });
        } else {
            showMessage({
                message: 'Failed to initiate payment. Please try again.',
                type: 'danger',
                icon: 'danger',
            });
        }
    };

    const getMainImage = () => {
        // Since backend doesn't provide images, use a default food image based on product name
        const firstItem = order.items[0];
        const productName = (firstItem as any)?.productName || (firstItem as any)?.name || '';

        // Use different placeholder images based on product type
        if (productName.toLowerCase().includes('pizza')) {
            return { uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop' };
        } else if (productName.toLowerCase().includes('sushi')) {
            return { uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=80&h=80&fit=crop' };
        } else if (productName.toLowerCase().includes('burger')) {
            return { uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop' };
        } else if (productName.toLowerCase().includes('pasta')) {
            return { uri: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=80&h=80&fit=crop' };
        } else if (productName.toLowerCase().includes('salad')) {
            return { uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop' };
        } else if (productName.toLowerCase().includes('thai') || productName.toLowerCase().includes('pad')) {
            return { uri: 'https://images.unsplash.com/photo-1559314809-0f31657b3059?w=80&h=80&fit=crop' };
        } else if (productName.toLowerCase().includes('salmon')) {
            return { uri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&h=80&fit=crop' };
        } else if (productName.toLowerCase().includes('tiramisu') || productName.toLowerCase().includes('dessert')) {
            return { uri: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=80&h=80&fit=crop' };
        }
        return { uri: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop' };
    };

    const getMainItemName = () => {
        if (order.items.length === 1) {
            // Handle both CartItem and BackendOrderItem
            const item = order.items[0];
            return (item as any).productName || (item as any).name || 'Food Item';
        } else if (order.items.length > 1) {
            const item = order.items[0];
            const itemName = (item as any).productName || (item as any).name || 'Food Item';
            return `${itemName} +${order.items.length - 1} more`;
        }
        return 'Order';
    };

    const getRestaurantName = () => {
        // Use different restaurant names based on product type for better UX
        const firstItem = order.items[0];
        const productName = (firstItem as any)?.productName || '';

        if (productName.toLowerCase().includes('pizza')) {
            return 'Italian Kitchen';
        } else if (productName.toLowerCase().includes('sushi')) {
            return 'Sushi Garden';
        } else if (productName.toLowerCase().includes('burger')) {
            return 'Burger House';
        } else if (productName.toLowerCase().includes('pasta')) {
            return 'Pasta Corner';
        } else if (productName.toLowerCase().includes('thai') || productName.toLowerCase().includes('pad')) {
            return 'Thai Express';
        } else if (productName.toLowerCase().includes('salmon')) {
            return 'Fish & More';
        }
        return 'Restaurant';
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if invalid date
            }
            return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            return dateString; // Return original if parsing fails
        }
    };

    const formatPickupTime = (pickupTime: string) => {
        try {
            // Handle various pickup time formats from backend
            if (pickupTime.includes('T')) {
                // ISO format like "2025-05-26T21:30:44.457Z"
                const date = new Date(pickupTime);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            } else if (pickupTime.includes('-') && pickupTime.includes(':')) {
                // Time range format like "20:00-21:00"
                return `Today ${pickupTime}`;
            } else if (pickupTime.includes('-')) {
                // Date format like "2025-01-01"
                const date = new Date(pickupTime);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString();
                }
            }
            return pickupTime;
        } catch (error) {
            return pickupTime;
        }
    };

    return (
        <View style={styles.card}>
            <Image source={getMainImage()} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{getMainItemName()}</Text>
                <Text style={styles.restaurant}>{getRestaurantName()}</Text>
                <Text style={styles.date}>Ordered: {formatDate(order.createdAt)}</Text>
                <Text style={styles.pickupTime}>Pickup: {formatPickupTime(order.pickupTime)}</Text>
                <Text style={styles.price}>€{(order.totalPrice || order.totalAmount || 0).toFixed(2)}</Text>

                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] || '#999' }]}>
                        <Text style={styles.statusText}>{statusText[order.status] || 'Unknown'}</Text>
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
                    onPress={() => {
                        // Navigate to order details - for now just show order info
                        Alert.alert(
                            'Order Details',
                            `Order ID: ${order.id}\nStatus: ${statusText[order.status] || 'Unknown'}\nTotal: €${(order.totalPrice || order.totalAmount || 0).toFixed(2)}\nPayment: ${order.paymentStatus || 'Not set'}\nPickup Time: ${order.pickupTime || 'Not set'}`,
                            [{ text: 'OK' }]
                        );
                    }}
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
        marginBottom: 2,
    },
    pickupTime: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
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
