import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ScreenWithBack({ children, title }) {
    return (
        <View style={{ flex: 1, paddingTop: 50 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>{title}</Text>
            </View>
            {children}
        </View>
    );
}
