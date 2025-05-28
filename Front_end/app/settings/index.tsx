import ScreenWithBack from '@/components/ScreenBack';
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { theme: currentTheme, colors, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [theme, setTheme] = useState(user?.preferences?.theme || 'light');
  const [language, setLanguage] = useState(user?.preferences?.language || 'en');
  const [notifications, setNotifications] = useState(
    user?.preferences?.notifications ?? true
  );

  const handleSave = () => {
    if (!user) return;

    updateUser({
      name,
      phone,
      preferences: {
        theme,
        language,
        notifications,
      },
    });

    console.log('Success', 'Your settings have been saved.');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    // Update the theme context immediately for live preview
    if (newTheme !== currentTheme) {
      toggleTheme();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 20,
      color: colors.primary,
    },
    label: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 6,
      color: colors.text,
    },
    input: {
      backgroundColor: colors.surface,
      padding: 10,
      marginBottom: 16,
      borderRadius: 8,
      borderColor: colors.border,
      borderWidth: 1,
      color: colors.text,
    },
    themeContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    themeOption: {
      flex: 1,
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      borderColor: colors.border,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    themeOptionActive: {
      borderColor: colors.primary,
      borderWidth: 2,
      backgroundColor: colors.primary + '10', // Add slight tint
    },
    themeOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    themeOptionText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    themeOptionTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    pickerContainer: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 16,
      borderColor: colors.border,
      borderWidth: 1,
    },
    picker: {
      height: 50,
      width: '100%',
      color: colors.text,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 12,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScreenWithBack title="Profile">
        <Text style={styles.title}>Settings</Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        {/* Phone */}
        <Text style={styles.label}>Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />

        {/* Theme Selection */}
        <Text style={styles.label}>Theme</Text>
        <View style={styles.themeContainer}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === 'light' && styles.themeOptionActive,
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <View style={styles.themeOptionContent}>
              <Ionicons
                name="sunny"
                size={24}
                color={theme === 'light' ? colors.primary : colors.text}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  theme === 'light' && styles.themeOptionTextActive,
                ]}
              >
                Light
              </Text>
            </View>
            {theme === 'light' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === 'dark' && styles.themeOptionActive,
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <View style={styles.themeOptionContent}>
              <Ionicons
                name="moon"
                size={24}
                color={theme === 'dark' ? colors.primary : colors.text}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  theme === 'dark' && styles.themeOptionTextActive,
                ]}
              >
                Dark
              </Text>
            </View>
            {theme === 'dark' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Language Picker */}
        <Text style={styles.label}>Language</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={language}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Finnish" value="fi" />
            <Picker.Item label="Vietnamese" value="vi" />
          </Picker>
        </View>

        {/* Notifications Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
       </ScreenWithBack>
    </SafeAreaView>
  );
}
