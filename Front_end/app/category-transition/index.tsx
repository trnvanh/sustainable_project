import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

import { router } from 'expo-router';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CategoryTransition'>;

export default function CategoryTransitionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  //const { category } = route.params as RootStackParamList['CategoryTransition'];

  useEffect(() => {
    const timer = setTimeout(() => {
      //navigation.replace('CategoryList', { category });
      router.push('./category-list');
    }, 1500); // simulate animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>✨ Exploring Drinks...</Text>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6602/6602190.png' }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 600,
    color: '#16423C',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
});
