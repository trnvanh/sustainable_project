import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import OfferCard from '@/components/OfferCard';
import CategoryCard from '@/components/CategoryCard';
import { useProductsStore } from '@/store/useProductsStore';
import { ActivityIndicator } from 'react-native';

export default function Explore() {
  const {
    historyOrders,
    nearbyOffers,
    currentDeals,
    loadExploreData,
    loading,
    setSelectedOffer,
  } = useProductsStore();

  useEffect(() => {
    loadExploreData();
  }, []);

  const categories = [
    { id: '1', name: 'Bakery', image: 'https://via.placeholder.com/60x60.png?text=Bread' },
    { id: '2', name: 'Drinks', image: 'https://via.placeholder.com/60x60.png?text=Juice' },
    { id: '3', name: 'Meals', image: 'https://via.placeholder.com/60x60.png?text=Meal' },
    { id: '4', name: 'Cafes', image: 'https://via.placeholder.com/60x60.png?text=Cafe' },
  ];

  const renderOfferRow = (title: string, data: typeof historyOrders) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => console.log(`See all for ${title}`)}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Use TouchableOpacity to navigate to the offer details page
          <TouchableOpacity onPress={() => {
            setSelectedOffer(item);
            //router.push({ pathname: '/offer', params: { offerId: item.id } });
            router.push(`/offer/${item.id}`);
          }}>
            <OfferCard
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              pickupTime={item.pickupTime}
              rating={item.rating}
              distance={item.distance}
              portionsLeft={item.portionsLeft}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 8, color: '#555'}}>Loading offer...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>

      {/* Current Location */}
      <View style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={20} color="#4CAF50" />
        <Text style={styles.locationText}>Tampere 33100</Text>
      </View>

      {/* Categories */}
      <View style={styles.categorySection}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard name={item.name} image={item.image} />
          )}
        />
      </View>

      {/* Offer sections from store */}
      {renderOfferRow('Rescue Again', historyOrders)}
      {renderOfferRow('Nearby Offers', nearbyOffers)}
      {renderOfferRow('Deals 1€', currentDeals)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    backgroundColor: '#C4DAD2',
  },  
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
