import React from 'react'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

interface CategoryCardProps {
  name: string;
  image: string;
  onPress?: () => void;
}

export default function CategoryCard({ name, image, onPress }: CategoryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginRight: 12,
    width: 80,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 13,
    textAlign: 'center',
  },
});
