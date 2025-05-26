import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import ScreenWithBack from '@/components/ScreenBack';

type CategoryListRouteProp = RouteProp<RootStackParamList, 'CategoryList'>;

export default function CategoryListScreen() {
  //const route = useRoute<CategoryListRouteProp>();

  //const { category } = useRoute<RouteProp<RootStackParamList, 'CategoryList'>>().params;

  // Dummy item list for now (replace with real data)
  const items = [
    { id: '1', name: 'Rescued Pizza', image: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Bread Loaf', image: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Cupcakes', image: 'https://via.placeholder.com/100' },
  ];

  return (
    <ScreenWithBack title='Bakery'>
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    </ScreenWithBack>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fefaf0',
      paddingTop: 40,
      paddingHorizontal: 16,
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#16423C',
    },
    listContainer: {
      gap: 16,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 12,
      alignItems: 'center',
      width: '48%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginBottom: 8,
    },
    itemName: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
    },
  });
  