import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import OfferCard from '@/components/OfferCard';
import CategoryCard from '@/components/CategoryCard';

import { router } from 'expo-router';
import React from 'react';

//import { StackNavigationProp } from '@react-navigation/stack';
//import { RootStackParamList, Category } from '../../navigation/types';

//type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function Explore() {
  //const navigation = useNavigation<NavigationProp>();

  const handleCategoryPress = () => {
    //navigation.navigate('CategoryTransition', { category });
    router.push('./category-transition');
  };

  const categories = [
    { id: '1', name: 'Bakery', image: 'https://cdn-icons-png.flaticon.com/512/4241/4241664.png'},
    { id: '2', name: 'Drinks', image: 'https://cdn-icons-png.flaticon.com/512/6602/6602190.png' },
    { id: '3', name: 'Meals', image: 'https://cdn-icons-png.flaticon.com/512/6951/6951865.png' },
    { id: '4', name: 'Cafes', image: 'https://cdn-icons-png.flaticon.com/512/2069/2069532.png' },
    { id: '5', name: 'Veggies', image: 'https://cdn-icons-png.flaticon.com/512/5016/5016804.png' },
    { id: '6', name: 'Snacks', image: 'https://cdn-icons-png.flaticon.com/512/3814/3814614.png' },
    { id: '7', name: 'Vegan', image: 'https://cdn-icons-png.flaticon.com/512/5771/5771076.png' },
    { id: '8', name: 'Frozen', image: 'https://cdn-icons-png.flaticon.com/512/12828/12828304.png' },
  ];

  const dummyOffers = [
    { 
      id: '1',
      title: 'Juustokakku 2kpl',
      time: '15:00 - 20:00',
      distance: '0.1 km',
      quantity: '5 left',
      price: '1 €',
      store: 'K-Market Helapuisto',
      image: 'data:image/png;base64,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', 
    },
    { 
      id: '1',
      title: 'Juustokakku 2kpl',
      time: '15:00 - 20:00',
      distance: '0.1 km',
      quantity: '5 left',
      price: '1 €',
      store: 'K-Market Helapuisto',
      image: 'data:image/png;base64,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', 
    },
    { 
      id: '1',
      title: 'Juustokakku 2kpl',
      time: '15:00 - 20:00',
      distance: '0.1 km',
      quantity: '5 left',
      price: '1 €',
      store: 'K-Market Helapuisto',
      image: 'data:image/png;base64,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', 
    },
    
  ];

  const renderOfferRow = (title: string, data: typeof dummyOffers) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => router.push('/seeall')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push('/offer')}
          >
          <OfferCard id={item.id} title={item.title} price={item.price} image={item.image} store={item.store} time={item.time} distance={item.distance} quantity={parseInt(item.quantity)} />
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
        />
      </View>

      {/* Current Location */}
      <View style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={20} color="#4CAF50" />
        <Text style={styles.locationText}>Tampere 33100</Text>
        <TouchableOpacity onPress={() => router.push('/map')}>
          <Ionicons name="map-outline" size={26} color="#335248" />
        </TouchableOpacity>
      </View>

      {/*Categories */}
      <View style={styles.categorySection}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard 
            name={item.name} 
            image={item.image} 
            onPress={() =>
              handleCategoryPress()
            }
            />
          )}
        />
      </View>


      {/* Offer sections */}
      {renderOfferRow('Rescue Again', dummyOffers)}
      {renderOfferRow('Trending now 🔥', dummyOffers)}
      {renderOfferRow('Nearby Offers 📍', dummyOffers)}
      {renderOfferRow('Deals 1€ 💸', dummyOffers)}
      {renderOfferRow('Most popular ⭐', dummyOffers)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#C4DAD2',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#444',
  },
  categorySection: {
    marginBottom: 24,
    marginTop: 8,
  },  
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
  },
});
