import React from 'react'
import {Image, View, Text, StyleSheet, Pressable, Button } from 'react-native';
import { router, useRouter } from 'expo-router';
import { Link } from 'expo-router';

export default function PreloginScreen() {
  const router = useRouter();

  const createAcc = () => {
    router.replace('/welcome');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>HeroEats</Text>

      <Text>Are you signing up as</Text>

      <View style={styles.buttonGroup}>
        <Link href="/login" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>HeroEater</Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable style={styles.buttonSecondary}>
            <Text style={styles.buttonText}>Business</Text>
          </Pressable>
        </Link>
        <Text style={{ color: '#16423C', textDecorationLine: 'underline' }}>
          <Link href="/welcome">Don't have account yet?</Link>
        </Text>
      </View>
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
