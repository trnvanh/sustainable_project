import { CartRemovalTestScreen } from '@/components/CartRemovalTestScreen';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function CartTestScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <CartRemovalTestScreen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
