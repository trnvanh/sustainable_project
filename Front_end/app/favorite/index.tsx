import api from "@/api/axiosConfig";
import { FavoriteCard } from '@/components/FavoriteCard';
import AuthGuard from '@/components/Protected';
import { useTheme } from '@/context/ThemeContext';
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from "react-native-flash-message";

export default function FavoriteScreen() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const {
    favorites,
    stores,
    loadExploreData,
    loading,
  } = useFavoritesStore();
  const { colors } = useTheme();

  useEffect(() => {
    loadExploreData();
  }, []);

  const filteredStores = stores.filter((store) =>
    favorites.some((favorite) => favorite.storeId == store.id)
  );

  const filteredFavorites = selectedStoreId
    ? favorites.filter((favorite) => favorite.storeId == parseInt(selectedStoreId))
    : favorites;

  const handleDelete = async (id: number) => {
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

  const handleStorePress = (storeId: number) => {
    //    setSelectedStoreId(storeId);
    router.push(`/store-favorites/${storeId}`);
  };

  const handleShowAll = () => {
    setSelectedStoreId(null);
  };

  const dynamicStyles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 120,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 12,
    },
    heading: {
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      color: colors.text,
      marginBottom: 16,
      marginTop: 10,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    storeSection: {
      backgroundColor: colors.primary,
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
      color: colors.accent,
      marginBottom: 15,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    loadingText: {
      marginTop: 8,
      color: colors.textSecondary,
    },
  });

  if (loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={dynamicStyles.loadingText}>Loading wishlist...</Text>
      </View>
    );
  }

  return (
    <AuthGuard>
      <View style={dynamicStyles.container}>
        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.heading}>FavoritEats</Text>
          <TouchableOpacity onPress={() => router.push({
            pathname: '/see-all',
            params: { title: 'Favorite Products', type: 'favorites' }
          })}>
            <Text style={dynamicStyles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            // Convert FavoriteResponse to OrderItem format
            const orderItem = {
              id: item.id.toString(),
              name: item.name,
              price: item.price?.toString() || '0',
              pickupTime: item.pickupTime,
              portionsLeft: item.portionsLeft,
              rating: item.rating,
              image: item.image || '',
              description: item.description,
            };

            return (
              <FavoriteCard
                item={orderItem}
                title={item.name}
                image={item.image || ''}
                price={item.price?.toString() || '0'}
                onDelete={() => handleDelete(item.id)}
              />
            );
          }}
          numColumns={2}
          columnWrapperStyle={dynamicStyles.row}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        <View style={dynamicStyles.storeSection}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={[dynamicStyles.heading, { marginBottom: 0, marginTop: 0, fontSize: 20, color: colors.surface }]}>🏪 Stores 🏪</Text>
            <TouchableOpacity onPress={() => handleShowAll()}>
              <Text style={[dynamicStyles.seeAll, { color: colors.accent }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={filteredStores}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={dynamicStyles.storeCard} onPress={() => handleStorePress(item.id)}>
                <Image source={{ uri: item.image }} style={dynamicStyles.storeImage} />
                <View style={dynamicStyles.overlay}>
                  <Text style={dynamicStyles.storeName}>{item.name}</Text>
                  {/*<Text style={dynamicStyles.storeDeal}>{item.deal}</Text>*/}
                  <Text style={dynamicStyles.storeMeta}>📍 {item.address}  ⭐ {item.rating.toFixed(1)}</Text>
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
