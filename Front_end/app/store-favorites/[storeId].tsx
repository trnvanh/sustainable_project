import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import api from '@/api/axiosConfig';
import { showMessage } from 'react-native-flash-message';
import ScreenWithBack from '@/components/ScreenBack';

export default function StoreFavoritesScreen() {
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const { storeId } = useLocalSearchParams();
    const { favorites, stores } = useFavoritesStore();
    const storeIdStr = Array.isArray(storeId) ? storeId[0] : storeId;
    const store = stores.find((s) => s.id === storeIdStr);
    const storeFavorites = favorites.filter((item) => item.storeId === storeIdStr);

    const handleFavorite = async () => {
        try {
            setLoading(true)
            await api.post(`/products/${offer.id}/favorite`, { favorite: !isFavorite });

            setIsFavorite(!isFavorite);
            showMessage({
                message: 'Success',
                description: isFavorite
                    ? 'Product removed from wishlist!'
                    : 'Product added to wishlist!',
                type: 'success',
                icon: 'success',
            });
        } catch (error: any) {
            showMessage({
                message: 'Failed !',
                // description: error.response?.data?.message || 'Thao tác thất bại!',
                type: 'danger',
                icon: 'danger',
            });
        } finally {
            setLoading(false)
        }
    };

  return (
    <ScreenWithBack title="FavorEats">
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: store?.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvm8aGm7BrNQiyz_smn9DB6AEVfajH0Y8Aug&s' }}
        style={styles.image}
      >
      </ImageBackground>

      <View style={styles.infoCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.storeName}>K-Market Helapuisto</Text>
            <Text style={styles.address}>Tuomionkirkonkatu 10</Text>
          </View>
          <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavorite}
            >
                <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isFavorite ? '#FF4444' : '#FFF'}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color="white" />
          <Text style={styles.hoursText}>Now - 22:00</Text>
        </View>

        <FlatList
          data={storeFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.portionsLeft || '-'}</Text>
              <Text style={styles.itemText}>{item.price || '-'}</Text>
            </View>
          )}
        />
      </View>
    </View>
    </ScreenWithBack>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C4DAD2' },
  image: {
    height: 200,
    justifyContent: 'space-between',
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16423C',
  },
  infoCard: {
    backgroundColor: '#16423C',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  address: {
    color: 'white',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hoursText: {
    color: 'white',
    marginLeft: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
  },
  itemText: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    backgroundColor: '#16423C',
    padding: 22,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    },
});
