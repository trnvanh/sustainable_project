import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface Props {
  title: string;
  image: string;
  price: string;
  onDelete: () => void;
}

export const FavoriteCard: React.FC<Props> = ({ title, image, price, onDelete }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <TouchableOpacity onPress={onDelete} style={styles.delete}>
        <AntDesign name="closecircle" size={20} color="tomato" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '48%',
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
