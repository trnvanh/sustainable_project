import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import ScreenWithBack from '@/components/ScreenBack';
import RescueBar from '@/components/RescueBar';
import { useProductsStore } from '@/store/useProductsStore';
import { useLocalSearchParams } from 'expo-router';

export default function OfferItemScreen() {
  const { offerId, from } = useLocalSearchParams<{ offerId: string; from?: string }>();

  const {
    historyOrders,
    nearbyOffers,
    currentDeals,
    setSelectedOffer,
    selectedOffer,
  } = useProductsStore();

  // Try to find the offer based on ID
  const offer =
    selectedOffer?.id === offerId
      ? selectedOffer
      : [...historyOrders, ...nearbyOffers, ...currentDeals].find((o) => o.id === offerId);

  console.log('Offer ID:', offerId);
  console.log('Selected Offer:', selectedOffer);
  
  // If offer found, update Zustand
  if (!selectedOffer && offer) {
    setSelectedOffer(offer);
  }

  if (!offer) {
    return (
      <View style={styles.container}>
        <Text style={styles.descriptionText}>No offer selected.</Text>
      </View>
    );
  }

  const {
    name,
    price,
    image,
    pickupTime,
    distance,
    portionsLeft,
    rating,
    location,
    description,
  } = offer;

return (
  <ScreenWithBack title={from ?? 'Offer Details'}>
    <ScrollView style={styles.container}>
      <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />

      <View style={styles.information}>
         {/* Heading */}
        <Text style={styles.name}>{name}</Text>

         {/* Price */}
        <Text style={styles.price}>{price}</Text>

        {/* Location */}
        {location && (
          <View style={styles.infoRow}>
            <Entypo name="location-pin" size={20} color="black" />
            <Text style={styles.infoText}>
              {location.restaurant}, {location.address}
            </Text>
          </View>
        )}

        {/* Pickup time */}
        {pickupTime && (
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={20} color="black" />
            <Text style={styles.infoText}>Pickup: {pickupTime}</Text>
          </View>
        )}

        {/* Distance */}
        {distance && (
          <View style={styles.infoRow}>
            <Entypo name="location" size={20} color="black" />
            <Text style={styles.infoText}>Distance: {distance}</Text>
          </View>
        )}

        {/* Rating */}
        <View style={styles.infoRow}>
          <FontAwesome name="star" size={20} color="gold" />
          <Text style={styles.infoText}>{rating}</Text>
        </View>
      </View>

      <View style={styles.description}>
        <Text style={styles.descriptionText}>
          {description || 'No description available.'}
        </Text>
      </View>
    </ScrollView>

    <RescueBar portionsLeft={portionsLeft}/>
  </ScreenWithBack>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4DAD2',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  information: {
    padding: 16,
    backgroundColor: '#6A9C89',
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    backgroundColor: '#16423C',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    flexDirection: 'row',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#fff',
  },
  description: {
    padding: 16,
    backgroundColor: '#C4DAD2',
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0a8451',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
