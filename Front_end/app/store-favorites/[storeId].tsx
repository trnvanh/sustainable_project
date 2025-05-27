import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { FavoriteCard } from '@/components/FavoriteCard';
import React from 'react';
import StoreItemCard from '@/components/StoreItemCard';
import api from '@/api/axiosConfig';
import { showMessage } from 'react-native-flash-message';

export default function StoreFavoritesScreen() {
  const { storeId } = useLocalSearchParams();
  const { favorites, stores } = useFavoritesStore();

//  const store = stores.find((s) => s.id === storeId);
//  const storeFavorites = favorites.filter((item) => item.storeId === storeId);

const storeIdStr = Array.isArray(storeId) ? storeId[0] : storeId;

const store = stores.find((s) => String(s.id) === storeIdStr);
const storeFavorites = favorites.filter((item) => String(item.storeId) === storeIdStr);


  const handleDelete = async (id: string) => {
    try {
      useFavoritesStore.setState({ loading: true });
      await api.post(`/products/${id}/favorite`);

      useFavoritesStore.setState((state) => ({
        favorites: state.favorites.filter((item) => String(item.id) != id),
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{store?.name}</Text>
      <FlatList
        data={storeFavorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
            <StoreItemCard
            item={item}
            onDelete={() => handleDelete(String(item.id))} 
            />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#16423C',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
