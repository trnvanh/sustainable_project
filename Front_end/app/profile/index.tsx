import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { getProfileImageUrl } from '@/utils/imageUtils';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { fetchOrders } = useOrderStore();
  const { colors } = useTheme();

  // Pre-fetch orders when profile screen loads
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.primary,
      padding: 16,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    greeting: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.surface,
    },
    avatarPlaceholder: {
      width: 50,
      height: 50,
      backgroundColor: colors.surface,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    creditsCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      marginTop: -10,
      marginBottom: 20,
      alignItems: 'center',
      borderColor: colors.border,
      borderWidth: colors.text === '#000000' ? 0 : 1,
    },
    creditsLabel: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    creditsAmount: {
      fontSize: 40,
      fontWeight: 'bold',
      color: colors.primary,
    },
    redeemButton: {
      marginTop: 12,
      backgroundColor: colors.primary,
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    redeemText: {
      color: colors.surface,
      fontSize: 14,
      fontWeight: '600',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    statCard: {
      backgroundColor: colors.surface,
      flex: 1,
      marginHorizontal: 4,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      borderColor: colors.border,
      borderWidth: colors.text === '#000000' ? 0 : 1,
    },
    statText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
    optionCard: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderColor: colors.border,
      borderWidth: colors.text === '#000000' ? 0 : 1,
    },
    optionText: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
    },
    logoutButton: {
      backgroundColor: colors.error,
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
      alignItems: 'center',
    },
    logoutText: {
      color: colors.surface,
      fontSize: 17,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.greeting}>Hi {user?.name}!</Text>
          {getProfileImageUrl(user?.profileImageUrl) ? (
            <Image source={{ uri: getProfileImageUrl(user?.profileImageUrl)! }} style={dynamicStyles.avatarImage} />
          ) : (
            <View style={dynamicStyles.avatarPlaceholder}>
              <Text style={dynamicStyles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </View>

        {/* Credits Section */}
        <View style={dynamicStyles.creditsCard}>
          <Text style={dynamicStyles.creditsLabel}>Your Credits</Text>
          <Text style={dynamicStyles.creditsAmount}>{user?.credits}</Text>
          <TouchableOpacity style={dynamicStyles.redeemButton}>
            <Text style={dynamicStyles.redeemText}>Redeem rewards</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Small Cards */}
        <View style={dynamicStyles.statsRow}>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statText}>Rescued</Text>
            <Text style={dynamicStyles.statText}>{user?.rescuedMeals} meals</Text>
          </View>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statText}>CO2 Saved</Text>
            <Text style={dynamicStyles.statText}>{user?.co2SavedKg} kg</Text>
          </View>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statText}>Money Saved</Text>
            <Text style={dynamicStyles.statText}>{user?.moneySavedEur} €</Text>
          </View>
        </View>

        {/* Options */}
        <TouchableOpacity style={dynamicStyles.optionCard} onPress={() => { router.push('/profile-info') }}>
          <Text style={dynamicStyles.optionText}>Profile info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.optionCard} onPress={() => { router.push('/order-history') }}>
          <Text style={dynamicStyles.optionText}>Order history</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.optionCard} onPress={() => { router.push('/settings') }}>
          <Text style={dynamicStyles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.optionCard} onPress={() => { router.push('/contact') }}>
          <Text style={dynamicStyles.optionText}>Contact us</Text>
        </TouchableOpacity>

        {/* Log out Button */}
        <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
          <Text style={dynamicStyles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
