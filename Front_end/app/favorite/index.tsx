import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { FavoriteCard } from '@/components/FavoriteCard'; 

interface FavoriteItem {
  id: string;
  name: string;
  image: string;
  price: string;
}

const initialFavorites: FavoriteItem[] = [
  {
    id: '1',
    name: 'Juustokakku 2kpl',
    image: 'https://www.thegbfoodservice.fi/media/images/recipe_images/1200x1200-q85/vadelmakakku.jpg',
    price: '1€',
  },
  {
    id: '2',
    name: 'Veggie Pizza Slice',
    image: 'https://images.unsplash.com/photo-1601924582971-c6e0b6b7c42e',
    price: '2€',
  },
  {
    id: '3',
    name: 'Sushi Box (6 pcs)',
    image: 'https://images.unsplash.com/photo-1589187155472-9d56a7868e5e',
    price: '3.50€',
  },
  {
    id: '4',
    name: 'Blueberry Muffin Pack',
    image: 'https://images.unsplash.com/photo-1589187154701-3dd9db5f1c0a',
    price: '1.50€',
  },
  {
    id: '5',
    name: 'Croissantit 3kpl',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Croissant-P%C3%A2tisserie.jpg/640px-Croissant-P%C3%A2tisserie.jpg',
    price: '2€',
  },
  {
    id: '6',
    name: 'Sushilajitelma',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/640px-Sushi_platter.jpg',
    price: '4€',
  },
  {
    id: '7',
    name: 'Vihersalaatti',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Vegetable_Salad_%285429069316%29.jpg/640px-Vegetable_Salad_%285429069316%29.jpg',
    price: '1.5€',
  },
  {
    id: '8',
    name: 'Smoothie Bowl',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Smoothie_bowl_with_fruits_and_nuts.jpg/640px-Smoothie_bowl_with_fruits_and_nuts.jpg',
    price: '2.5€',
  },
];

const favoriteStores = [
  {
    id: '1',
    name: 'K-Market Herttoniemi',
    image: 'https://www.k-ruoka.fi/images/875x656/article_images/2019/01/kuva-k-marketista.jpg',
    deal: 'Uusia tarjouksia päivittäin',
    location: 'Herttoniemi, Helsinki',
    rating: 4.2,
  },
  {
    id: '2',
    name: 'Lidl Sörnäinen',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Lidl_Filiale_in_Leipzig.jpg/640px-Lidl_Filiale_in_Leipzig.jpg',
    deal: 'Halpaa hintaa iltaan asti',
    location: 'Herttoniemi, Helsinki',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'S-Market Pasila',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/S-market_Raksila.jpg/640px-S-market_Raksila.jpg',
    deal: 'Paljon hävikkiruokaa',
    location: 'Herttoniemi, Helsinki',
    rating: 4.2,
  },
  {
    id: '4',
    name: 'Fazer Café',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Fazer_Cafe%2C_Helsinki.jpg/640px-Fazer_Cafe%2C_Helsinki.jpg',
    deal: 'Leivonnaisia alessa klo 19 jälkeen',
    location: 'Herttoniemi, Helsinki',
    rating: 4.2,
  },
  {
    id: '5',
    name: 'Alepa Töölö',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Alepa_kauppa.jpg/640px-Alepa_kauppa.jpg',
    deal: 'Yllätyspussit 3€/kpl',
    location: 'Herttoniemi, Helsinki',
    rating: 4.2,
  },
];

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleDelete = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FavoritEats</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteCard
            title={item.name}
            image={item.image}
            price={item.price}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <View style={styles.storeSection}>
        <Text style={styles.heading}>🏪 Stores 🏪</Text>
        <FlatList
          horizontal
          data={favoriteStores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.storeCard}>
              <Image source={{ uri: item.image }} style={styles.storeImage} />
              <View style={styles.overlay}>
                <Text style={styles.storeName}>{item.name}</Text>
                <Text style={styles.storeDeal}>{item.deal}</Text>
                <Text style={styles.storeMeta}>📍 {item.location}  ⭐ {item.rating.toFixed(1)}</Text>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 100 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingTop: 20,
    paddingHorizontal: 12,
    //paddingBottom: 50,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#16423C',
    marginBottom: 16,
    marginTop: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  storeSection: {
    backgroundColor: '#6A9C89', 
    paddingVertical: 8,
    borderRadius: 12,
    //marginBottom: 12,
  },
  storeCard: {
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    //backgroundColor: '#ccc',
  },
  
  storeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  
  storeName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  storeDeal: {
    color: '#f0f0f0',
    fontSize: 13,
  },
  
  storeMeta: {
    color: '#ddd',
    fontSize: 12,
    marginTop: 2,
  },  
});
