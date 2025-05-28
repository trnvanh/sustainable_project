import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    useEffect(() => {
        (async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          router.push('/login')
        })();
      }, []); 

    return (
        <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Welcome to</Text>
                <Text style={styles.name}>HeroEats</Text>

                <Image source={require('@/assets/images/logo.png')} style={styles.image} />

                <ActivityIndicator size="large" color="#335248" style={{ marginTop: 20 }} />
        </SafeAreaView>
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