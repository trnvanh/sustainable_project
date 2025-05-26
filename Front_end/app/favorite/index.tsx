import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { FavoriteCard } from '@/components/FavoriteCard';
import AuthGuard from '@/components/Protected';
import {useFavoritesStore} from "@/store/useFavoritesStore";
import api from "@/api/axiosConfig";
import {showMessage} from "react-native-flash-message";
import {useProductsStore} from "@/store/useProductsStore";

export default function FavoriteScreen() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const {
    favorites,
    stores,
    loadExploreData,
    loading,
  } = useFavoritesStore();

  useEffect(() => {
    loadExploreData();
  }, []);

  const filteredStores = stores.filter((store) =>
      favorites.some((favorite) => favorite.storeId == store.id)
  );

  const filteredFavorites = selectedStoreId
      ? favorites.filter((favorite) => favorite.storeId == selectedStoreId)
      : favorites;

  const handleDelete = async (id: string) => {
    try {
      useFavoritesStore.setState({ loading: true });
      await api.post(`/products/${id}/favorite`);

      useFavoritesStore.setState((state) => ({
        favorites: state.favorites.filter((item) => item.id != id),
      }));
      showMessage({
        message: 'Successfully deleted',
        // description: '',
        type: 'success',
        icon: 'success',
      });
    } catch (error: any) {
      showMessage({
        message: 'Failed to delete',
        // description: '',
        type: 'danger',
        icon: 'danger',
      });
    }
    finally {
      useFavoritesStore.setState({ loading: false });
    }
  };

  const handleStorePress = (storeId: string) => {
    setSelectedStoreId(storeId);
  };

  const handleShowAll= () => {
    setSelectedStoreId(null);
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 8, color: '#555'}}>Loading wishlist...</Text>
        </View>
    );
  }

  return (
    <AuthGuard>
      <View style={styles.container}>
        <Text style={styles.heading}>FavoritEats</Text>
        <TouchableOpacity onPress={() => handleShowAll()}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FavoriteCard
              item={item}
              title={item.name}
              image={item.image}
              price={item.price}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        <View style={styles.storeSection}>
          <Text style={styles.heading}>🏪 Stores 🏪</Text>
          <FlatList
            horizontal
            data={filteredStores}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.storeCard} onPress={() => handleStorePress(item.id)}>
                <Image source={{ uri: item.image }} style={styles.storeImage} />
                <View style={styles.overlay}>
                  <Text style={styles.storeName}>{item.name}</Text>
                  {/*<Text style={styles.storeDeal}>{item.deal}</Text>*/}
                  <Text style={styles.storeMeta}>📍 {item.address}  ⭐ {item.rating.toFixed(1)}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 100 }}
          />
        </View>
      </View>
    </AuthGuard>
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
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingTop: 50,
    paddingHorizontal: 12,
    //paddingBottom: 50,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#16423C',
    marginBottom: 16,
    marginTop: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  storeSection: {
    backgroundColor: '#6A9C89', 
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    height: 250,
  },
  storeCard: {
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    //backgroundColor: '#ccc',
  },
  
  storeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  
  storeName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  storeDeal: {
    color: '#f0f0f0',
    fontSize: 13,
  },
  
  storeMeta: {
    color: '#ddd',
    fontSize: 12,
    marginTop: 2,
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 15,
  },
});
