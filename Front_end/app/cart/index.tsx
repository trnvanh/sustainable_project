import { CartItem, useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    ImageSourcePropType,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

export default function CartScreen() {
    // Use useState to track key changes to force re-renders
    const [cartUpdateKey, setCartUpdateKey] = React.useState(0);

    const {
        items,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        loading,
        error,
        setError,
    } = useCartStore();

    // Listen for changes in items length to force re-render
    React.useEffect(() => {
        setCartUpdateKey(prev => prev + 1);
    }, [items.length]);

    const {
        createOrder,
        loading: orderLoading,
        error: orderError,
        clearError: clearOrderError,
    } = useOrderStore();

    const handleIncrement = (item: CartItem) => {
        if (item.maxQuantity && item.quantity >= item.maxQuantity) {
            showMessage({
                message: `Only ${item.maxQuantity} portions available`,
                type: 'warning',
                icon: 'warning',
            });
            return;
        }
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = (item: CartItem) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        } else {
            removeFromCart(item.id);
        }
    };

    // Fixed handleRemove with comprehensive error handling and validation
    const handleRemove = async (item: CartItem) => {
        try {
            console.log('Current items:', items);
            if (!items || !Array.isArray(items)) {
                console.error('Invalid cart items:', items);
                showMessage({
                    message: 'Failed to remove item',
                    type: 'danger',
                    icon: 'danger',
                });
                return;
            }

            const itemExists = items.some((i) => i.id === item.id);
            if (!itemExists) {
                console.error(`Item ${item.id} not found`);
                showMessage({
                    message: 'Failed to remove item',
                    type: 'warning',
                    icon: 'warning',
                });
                return;
            }

            console.log('Removing item:', item.id);
            await removeFromCart(item.id);

            const currentItems = useCartStore.getState().items;
            const stillExists = currentItems.some((i) => i.id === item.id);

            if (stillExists) {
                console.error('Failed to remove item');
                showMessage({
                    message: 'Failed to remove item',
                    type: 'danger',
                    icon: 'danger',
                });
            } else {
                console.log('Item removed successfully');
                showMessage({
                    message: `${item.name} removed successfully`,
                    type: 'success',
                    icon: 'success',
                });
            }
        } catch (error: any) {
            console.error('Error removing item:', error);
            showMessage({
                message: `Failed: ${error?.message || 'Unknown error'}`,
                type: 'danger',
                icon: 'danger',
            });
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            showMessage({
                message: `Removed all items from cart`,
                type: 'success',
                icon: 'success',
            });
        } catch (error) {
            console.error('Error removing');
            showMessage({
                message: `Error removing`,
                type: 'danger',
                icon: 'danger',
            });
        }
    };

    const handleCheckout = async () => {
        if (items.length === 0) {
            showMessage({
                message: 'Your cart is empty',
                type: 'warning',
                icon: 'warning',
            });
            return;
        }

        // Clear any previous errors
        clearOrderError();
        setError(null);

        try {
            // Use default pickup time (1 hour from now)
            const success = await createOrder(items);
            if (success) {
                clearCart(); // Clear cart after successful order creation
                showMessage({
                    message: 'Order created successfully!',
                    type: 'success',
                    icon: 'success',
                });
                router.push('/orders');
            } else {
                showMessage({
                    message: orderError || 'Failed to create order',
                    type: 'danger',
                    icon: 'danger',
                });
            }
        } catch (error: any) {
            showMessage({
                message: error.message || 'Failed to create order',
                type: 'danger',
                icon: 'danger',
            });
        }
    };

    const getImageSource = (image: string | number): ImageSourcePropType => {
        if (typeof image === 'string') {
            return { uri: image };
        } else if (typeof image === 'number') {
            return image;
        } else {
            return { uri: 'https://via.placeholder.com/80x60.png?text=Food' };
        }
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <Image source={getImageSource(item.image)} style={styles.itemImage} />

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemLocation}>{item.location.restaurant}</Text>
                <Text style={styles.itemPickupTime}>{item.pickupTime}</Text>
                <Text style={styles.itemPrice}>
                    {typeof item.price === 'string' ? item.price : `€${Number(item.price).toFixed(2)}`}
                </Text>
            </View>

            <View style={styles.quantityContainer}>
                <View style={styles.quantityControls}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleDecrement(item)}
                    >
                        <Ionicons name="remove" size={16} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleIncrement(item)}
                    >
                        <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(item)}
                    activeOpacity={0.7}
                    testID={`remove-${item.id}`}
                >
                    <Ionicons name="trash-outline" size={22} color="#FF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyCart = () => (
        <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtitle}>Add some delicious food to get started!</Text>
            <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/explore')}
            >
                <Text style={styles.exploreButtonText}>Explore Offers</Text>
            </TouchableOpacity>
        </View>
    );

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/explore')}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cart</Text>
                    <View style={{ width: 24 }} />
                </View>
                {renderEmptyCart()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/explore')}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart ({getTotalItems()} items)</Text>
                <TouchableOpacity onPress={handleClearCart}>
                    <Ionicons name="trash-outline" size={24} color="#FF4444" />
                </TouchableOpacity>
            </View>

            {/* Error Display */}
            {(error || orderError) && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error || orderError}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setError(null);
                            clearOrderError();
                        }}
                        style={styles.dismissError}
                    >
                        <Ionicons name="close" size={16} color="#FF4444" />
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                style={styles.cartList}
                showsVerticalScrollIndicator={false}
                extraData={[items.length, cartUpdateKey]} // Use both length and update key for reliable rerendering
                key={`cart-list-${cartUpdateKey}`} // Force complete recreation on key changes
            />

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>€{getTotalPrice().toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.checkoutButton, (loading || orderLoading) && styles.disabledButton]}
                    onPress={handleCheckout}
                    disabled={loading || orderLoading}
                >
                    <Text style={styles.checkoutButtonText}>
                        {loading || orderLoading ? 'Processing...' : 'Proceed to Checkout'}
                    </Text>
                </TouchableOpacity>

                {/* Hidden debug button for cart testing */}
                <TouchableOpacity
                    style={styles.debugButton}
                    onPress={() => {
                        console.log('Debug button pressed, navigating to cart test');
                        router.push('/cart-test');
                    }}
                    accessibilityLabel="Debug cart functionality"
                >
                    <Text style={styles.debugButtonText}>•</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    cartList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    itemLocation: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    itemPickupTime: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
    },
    quantityContainer: {
        alignItems: 'center',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginBottom: 8,
    },
    quantityButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minWidth: 36,
        minHeight: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyCartTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyCartSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    exploreButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4CAF50',
    },
    checkoutButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
        marginHorizontal: 16,
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    errorText: {
        color: '#c62828',
        fontSize: 14,
        flex: 1,
        marginRight: 8,
    },
    dismissError: {
        padding: 4,
    },
    debugButton: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugButtonText: {
        fontSize: 20,
        color: '#ccc',
    },
});