import React from 'react'
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.name}>HeroEats</Text>

      <Image source={require('@/assets/images/logo.png')} style={styles.image} />

      <View style={styles.buttonGroup}>
        <Link href="/register" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
        </Link>
        <Link href="/prelogin" asChild>
          <Pressable style={styles.buttonSecondary}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        </Link>
      </View>

      <Text style={{ color: '#16423C', textDecorationLine: 'underline' }}>
        <Link href="/explore">Wanna see offers before signing up?</Link>
      </Text>
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
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#6A9C89',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    marginTop: 80,
  },
  buttonSecondary: {
    backgroundColor: '#6A9C89',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
