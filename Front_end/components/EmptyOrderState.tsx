import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/emptybox.jpeg')} style={styles.image} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 20,
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    color: '#16423C',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
