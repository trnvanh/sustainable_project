import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { OrderItem } from '@/types/order';

export type OfferCardProps = Pick<OrderItem, 'id' |'name' | 'price' | 'image' | 'pickupTime' | 'distance' | 'portionsLeft' | 'rating'>;

export default function OfferCard({
  id,
  name,
  price,
  image,
  pickupTime,
  rating,
  distance,
  portionsLeft,
}: OfferCardProps) {
  const router = useRouter();

  // Normalize image value into ImageSourcePropType
  const getImageSource = (): ImageSourcePropType => {
    if (typeof image === 'string') {
      //console.log('Image URL:', image);
      return { uri: image };
    } else if (typeof image === 'number') {
      //console.log('Image local:', image);
      return image;
    } else if (typeof image === 'object' && 'uri' in image) {
      //console.log('Image object:', image);
      return image; // Already in correct format
    } else {
      //console.log('Image fallback');
      return { uri: 'https://via.placeholder.com/160x100.png?text=Food' };
    }
  };

  return (
    <Pressable style={styles.card} onPress={() => router.push({
                  pathname: '/offer/[offerId]',
                  params: { offerId: id, from: 'Explore' },
                })}>
      <Image source={getImageSource()} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{name}</Text>
        <Text style={styles.cardPrice}>{price}</Text>
        
        <View style={styles.infoRow}>
          <FontAwesome name="star" size={20} color="gold" />
          <Text style={styles.infoText}>{rating}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color="#777" />
          <Text style={styles.infoText}>{pickupTime}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.infoText}>{distance}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={portionsLeft <= 1 ? 'fire' : 'food'}
            size={14}
            color={portionsLeft <= 1 ? '#D32F2F' : '#777'}
          />
          <Text style={[styles.infoText, portionsLeft <= 2 && styles.lowPortions]}>
            {portionsLeft} left
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
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
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
