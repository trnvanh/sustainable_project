import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export default function SocialButton({ title, icon, color, onPress }: Props) {
  return (
    <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
