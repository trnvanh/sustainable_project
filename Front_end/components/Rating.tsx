import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  rating: number;
  setRating: (rating: number) => void;
};

export default function Rating({ rating, setRating }: Props) {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text style={styles.star}>
            {rating >= star ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  star: {
    fontSize: 26,
    color: '#FFD700',
    marginHorizontal: 2,
  },
});
