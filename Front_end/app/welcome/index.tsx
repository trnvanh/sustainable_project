import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to FoodRescue</Text>
                <Text style={styles.subtitle}>Save food, save the planet</Text>

                <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4DAD2',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#16423C',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#335248',
        textAlign: 'center',
        marginBottom: 48,
    },
    getStartedButton: {
        backgroundColor: '#6A9C89',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 25,
        minWidth: 200,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});