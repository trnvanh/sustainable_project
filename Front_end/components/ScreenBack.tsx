import React, { ReactNode }from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ScreenWithBackProps {
  children: ReactNode;
  title: string;
}

export default function ScreenWithBack({ children, title }: ScreenWithBackProps) {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}
