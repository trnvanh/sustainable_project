import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { Picker } from '@react-native-picker/picker';
import ScreenWithBack from '@/components/ScreenBack';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

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
    Toast.show({
      type: 'success',
      text1: 'Settings Saved',
      text2: 'Your preferences have been updated successfully.',
      position: 'top',
      visibilityTime: 2500,
    });
  };

  return (
    <ScreenWithBack title={'Profile'}>
      <SafeAreaView style={styles.container}>
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

        {/* Theme Picker */}
        <Text style={styles.label}>Theme</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={theme}
            onValueChange={(itemValue) => setTheme(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Light" value="light" />
            <Picker.Item label="Dark" value="dark" />
          </Picker>
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
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#335248',
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
