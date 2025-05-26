import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, } from 'react-native';
import ScreenWithBack from '@/components/ScreenBack';
import {useAuthStore} from "@/store/useAuthStore";

export default function ProfileInfoScreen() {
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleSave = () => {
    console.log('Saved:', { name, email, phone });
    // save information in database
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <ScreenWithBack title={'Profile'}>
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar} />
            )}
        <TouchableOpacity style={styles.editAvatar} onPress={pickImage}>
          <Text style={styles.editAvatarText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={user?.name}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="0123456789"
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    color: '#335248',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  editAvatar: {
    marginTop: 8,
    backgroundColor: '#7C9B8D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editAvatarText: {
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#335248',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
