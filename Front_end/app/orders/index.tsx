import { EmptyState } from '@/components/EmptyOrderState';
import { EnhancedOrderCard } from '@/components/EnhancedOrderCard';
import { useAppStateHandler } from '@/hooks/useAppStateHandler';
import { useOrderStore } from '@/store/useOrderStore';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

interface OrderItem {
    id: string;
    title: string;
    restaurant: string;
    image: string;
    date: string;
    status: string;
}

// const activeOrders: OrderItem[] = [
//   {
//     id: '1',
//     title: 'Veggie Sandwich',
//     restaurant: 'Green Bites',
//     image: 'https://source.unsplash.com/100x100/?sandwich',
//     date: 'Apr 25, 2025 - 1:30 PM',
//     status: 'Preparing',
//   },
//   {
//     id: '2',
//     title: 'Cheese Pizza',
//     restaurant: 'Pizzalicious',
//     image: 'https://source.unsplash.com/100x100/?pizza',
//     date: 'Apr 24, 2025 - 7:00 PM',
//     status: 'Completed',
//   },
// ];

const orderHistory: OrderItem[] = [
    {
        id: '2',
        title: 'Sushi Box (6 pcs)',
        restaurant: 'Itsudemo Kuskusta',
        image: 'https://images.unsplash.com/photo-1589187155472-9d56a7868e5e',
        date: 'Apr 24, 2025 - 7:00 PM',
        status: 'Completed',
    },
    {
        id: '3',
        title: 'Blueberry Muffin Pack',
        restaurant: 'Fazer Cafe',
        image: 'https://images.unsplash.com/photo-1589187154701-3dd9db5f1c0a',
        date: 'Apr 24, 2025 - 7:00 PM',
        status: 'Completed',
    },
];

export default function OrdersScreen() {
    const [index, setIndex] = useState(0);
    const { orders, fetchOrders, loading, error } = useOrderStore();

    // Handle app state changes to refresh orders when returning from PayPal
    useAppStateHandler();

    // Separate active and completed orders with better status mapping
    const activeOrders = orders.filter(order => {
        const status = order.status.toLowerCase();
        return ['pending', 'preparing', 'ready'].includes(status);
    });

    const completedOrders = orders.filter(order => {
        const status = order.status.toLowerCase();
        return ['completed', 'cancelled', 'confirmed'].includes(status);
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (error) {
            showMessage({
                message: error,
                type: 'danger',
                icon: 'danger',
            });
        }
    }, [error]);

    // Define scene components properly
    const ActiveOrdersScene = () => (
        activeOrders.length > 0 ? (
            <FlatList
                style={{ marginTop: 16, marginRight: 10, marginLeft: 10 }}
                data={activeOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <EnhancedOrderCard order={item} />}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchOrders}
                        colors={['#4CAF50']}
                    />
                }
            />
        ) : (
            <EmptyState text="No active orders yet!" />
        )
    );

    const CompletedOrdersScene = () => (
        completedOrders.length > 0 ? (
            <FlatList
                style={{ marginTop: 16, marginRight: 10, marginLeft: 10 }}
                data={completedOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <EnhancedOrderCard order={item} />}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchOrders}
                        colors={['#4CAF50']}
                    />
                }
            />
        ) : (
            <EmptyState text="No order history yet!" />
        )
    );

    const renderScene = SceneMap({
        active: ActiveOrdersScene,
        history: CompletedOrdersScene,
    });

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>My Orders</Text>
            <TabView
                navigationState={{
                    index,
                    routes: [
                        { key: 'active', title: 'Active' },
                        { key: 'history', title: 'History' },
                    ],
                }}
                renderScene={renderScene}
                onIndexChange={setIndex} // Update the selected tab
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={{ backgroundColor: '#D9D9D9', borderRadius: 12 }}
                        indicatorStyle={{ backgroundColor: '#16423C' }}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E7F0F1',
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#16423C',
        marginBottom: 12,
        marginTop: 10,
    },
    listContainer: {
        paddingBottom: 100,
    },
});
