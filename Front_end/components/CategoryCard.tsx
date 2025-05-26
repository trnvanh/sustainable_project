import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, TouchableOpacity } from 'react-native';

interface CategoryCardProps {
  name: string;
  image: string;
  onPress?: () => void;
}

export default function CategoryCard({ name, image, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover" 
        blurRadius={2}
        imageStyle={{ borderRadius: 10 }}
      >
        <Text style={styles.name}>{name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginRight: 12,
    width: 80,
  },
  image: {
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#ADB2D4',
    overflow: 'hidden',
  },
  name: {
    fontSize: 15,
    paddingTop: 50,
    padding:10,
    borderRadius: 10,
    color: '#D5E5D5',
    fontWeight:'600',
  },
});
