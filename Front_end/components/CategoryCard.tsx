import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryCardProps {
  name: string;
  image: string;
  onPress?: () => void;
}

export default function CategoryCard({ name, image, onPress }: CategoryCardProps) {
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    card: {
      alignItems: 'center',
      marginRight: 12,
      width: 100,
    },
    image: {
      justifyContent: 'center',
      width: 100,
      height: 100,
      borderRadius: 10,
      marginBottom: 6,
      backgroundColor: colors.textSecondary,
      overflow: 'hidden',
    },
    name: {
      fontSize: 15,
      paddingTop: 50,
      padding: 10,
      borderRadius: 10,
      color: colors.surface,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity style={dynamicStyles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: image }}
        style={dynamicStyles.image}
        resizeMode="cover"
        blurRadius={2}
        imageStyle={{ borderRadius: 10 }}
      >
        <Text style={dynamicStyles.name}>{name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}
