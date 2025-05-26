import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FavoriteCard } from '@/components/FavoriteCard';
import AuthGuard from '@/components/Protected';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useProductsStore } from '@/store/useProductsStore';
import { FavoriteStoreCard } from '@/components/FavoriteStores';

export default function FavoriteScreen() {
  const user = useAuthStore((state) => state.user);
  const { loadExploreData, loading } = useProductsStore();
  const {
    favoriteItems,
    favoriteStores,
    loadFavorites,
    removeFavoriteItem,
    removeFavoriteStore
  } = useFavoritesStore();

  useEffect(() => {
    const loadData = async () => {
      await loadExploreData(); // Fetch all product/store data
      if (user?.id) {
        loadFavorites(user.id); // Load user favorites
      }
    };
    loadData();
  }, [user]);

  return (
    <AuthGuard>
      <View style={styles.container}>
        <Text style={styles.heading}>FavoritEats</Text>

        {loading ? (
          <Text style={{ textAlign: 'center' }}>Loading...</Text>
        ) : (
          <>
            <FlatList
              data={favoriteItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FavoriteCard
                  id={item.id}
                  title={item.name}
                  image={item.image}
                  price={item.price}
                  onDelete={() => removeFavoriteItem(item.id)}
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No favorite items</Text>
              }
            />
            
            <View style={styles.storeSection}>
              <Text style={styles.heading}>🏪 Stores 🏪</Text>
              <FlatList
                horizontal
                data={favoriteStores}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <FavoriteStoreCard
                    store={item}
                    onDelete={() => removeFavoriteStore(item.id)}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 100 }}
                ListEmptyComponent={
                  <Text style={{ textAlign: 'center', marginLeft: 12 }}>No favorite stores</Text>
                }
              />
            </View>
          </>
        )}
        
      </View>
    </AuthGuard>
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
  storeMeta: {
    color: '#ddd',
    fontSize: 12,
    marginTop: 2,
  },
});
