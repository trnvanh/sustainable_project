import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useProductsStore} from "@/store/useProductsStore";
import {router} from "expo-router";

interface OrderItem {
  id: string;
  title: string;
  restaurant: string;
  image: string;
  date: string;
  status: string;
}

export function OrderCard({ item }: { item: OrderItem }) {
  const statusColor = {
    Preparing: '#FACC15',
    Ready: '#4ADE80',
    Completed: '#A3A3A3',
  }[item.status] || '#D1D5DB';

  const {
    setSelectedOffer,
  } = useProductsStore();

  return (
    <TouchableOpacity onPress={() => {
      setSelectedOffer(item);
      router.push(`/offer/${item.id}`);
    }}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.restaurant}>{item.restaurant}</Text>

          <Text style={styles.date}>{item.date}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#2D4D46',
  },
  restaurant: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    width:100,
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
});
