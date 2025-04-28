import React from 'react';
import { router, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = () => {
        router.replace('/welcome'); // redirect to main app
      };

    const CREDITS = 120;
    const RESCUED = 100;
    const CO2 = 250;
    const MONEY = 65;

    return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Hi Anh!</Text>
              <View style={styles.avatarPlaceholder} />
            </View>
    
            {/* Credits Section */}
            <View style={styles.creditsCard}>
            <Text style={styles.creditsLabel}>Your Credits</Text>
            <Text style={styles.creditsAmount}>{CREDITS}</Text>
            <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemText}>Redeem rewards</Text>
            </TouchableOpacity>
            </View>
    
            {/* 3 Small Cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statText}>Rescued</Text>
                <Text style={styles.statText}>{RESCUED} meals</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statText}>CO2 Saved</Text>
                <Text style={styles.statText}>{CO2} kg</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statText}>Money Saved</Text>
                <Text style={styles.statText}>{MONEY} €</Text>
              </View>
            </View>
    
            {/* Options */}
            <TouchableOpacity style={styles.optionCard}>
              <Text style={styles.optionText}>Profile info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <Text style={styles.optionText}>Order history</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <Text style={styles.optionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard}>
              <Text style={styles.optionText}>Contact us</Text>
            </TouchableOpacity>
    
            {/* Log out Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#C4DAD2',
        paddingHorizontal: 16,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#7C9B8D',
        padding: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
      },
      avatarPlaceholder: {
        width: 50,
        height: 50,
        backgroundColor: '#ccc',
        borderRadius: 25,
      },
      creditsCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginTop: -20,
        marginBottom: 20,
        alignItems: 'center',
      },
      creditsLabel: {
        fontSize: 18,
        color: '#555',
        marginBottom: 8,
      },
      creditsAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#335248',
      },
      redeemButton: {
        marginTop: 12,
        backgroundColor: '#7C9B8D',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
      },
      redeemText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      },      
      statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
      },
      statCard: {
        backgroundColor: '#fff',
        flex: 1,
        marginHorizontal: 4,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
      },
      statText: {
        fontSize: 16,
        fontWeight: '500',
      },
      optionCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      },
      optionText: {
        fontSize: 17,
        fontWeight: '600',
      },
      logoutButton: {
        backgroundColor: '#335248',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
      },
      logoutText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
      },
    });
