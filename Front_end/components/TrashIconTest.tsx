import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Test component to verify trash icon functionality
export function TrashIconTest() {
    const { items, removeFromCart } = useCartStore();

    const testRemoval = () => {
        console.log('Test trash icon clicked');
        Alert.alert(
            'Test',
            'Trash icon is working!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        console.log('Alert confirmed - trash icon responsive');
                        if (items.length > 0) {
                            console.log('Attempting to remove first item:', items[0].id);
                            removeFromCart(items[0].id);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trash Icon Test</Text>
            <Text style={styles.subtitle}>Items in cart: {items.length}</Text>

            <TouchableOpacity
                style={styles.testButton}
                onPress={testRemoval}
                activeOpacity={0.7}
            >
                <Ionicons name="trash-outline" size={22} color="#FF4444" />
                <Text style={styles.buttonText}>Test Trash Icon</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.testButton, styles.enhancedButton]}
                onPress={testRemoval}
                activeOpacity={0.7}
            >
                <Ionicons name="trash-outline" size={24} color="#fff" />
                <Text style={styles.enhancedButtonText}>Enhanced Trash Icon</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        margin: 10,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    enhancedButton: {
        backgroundColor: '#FF4444',
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    enhancedButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});
