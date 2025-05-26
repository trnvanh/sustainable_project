import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

interface CartTrashIconDebugProps {
    itemId: string;
    itemName: string;
}

export function CartTrashIconDebug({ itemId, itemName }: CartTrashIconDebugProps) {
    const { removeFromCart, items } = useCartStore();
    const [clickCount, setClickCount] = useState(0);

    const handleRemoveWithDebug = () => {
        console.log('🗑️ Trash icon clicked for item:', itemId);
        setClickCount(prev => prev + 1);

        // Check if item exists
        const itemExists = items.find(item => item.id === itemId);
        console.log('📋 Item exists in cart:', !!itemExists);
        console.log('📋 Current cart items:', items.length);

        Alert.alert(
            'Debug: Remove Item',
            `Remove ${itemName} from cart?\n\nDebug Info:\n- Item ID: ${itemId}\n- Item exists: ${!!itemExists}\n- Cart items: ${items.length}\n- Click count: ${clickCount + 1}`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => console.log('❌ Removal cancelled')
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        console.log('🔄 Attempting to remove item:', itemId);
                        try {
                            console.log('🔄 Before removal - Cart items:', items.length);
                            console.log('🔄 Removing item with ID:', itemId);
                            removeFromCart(itemId);
                            console.log('✅ removeFromCart called successfully');

                            // Check if item was actually removed - using the store directly instead of hook in setTimeout
                            setTimeout(() => {
                                const currentItems = useCartStore.getState().items;
                                const stillExists = currentItems.some(item => item.id === itemId);
                                console.log('🔍 Item still exists after removal:', stillExists);
                                console.log('📊 Cart items after removal:', currentItems.length);

                                if (stillExists) {
                                    showMessage({
                                        message: '❌ Item was not removed - Debug mode',
                                        type: 'danger',
                                        icon: 'danger',
                                    });
                                } else {
                                    showMessage({
                                        message: `✅ ${itemName} removed successfully - Debug mode`,
                                        type: 'success',
                                        icon: 'success',
                                    });
                                }
                            }, 100);
                        } catch (error) {
                            console.error('❌ Error removing item:', error);
                            showMessage({
                                message: `Error removing item: ${error}`,
                                type: 'danger',
                                icon: 'danger',
                            });
                        }
                    }
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.debugButton}
                onPress={handleRemoveWithDebug}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="trash-outline" size={22} color="#FF4444" />
                <Text style={styles.debugText}>DEBUG</Text>
            </TouchableOpacity>
            <Text style={styles.clickCount}>Clicks: {clickCount}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginLeft: 8,
    },
    debugButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FF4444',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minWidth: 50,
        minHeight: 36,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    debugText: {
        fontSize: 8,
        color: '#FF4444',
        fontWeight: 'bold',
        marginLeft: 2,
    },
    clickCount: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    },
});
