import { useCartStore } from '@/store/useCartStore';
import { ProductResponse } from '@/types/productTypes';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

interface CartButtonProps {
    product: ProductResponse;
    style?: any;
    showQuantity?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export default function CartButton({
    product,
    style,
    showQuantity = false,
    size = 'medium'
}: CartButtonProps) {
    const { addToCart, getItemById, updateQuantity, removeFromCart, error, setError } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);

    const cartItem = getItemById(product.id.toString());
    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = async () => {
        if (isAdding) return;

        setIsAdding(true);
        try {
            if (product.portionsLeft <= 0) {
                showMessage({
                    message: 'Sorry, this item is out of stock',
                    type: 'warning',
                    icon: 'warning',
                });
                return;
            }

            addToCart(product, 1);

            if (!error) {
                showMessage({
                    message: `${product.name} added to cart!`,
                    type: 'success',
                    icon: 'success',
                    duration: 2000,
                });
            } else {
                showMessage({
                    message: error,
                    type: 'warning',
                    icon: 'warning',
                });
                setError(null);
            }
        } catch (err) {
            showMessage({
                message: 'Failed to add item to cart',
                type: 'danger',
                icon: 'danger',
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleIncrement = () => {
        updateQuantity(product.id.toString(), quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id.toString(), quantity - 1);
        } else {
            removeFromCart(product.id.toString());
        }
    };

    const buttonSize = {
        small: { width: 30, height: 30, iconSize: 16, fontSize: 12 },
        medium: { width: 40, height: 40, iconSize: 20, fontSize: 14 },
        large: { width: 50, height: 50, iconSize: 24, fontSize: 16 }
    }[size];

    if (showQuantity && quantity > 0) {
        return (
            <View style={[styles.quantityContainer, style]}>
                <TouchableOpacity
                    style={[styles.quantityButton, { width: buttonSize.width, height: buttonSize.height }]}
                    onPress={handleDecrement}
                >
                    <Ionicons name="remove" size={buttonSize.iconSize} color="#fff" />
                </TouchableOpacity>

                <Text style={[styles.quantityText, { fontSize: buttonSize.fontSize }]}>
                    {quantity}
                </Text>

                <TouchableOpacity
                    style={[styles.quantityButton, { width: buttonSize.width, height: buttonSize.height }]}
                    onPress={handleIncrement}
                >
                    <Ionicons name="add" size={buttonSize.iconSize} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[
                styles.addButton,
                { width: buttonSize.width, height: buttonSize.height },
                product.portionsLeft <= 0 && styles.disabledButton,
                style
            ]}
            onPress={handleAddToCart}
            disabled={isAdding || product.portionsLeft <= 0}
        >
            {isAdding ? (
                <Ionicons name="hourglass" size={buttonSize.iconSize} color="#fff" />
            ) : (
                <Ionicons name="add" size={buttonSize.iconSize} color="#fff" />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    quantityButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 12,
        fontWeight: '600',
        color: '#333',
    },
});