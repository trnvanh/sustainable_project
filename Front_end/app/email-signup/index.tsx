import React, { useState } from 'react';
import {View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator} from 'react-native';
import {router, useRouter} from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import {showMessage} from "react-native-flash-message";

/**
 * @fileoverview This file defines the `Register` component, which provides a user interface
 * for creating a new account. It includes form validation for user input and handles
 * registration logic using the `useAuthStore` hook. Upon successful registration, the user
 * is redirected to the `/explore` page.
 *
 * @component
 * @exports Register
 */

export default function Register() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // fallback error message
  const {
    loading,
  } = useAuthStore();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);  

  const handleRegister = async () => {
    setError(null); // Clear previous errors

    if (!firstname || !lastname  || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        'Password must be at least 8 characters, and include uppercase, lowercase, a number, and a special character'
      );
      return;
    }

    try {
      const res = await register(firstname, lastname, email, password);
      if (res.success) {
        showMessage({
          message: 'Success',
          description: 'Registration successful!',
          type: 'success',
          icon: 'success',
        });
        router.replace('/explore');
      } else {
        showMessage({
          message: 'Failed',
          description: 'Registration Failed!',
          type: 'danger',
          icon: 'danger',
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'Registration failed. Please try again.');
    }
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 8, color: '#555'}}>Loading register...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
        style={styles.input}
      />
      <TextInput
          placeholder="Last Name"
          value={lastname}
          onChangeText={setLastname}
          style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>← Back to Register</Text>
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
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 24,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
