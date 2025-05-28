import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('tuanbeovnn@gmail.com');
  const [password, setPassword] = useState('P@ssword*123');
  const login = useAuthStore((state) => state.login);
  const {
    loading,
  } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation handled inside the store
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 8, color: '#555' }}>Loading login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HeroEats</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>Forget password?</Text>
      </Pressable>

      <Pressable style={styles.link} onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    backgroundColor: '#C4DAD2',
  },
  container: {
    flex: 1,
    paddingTop: 160,
    paddingHorizontal: 24,
    backgroundColor: '#D1E3DE',
  },
  title: {
    fontSize: 38,
    marginBottom: 32,
    textAlign: 'center',
    color: '#16423C',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3D6D61',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#3D6D61',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});