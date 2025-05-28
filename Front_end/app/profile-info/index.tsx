import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/api/profile';
import ScreenWithBack from '@/components/ScreenBack';
import { useAuthStore } from "@/store/useAuthStore";
import { getProfileImageUrl } from '@/utils/imageUtils';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileInfoScreen() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState<string | null>(user?.profileImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!accessToken) {
        setIsFetching(false);
        return;
      }

      try {
        const profileData = await getUserProfile(accessToken);

        // Update local state with API data
        setName(`${profileData.firstname || ''} ${profileData.lastname || ''}`.trim());
        setEmail(profileData.email || '');
        setPhone(profileData.phoneNumber || '');

        if (profileData.profileImageUrl) {
          setAvatar(profileData.profileImageUrl);
        }

        // Update the store if needed
        await updateUser({
          name: `${profileData.firstname || ''} ${profileData.lastname || ''}`.trim(),
          email: profileData.email,
          phone: profileData.phoneNumber || '',
          profileImageUrl: profileData.profileImageUrl,
        });
      } catch (error: any) {
        console.error('Failed to fetch profile data:', error);
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfileData();
  }, [accessToken]);

  const handleSave = async () => {
    if (!accessToken) {
      Alert.alert('Error', 'Please login to update your profile');
      return;
    }

    setIsLoading(true);
    try {
      // Parse first and last name from full name
      const nameParts = name.trim().split(' ');
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';

      console.log('Updating profile with data:', { firstname, lastname, phoneNumber: phone });

      // Update profile using API
      const updatedProfile = await updateUserProfile(accessToken, {
        firstname,
        lastname,
        phoneNumber: phone,
      });

      console.log('Profile update response:', updatedProfile);

      // Update local store with returned data to ensure consistency
      await updateUser({
        name: `${updatedProfile.firstname || ''} ${updatedProfile.lastname || ''}`.trim(),
        phone: updatedProfile.phoneNumber || '',
        // Don't update email as it comes from backend and is not editable in UI
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    if (!accessToken) {
      Alert.alert('Error', 'Please login to upload images');
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsUploadingImage(true);
      try {
        // Create a blob from the image URI
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        // Upload the image
        const imageUrl = await uploadProfileImage(accessToken, blob);

        // Update local state
        setAvatar(imageUrl);

        // After uploading image, fetch the updated profile to ensure 
        // we have the latest data from the server
        const updatedProfile = await getUserProfile(accessToken);

        // Update user store with the full profile data
        await updateUser({
          profileImageUrl: imageUrl || updatedProfile.profileImageUrl,
        });

        Alert.alert('Success', 'Profile image updated successfully!');
      } catch (error: any) {
        console.error('Failed to upload image:', error);
        Alert.alert('Error', error.message || 'Failed to upload image');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  return (
    <ScreenWithBack title={'Profile'}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        {isFetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#335248" />
            <Text style={styles.loadingText}>Loading profile data...</Text>
          </View>
        ) : (
          <>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {getProfileImageUrl(avatar) ? (
                <Image source={{ uri: getProfileImageUrl(avatar)! }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarPlaceholder}>
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.editAvatar, isUploadingImage && styles.editAvatarDisabled]}
                onPress={pickImage}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.editAvatarText}>Edit</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                editable={false} // Email is typically not editable
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="0123456789"
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#335248',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#666',
  },
  editAvatar: {
    marginTop: 8,
    backgroundColor: '#7C9B8D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editAvatarDisabled: {
    backgroundColor: '#999',
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
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
