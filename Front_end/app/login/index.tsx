import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }
    setLoading(true);
    await AsyncStorage.setItem('isLoggedIn', 'true'); // change the state to logged in
    login({ name: 'testuser', password: '1234' }); // mock login
    router.replace('/explore'); // redirect to main app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HeroEats</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3D6D61" style={{ marginTop: 20 }} />
      ) : (
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
      )}

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>Forget password?</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>
            <Link href="/welcome">Don't have account yet?</Link>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
