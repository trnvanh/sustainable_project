import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { OrderItem } from '@/types/order';
import {useProductsStore} from "@/store/useProductsStore";

export default function OrderHistoryScreen() {
  const user = useAuthStore((state) => state.user);
  const {
    historyOrders,
    nearbyOffers,
    currentDeals,
  } = useProductsStore();

  const userOrderHistory = [...historyOrders, ...nearbyOffers, ...currentDeals].filter((order) =>
    user?.historyOrderIds.includes(order.id)
  );


  const renderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.location}>{item.location?.restaurant}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      {userOrderHistory.length === 0 ? (
        <Text style={styles.emptyText}>No past orders yet.</Text>
      ) : (
        <FlatList
          data={userOrderHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
