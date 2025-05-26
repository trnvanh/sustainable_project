import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Store } from '@/types/store';
import { useRouter } from 'expo-router';

interface Props {
  store: Store;
  onDelete: () => void;
}

export const FavoriteStoreCard: React.FC<Props> = ({ store, onDelete }) => {
  const router = useRouter();

  // Normalize image value into ImageSourcePropType
    const getImageSource = (image: any): ImageSourcePropType => {
      if (typeof image === 'string') {
        //console.log('Image URL:', image);
        return { uri: image };
      } else if (typeof image === 'number') {
        //console.log('Image local:', image);
        return image;
      } else if (typeof image === 'object' && 'uri' in image) {
        //console.log('Image object:', image);
        return image; // Already in correct format
      } else {
        //console.log('Image fallback');
        return { uri: 'https://via.placeholder.com/160x100.png?text=Food' };
      }
    };

  return (
    <Pressable style={styles.container} onPress={() => router.push({
                          pathname: '/offer/[offerId]',
                          params: { offerId: store.id, from: 'Favourite Card' },
                        })}>
      <View style={styles.card}>
        <Image source={getImageSource(store.image)} style={styles.image} />
        <TouchableOpacity onPress={onDelete} style={styles.delete}>
          <AntDesign name="closecircle" size={20} color="tomato" />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{store.name}</Text>
          <Text style={styles.meta}>📍 {store.address}</Text>
          <Text style={styles.meta}>⭐ {store.rating.toFixed(1)}</Text>
        </View>
      </View> 
    </Pressable>
    
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    flexShrink: 0,
    backgroundColor: '#F2F5F3',
    borderRadius: 12,
    marginRight: 12,
  },
  card: {
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    backgroundColor: '#000', // fallback if no image
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  delete: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    zIndex: 2,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  meta: {
    color: '#ddd',
    fontSize: 12,
    marginTop: 2,
  },
});
