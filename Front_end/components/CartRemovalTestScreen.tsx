import { useCartStore } from '@/store/useCartStore';
import { addTestProducts, testCartRemoval } from '@/utils/cartDebug';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartTrashIcon } from './CartTrashIcon';

export function CartRemovalTestScreen() {
    const { items, addToCart, removeFromCart, clearCart } = useCartStore();
    const [testResults, setTestResults] = useState<string[]>([]);

    // Add a test product to the cart
    const addTestProduct = () => {
        try {
            // Use the utility function from cartDebug.ts
            const success = addTestProducts(1);

            if (success) {
                setTestResults(prev => [...prev, '✅ Added test product to cart']);
            } else {
                setTestResults(prev => [...prev, '❌ Failed to add test product']);
            }
        } catch (error) {
            setTestResults(prev => [...prev, `❌ Error adding test product: ${error}`]);
        }
    };

    // Test direct removal using the debug utility
    const testDirectRemoval = () => {
        if (items.length === 0) {
            setTestResults(prev => [...prev, '⚠️ No items in cart to remove']);
            return;
        }

        const item = items[0];
        try {
            setTestResults(prev => [...prev, `🔄 Attempting to remove: ${item.id}`]);

            // Use the utility function from cartDebug.ts
            const result = testCartRemoval(item.id);

            if (result.success) {
                setTestResults(prev => [...prev, `✅ Successfully removed: ${item.id}`]);
                setTestResults(prev => [...prev, `🔍 Debug info: ${JSON.stringify(result.debugInfo)}`]);
            } else {
                setTestResults(prev => [...prev, `❌ Removal failed: ${result.reason}`]);
                setTestResults(prev => [...prev, `🔍 Debug info: ${JSON.stringify(result.debugInfo || {})}`]);
            }
        } catch (error) {
            setTestResults(prev => [...prev, `❌ Error removing item: ${error}`]);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cart Removal Test Screen</Text>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Current Cart Status</Text>
                <Text style={styles.infoText}>Items in cart: {items.length}</Text>
                {items.map(item => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemText}>
                            {item.name} (ID: {item.id})
                        </Text>
                        <CartTrashIcon itemId={item.id} itemName={item.name} />
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Add Test Product" onPress={addTestProduct} />
                <View style={styles.buttonSpacer} />
                <Button title="Test Direct Removal" onPress={testDirectRemoval} />
                <View style={styles.buttonSpacer} />
                <Button title="Clear Cart" onPress={clearCart} />
            </View>

            <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Test Results</Text>
                {testResults.map((result, index) => (
                    <Text key={index} style={styles.resultText}>{result}</Text>
                ))}
                {testResults.length === 0 && (
                    <Text style={styles.noResultsText}>No tests run yet</Text>
                )}
                {testResults.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => setTestResults([])}
                    >
                        <Text style={styles.clearButtonText}>Clear Results</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f7fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 14,
        color: '#333',
    },
    buttonContainer: {
        marginBottom: 16,
    },
    buttonSpacer: {
        height: 8,
    },
    resultsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    resultText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    noResultsText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    clearButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#666',
        fontWeight: '500',
    },
});
