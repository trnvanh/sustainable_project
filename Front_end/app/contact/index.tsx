import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenWithBack from '@/components/ScreenBack';

export default function ContactScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+358401234567');
  };

  return (
    <ScreenWithBack title={'Profile'}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Contact Us</Text>

        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.contactImage}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <Ionicons name="mail" size={28} color="#335248" />
          <View style={styles.cardInfo}>
            <Text style={styles.label}>Email</Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={styles.value}>support@heroeats.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="call" size={28} color="#335248" />
          <View style={styles.cardInfo}>
            <Text style={styles.label}>Phone</Text>
            <TouchableOpacity onPress={handlePhonePress}>
              <Text style={styles.value}>+358 40 123 4567</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="location" size={28} color="#335248" />
          <View style={styles.cardInfo}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>Opiskelijankatu 1, 33720 Tampere, Finland</Text>
          </View>
        </View>
      </SafeAreaView>
    </ScreenWithBack>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F0F1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#335248',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardInfo: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#335248',
    marginTop: 4,
  },
  contactImage: {
    width: '100%',
    height: 180,
    marginTop: 20,
  },
});
