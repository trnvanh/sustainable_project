import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function EmailSignup() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!fullName || !email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    // You can connect this to Firebase or your backend here
    console.log('Signing up:', { fullName, email, password });
    Alert.alert('Signed up!', `Welcome, ${fullName}`);
    router.replace('/'); // Go to home or dashboard after signup
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up with Email</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>← Back to Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4285F4',
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
