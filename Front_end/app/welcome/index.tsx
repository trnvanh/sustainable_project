import { Image, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


export default function WelcomeScreen() {
  const router = useRouter();
  
  useEffect(() => {
    (async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        console.log('User has logged in');
        router.replace('/explore');
      } else {
        router.replace('/prelogin');
      }
    })();
  }, []);  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.name}>HeroEats</Text>

      <Image source={require('@/assets/images/favicon.png')} style={styles.image} />

      <ActivityIndicator size="large" color="#335248" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C4DAD2',
    padding: 20,
  },
  title: {
    color: '#6A9C89',
    fontSize: 30,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  name: {
    color: '#16423C',
    fontSize: 38,
    fontWeight: 'bold',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
