import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import ScreenWithBack from '@/components/ScreenBack';
import RescueBar from '@/components/RescueBar';
import React from 'react';

export default function OfferItemScreen() {
  return (
    <ScreenWithBack title="Explore">
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: 'https://www.thegbfoodservice.fi/media/images/recipe_images/1200x1200-q85/vadelmakakku.jpg',
        }}
        style={styles.image}
      />

      <View style={styles.information}>
        {/* Heading */}
        <Text style={styles.name}>Juustokakku 2kpl</Text>

        {/* Price */}
        <Text style={styles.price}>1€</Text>

        {/* Location */}
        <View style={styles.infoRow}>
          <Entypo name="location-pin" size={20} color="black" />
          <Text style={styles.infoText}>K-Market</Text>
        </View>

        {/* Rating */}
        <View style={styles.infoRow}>
          <FontAwesome name="star" size={20} color="gold" />
          <Text style={styles.infoText}>3 / 5</Text>
        </View>

        {/* Pickup Time */}
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={20} color="black" />
          <Text style={styles.infoText}>Order before 20:00</Text>
        </View>
      </View>

      <View style={styles.description}>
        <Text style={styles.descriptionText}>
        Indulge in creamy delight with this unbeatable offer!
Get two slices of rich, velvety Juustokakku (cheesecake) for just 1 €. Perfectly portioned and freshly made, this sweet treat is ideal for sharing—or keeping all to yourself. 🍰
Available for pickup at K-Market Helapuisto, but hurry—only a few portions left!
        </Text>
      </View>

    </ScrollView>

    <RescueBar></RescueBar>
    
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
