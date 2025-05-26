import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Props {
  id: string;
  title: string;
  image: any;
  price: string;
  onDelete: () => void;
}

export const FavoriteCard: React.FC<Props> = ({ id, title, image, price, onDelete }) => {
  const router = useRouter();

  // Normalize image value into ImageSourcePropType
  const getImageSource = (): ImageSourcePropType => {
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
                      params: { offerId: id, from: 'Favourite Card' },
                    })}>
      <View style={styles.card}>
        <Image source={getImageSource()} style={styles.image} />
        <TouchableOpacity onPress={onDelete} style={styles.delete}>
          <AntDesign name="closecircle" size={20} color="tomato" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    flexShrink: 0,
    backgroundColor: '#F2F5F3',
    borderRadius: 10,
    marginRight: 12,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  delete: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    color: '#0a8451',
    fontWeight: '500',
  },
});