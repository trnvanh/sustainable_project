import ScreenWithBack from '@/components/ScreenBack';
import { CartItem } from '@/store/useCartStore';
import { Order, useOrderStore } from '@/store/useOrderStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderHistoryScreen() {
  const { orders, fetchOrders, loading, error } = useOrderStore();

  // Filter to only show completed and cancelled orders
  const orderHistory = orders.filter(order =>
    ['completed', 'cancelled', 'COMPLETED', 'CANCELLED'].includes(order.status)
  );

  // Show all orders for debugging
  const showAllOrders = true; // Set to true to show all orders regardless of status

  // Use mock orders by default to show example data even when the API isn't working
  const useMockData = false; // Set to false when the API is working properly

  // Use either mock orders or real orders based on flags and availability
  const effectiveOrders = orders;
  const effectiveOrderHistory = orderHistory;

  // Determine which orders to display
  const displayOrders = showAllOrders ? effectiveOrders : effectiveOrderHistory;

  // For debugging
  console.log('Real orders:', orders);
  console.log('Real filtered history:', orderHistory);
  console.log('Display orders:', displayOrders);

  // For network error handling
  const [hasError, setHasError] = useState(false);

  // Debug functions removed

  // Load orders when component mounts
  useEffect(() => {
    fetchOrders().catch(err => {
      console.error("Error fetching orders:", err);
      setHasError(true);
    });
  }, []);

  // Display error messages
  useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger',
        icon: 'danger',
      });
      setHasError(true);
    }
  }, [error]);

  // Helper function to check if an item is a CartItem (frontend) or BackendOrderItem
  const isCartItem = (item: any): item is CartItem => {
    return item && item.name !== undefined && item.price !== undefined;
  };

  const isBackendItem = (item: any): boolean => {
    return item && (item.productId !== undefined || item.productName !== undefined);
  };

  const getMainImage = (order: Order) => {
    if (!order || !order.items || order.items.length === 0) {
      return { uri: 'https://via.placeholder.com/80x80.png?text=Food' };
    }

    const firstItem = order.items[0];

    // Handle CartItem format (frontend)
    if (isCartItem(firstItem) && firstItem.image) {
      const image = firstItem.image;
      if (typeof image === 'string') {
        return { uri: image };
      } else if (typeof image === 'number') {
        return image;
      }
    }

    // If we reach here, return a placeholder
    return { uri: 'https://via.placeholder.com/80x80.png?text=Food' };
  };

  const getMainItemName = (order: Order) => {
    if (!order || !order.items || order.items.length === 0) return 'Order';

    const firstItem = order.items[0];

    // Handle CartItem format (frontend)
    if (isCartItem(firstItem)) {
      if (order.items.length === 1) {
        return firstItem.name;
      } else {
        return `${firstItem.name} +${order.items.length - 1} more`;
      }
    }
    // Handle BackendOrderItem format
    else if (isBackendItem(firstItem)) {
      const name = firstItem.productName || `Product ${firstItem.productId}`;
      if (order.items.length === 1) {
        return name;
      } else {
        return `${name} +${order.items.length - 1} more`;
      }
    }

    return 'Order';
  };

  const getRestaurantName = (order: Order) => {
    if (!order || !order.items || order.items.length === 0) return 'Restaurant';

    const firstItem = order.items[0];

    // Handle CartItem format (frontend)
    if (isCartItem(firstItem) && firstItem.location?.restaurant) {
      return firstItem.location.restaurant;
    }

    return 'Restaurant';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const statusColors: Record<string, string> = {
    // Lowercase statuses (frontend format)
    completed: '#A3A3A3',
    cancelled: '#F44336',
    pending: '#FFA726',
    preparing: '#FACC15',
    ready: '#4ADE80',
    // Uppercase statuses (backend format)
    COMPLETED: '#A3A3A3',
    CANCELLED: '#F44336',
    PENDING: '#FFA726',
    PREPARING: '#FACC15',
    READY: '#4ADE80',
    CONFIRMED: '#4ADE80', // Assuming CONFIRMED is similar to READY
  };

  const statusText: Record<string, string> = {
    // Lowercase statuses (frontend format)
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    // Uppercase statuses (backend format)
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending',
    PREPARING: 'Preparing',
    READY: 'Ready for Pickup',
    CONFIRMED: 'Confirmed',
  };

  // Helper function to normalize status for display
  const getNormalizedStatus = (status?: string): string => {
    if (!status) return 'Unknown';

    // Return the status as-is if it's a valid key in our status mappings
    if (Object.keys(statusText).includes(status)) return status;

    // Try lowercase version
    const lowercaseStatus = status.toLowerCase();
    if (Object.keys(statusText).includes(lowercaseStatus)) return lowercaseStatus;

    return 'Unknown';
  };

  const renderItem = ({ item }: { item: Order }) => {
    // Get the normalized status for display and color
    const statusKey = item.status as keyof typeof statusColors;
    const paymentStatusKey = item.paymentStatus as string;

    // Get the total price (handle both totalPrice and totalAmount from backend)
    const totalPrice = item.totalPrice !== undefined ? item.totalPrice : (item.totalAmount || 0);

    // Format items for display in alert
    const formatItemsForDisplay = () => {
      if (!item.items || item.items.length === 0) return 'No items';

      return item.items.map(i => {
        if (isCartItem(i)) {
          return `${i.name} (x${i.quantity || 1})`;
        } else if (isBackendItem(i)) {
          return `${i.productName || `Product ${i.productId}`} (x${i.quantity || 1})`;
        }
        return 'Unknown item';
      }).join(', ');
    };

    // Helper to determine payment status display
    const getPaymentStatusDisplay = () => {
      if (!paymentStatusKey) return null;

      // Check for various payment status formats
      const isPaid = paymentStatusKey === 'paid' || paymentStatusKey === 'COMPLETED' || paymentStatusKey === 'completed';
      const isPending = paymentStatusKey === 'pending' || paymentStatusKey === 'PENDING' || paymentStatusKey === null;

      if (isPending) return null; // Don't show badge for pending

      return (
        <View style={[styles.paymentBadge, isPaid ? styles.paidBadge : styles.failedBadge]}>
          <Text style={styles.paymentText}>{isPaid ? 'Paid' : 'Payment Failed'}</Text>
        </View>
      );
    };

    return (
      <View style={styles.card}>
        <Image source={getMainImage(item)} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{getMainItemName(item)}</Text>
          <Text style={styles.price}>€{totalPrice ? totalPrice.toFixed(2) : '0.00'}</Text>
          <Text style={styles.location}>{getRestaurantName(item)}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: statusColors[statusKey] || '#999' }
            ]}>
              <Text style={styles.statusText}>{statusText[statusKey] || 'Unknown'}</Text>
            </View>
            {getPaymentStatusDisplay()}
          </View>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            // Show order details in an alert
            Alert.alert(
              'Order Details',
              `Order ID: ${item.id}\nStatus: ${statusText[statusKey] || 'Unknown'}\nTotal: €${totalPrice ? totalPrice.toFixed(2) : '0.00'}\nPickup Time: ${item.pickupTime ? formatDate(item.pickupTime) : 'Not set'}\nItems: ${formatItemsForDisplay()}`,
              [{ text: 'OK' }]
            );
          }}
        >
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  // Debug functions removed

  return (
    <SafeAreaView style={styles.container}>
      <ScreenWithBack title="Order History">
      <Text style={styles.title}>Order History</Text>

      {loading && !useMockData && displayOrders.length === 0 ? (
        // Loading state - only show if not using mock data
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order history...</Text>
        </View>
      ) : hasError && displayOrders.length === 0 ? (
        // Error state
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
          <Text style={styles.errorText}>Error loading order history</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              setHasError(false);
              fetchOrders();
            }}
          >
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : displayOrders.length === 0 ? (
        // Empty state
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={48} color="#999" />
          <Text style={styles.emptyText}>No past orders yet.</Text>
          <Text style={styles.emptySubtext}>Your completed orders will appear here.</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => fetchOrders()}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Orders list
        <FlatList
          data={displayOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOrders}
              colors={['#4CAF50']}
            />
          }
        />
      )}
      </ScreenWithBack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F0F1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#335248',
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#7C9B8D',
    marginVertical: 2,
  },
  location: {
    fontSize: 13,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginVertical: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2,
  },
  paidBadge: {
    backgroundColor: '#4CAF50',
  },
  failedBadge: {
    backgroundColor: '#F44336',
  },
  paymentText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  detailsButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#f1f1f1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  debugInfo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  refreshButton: {
    backgroundColor: '#6A9C89',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 50,
    marginTop: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
});
