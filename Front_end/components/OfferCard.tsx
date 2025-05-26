import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

interface OfferCardProps {
  id: string,
  title: string;
  time: string,
  distance?: string;
  quantity: number;
  price: string;
  store: string,
  image?: string;
}

export default function OfferCard({
  id,
  title,
  time,
  distance,
  quantity,
  price,
  store,
  image
}: OfferCardProps) {
  const router = useRouter();

  return (
    <Pressable style={styles.card} onPress={() => router.push('/offer')}>
      <Image
        source={{ uri: image || 'https://via.placeholder.com/160x100.png?text=Food' }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{title}</Text>
        <Text style={styles.cardPrice}>{price}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color="#777" />
          <Text style={styles.infoText}>{time}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.infoText}>{distance}</Text>
        </View>

        <View style={styles.infoRow}>
        <MaterialCommunityIcons
            name={quantity <= 1 ? 'fire' : 'food'}
            size={14}
            color={quantity <= 1 ? '#D32F2F' : '#777'}
        />
        <Text
            style={[
            styles.infoText,
            quantity <= 2 && styles.lowPortions,
            ]}
        >
            {quantity} left
        </Text>
        </View>

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    flexShrink: 0,
    backgroundColor: '#F2F5F3',
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardPrice: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  lowPortions: {
    color: '#D32F2F', 
    fontWeight: '600',
  },  
});
