import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, RefreshControl, Pressable} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import api from '@/api/axiosConfig';
import { showMessage } from 'react-native-flash-message';
import ScreenWithBack from '@/components/ScreenBack';
import GridOfferCard from '@/components/GridOfferCard';

export default function StoreFavoritesScreen() {
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(true);

    const { storeId } = useLocalSearchParams();
    const { favorites, stores } = useFavoritesStore();
    const storeIdStr = Array.isArray(storeId) ? storeId[0] : storeId;
    const store = stores.find((s) => String(s.id) === storeIdStr);
    const storeFavorites = favorites.filter((item) => String(item.storeId) === storeIdStr);

    const handleFavorite = async () => {
        try {
            setLoading(true)
            await api.post(`/products/${store?.id}/favorite`, { favorite: !isFavorite });

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

    // States for loading and refresh
    const [isRefreshing, setIsRefreshing] = useState(false);

      // Handle refresh
    const handleRefresh = () => {
        setIsRefreshing(true);
        // Refresh data based on type
        try {
            // For future implementation: add API refresh calls here
            // For now, we'll just simulate it with a delay
            setTimeout(() => {
                setIsRefreshing(false);
            }, 1000);
        } catch (error) {
            console.error("Error refreshing data:", error);
            setIsRefreshing(false);
        }
    };

  return (
    <ScreenWithBack title="FavorEats">
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: store?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvm8aGm7BrNQiyz_smn9DB6AEVfajH0Y8Aug&s' }}
        style={styles.image}
      >
      </ImageBackground>

      <View style={styles.infoCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.storeName}>{store?.name}</Text>
            <Text style={styles.address}>{store?.address}</Text>
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
          <Text style={styles.hoursText}>{store?.openingHours}</Text>
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="star" size={16} color="white" />
          <Text style={styles.hoursText}>{store?.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="call" size={16} color="white" />
          <Text style={styles.hoursText}>{store?.phoneNumber}</Text>
        </View>

      </View>
      {!loading && (
          // Orders list
          <FlatList
              data={storeFavorites}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                  <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={handleRefresh}
                      colors={['#4CAF50']}
                  />
              }
              renderItem={({ item }) => (
                  <View style={styles.itemWrapper}> 
                      <GridOfferCard
                          id={item.id.toString()}
                          name={item.name}
                          price={typeof item.price === 'number' ? `${item.price} €` : item.price}
                          image={item.image ?? ''}
                          pickupTime={item.pickupTime || ""}
                          rating={item.rating}
                          distance={0}
                          portionsLeft={item.portionsLeft || 0}
                          location={
                              'location' in item && typeof item.location === 'object' && item.location !== null &&
                              'restaurant' in item.location && 'address' in item.location
                                  ? item.location as { restaurant: string; address: string }
                                  : undefined
                          }
                          description={'description' in item ? item.description : undefined}
                          storeId={'storeId' in item ? item.storeId : undefined}
                      />
                  </View>
              )}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
          />
        )}
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
  section: {
        marginBottom: 24,
  },
  itemWrapper: {
        marginBottom: 8,
  },
  listContent: {
        padding: 8,
        paddingBottom: 24,
  },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 12,
  },
});
