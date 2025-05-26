import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';

interface CartTrashIconProps {
    itemId: string;
    itemName: string;
}

export function CartTrashIcon({ itemId, itemName }: CartTrashIconProps) {
    const { removeFromCart } = useCartStore();

    const handleRemove = () => {
        Alert.alert(
            'Remove Item',
            `Remove ${itemName} from cart?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            removeFromCart(itemId);

                            // Show success message
                            showMessage({
                                message: `${itemName} removed from cart`,
                                type: 'success',
                                icon: 'success',
                            });
                        } catch (error) {
                            console.error('Error removing item:', error);
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
        <TouchableOpacity
            style={styles.trashButton}
            onPress={handleRemove}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="trash-outline" size={22} color="#FF4444" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    trashButton: {
        padding: 8,
        borderRadius: 8,
    },
});
