import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import SocialButton from '@/components/SocialButton';

export default function Register() {
  const router = useRouter();

  const handleFacebook = () => {
    // connect to Facebook auth logic
    console.log('Facebook signup');
    router.push('/explore');
  };

  const handleGoogle = () => {
    // connect to Google auth logic
    console.log('Google signup');
  };

  const handleEmail = () => {
    // Navigate to email registration form
    console.log('Email signup');
    router.push('/email-signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HeroEats</Text>

      <SocialButton title="Continue with Facebook" icon="logo-facebook" color="#3b5998" onPress={handleFacebook} />
      <SocialButton title="Continue with Google" icon="logo-google" color="#db4437" onPress={handleGoogle} />
      <SocialButton title="Continue with Email" icon="mail" color="#4285F4" onPress={handleEmail} />

      <Link href="/login" style={styles.loginText}>
        Already have an account? Log in
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 160,
    paddingHorizontal: 24,
    backgroundColor: '#C4DAD2',
  },
  title: {
    fontSize: 38,
    marginBottom: 32,
    textAlign: 'center',
    color: '#16423C',
  },
  loginText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#16423C',
    textDecorationLine: 'underline',
  },
});

