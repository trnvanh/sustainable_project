import { useTheme } from '@/context/ThemeContext';
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
import { PaymentProviderSelector } from '../../components/PaymentProviderSelector';
import { CartItem, useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';

export default function CartScreen() {
    // Use useState to track key changes to force re-renders
    const [cartUpdateKey, setCartUpdateKey] = React.useState(0);
    // Payment provider selection state
    const [showPaymentSelector, setShowPaymentSelector] = React.useState(false);
    const [selectedPaymentProvider, setSelectedPaymentProvider] = React.useState<"paypal" | "stripe" | null>(null);

    const { colors } = useTheme();

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

            const itemExists = items.some((i: CartItem) => i.id === item.id);
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
            const stillExists = currentItems.some((i: CartItem) => i.id === item.id);

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

        // If payment provider is already selected, proceed directly
        if (selectedPaymentProvider) {
            await handlePaymentProviderSelected(selectedPaymentProvider);
        } else {
            // Show payment provider selector first
            setShowPaymentSelector(true);
        }
    };

    const handlePaymentProviderSelected = async (provider: "paypal" | "stripe") => {
        setSelectedPaymentProvider(provider);

        // Prevent multiple submissions
        if (orderLoading) {
            return;
        }

        // Clear any previous errors
        clearOrderError();
        setError(null);

        try {
            // Use selected payment provider
            const success = await createOrder(items, undefined, provider);
            if (success) {
                clearCart(); // Clear cart after successful order creation
                showMessage({
                    message: `Order created successfully! Redirecting to ${provider === 'paypal' ? 'PayPal' : 'Stripe'} for payment...`,
                    type: 'success',
                    icon: 'success',
                    duration: 3000,
                });
                // Navigate to orders page after a short delay to allow payment redirect
                setTimeout(() => {
                    router.push('/orders');
                }, 2500);
            } else {
                // Provide more specific error messaging
                const errorMessage = orderError || 'Failed to create order';
                showMessage({
                    message: errorMessage,
                    type: 'danger',
                    icon: 'danger',
                    duration: 4000,
                });

                // If order creation failed, suggest trying again
                if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('connection')) {
                    setTimeout(() => {
                        showMessage({
                            message: 'Please check your internet connection and try again',
                            type: 'info',
                            icon: 'info',
                            duration: 3000,
                        });
                    }, 1000);
                }
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to create order';
            showMessage({
                message: errorMessage,
                type: 'danger',
                icon: 'danger',
                duration: 4000,
            });

            // Log error for debugging
            console.error('Checkout error:', error);
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
        <View style={dynamicStyles.cartItem}>
            <Image source={getImageSource(item.image)} style={styles.itemImage} />

            <View style={styles.itemDetails}>
                <Text style={dynamicStyles.itemName}>{item.name}</Text>
                <Text style={[styles.itemLocation, { color: colors.textSecondary }]}>{item.location.restaurant}</Text>
                <Text style={[styles.itemPickupTime, { color: colors.textMuted }]}>{item.pickupTime}</Text>
                <Text style={dynamicStyles.itemPrice}>
                    {typeof item.price === 'string' ? item.price : `€${Number(item.price).toFixed(2)}`}
                </Text>
            </View>

            <View style={styles.quantityContainer}>
                <View style={styles.quantityControls}>
                    <TouchableOpacity
                        style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                        onPress={() => handleDecrement(item)}
                    >
                        <Ionicons name="remove" size={16} color="#fff" />
                    </TouchableOpacity>

                    <Text style={dynamicStyles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={[styles.quantityButton, { backgroundColor: colors.primary }]}
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
                    <Ionicons name="trash-outline" size={22} color={colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyCart = () => (
        <View style={[styles.emptyCart, { backgroundColor: colors.background }]}>
            <Ionicons name="cart-outline" size={80} color={colors.textMuted} />
            <Text style={[styles.emptyCartTitle, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptyCartSubtitle, { color: colors.textSecondary }]}>Add some delicious food to get started!</Text>
            <TouchableOpacity
                style={[styles.exploreButton, { backgroundColor: colors.success }]}
                onPress={() => router.push('/explore')}
            >
                <Text style={styles.exploreButtonText}>Explore Offers</Text>
            </TouchableOpacity>
        </View>
    );

    const dynamicStyles = {
        container: { ...styles.container, backgroundColor: colors.background },
        header: {
            ...styles.header,
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
        },
        headerTitle: { ...styles.headerTitle, color: colors.text },
        cartItem: {
            ...styles.cartItem,
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
        },
        itemName: { ...styles.itemName, color: colors.text },
        itemPrice: { ...styles.itemPrice, color: colors.primary },
        quantityText: { ...styles.quantityText, color: colors.text },
        footer: {
            ...styles.footer,
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
        },
        totalLabel: { ...styles.totalLabel, color: colors.text },
        totalPrice: { ...styles.totalPrice, color: colors.success },
        checkoutButton: { ...styles.checkoutButton, backgroundColor: colors.primary },
        errorContainer: {
            ...styles.errorContainer,
            backgroundColor: colors.error + '20',
            borderLeftColor: colors.error,
        },
        errorText: { ...styles.errorText, color: colors.error },
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={dynamicStyles.container}>
                <View style={dynamicStyles.header}>
                    <TouchableOpacity onPress={() => router.push('/explore')}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>Cart</Text>
                    <View style={{ width: 24 }} />
                </View>
                {renderEmptyCart()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={dynamicStyles.container}>
            <View style={dynamicStyles.header}>
                <TouchableOpacity onPress={() => router.push('/explore')}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle}>Cart ({getTotalItems()} items)</Text>
                <TouchableOpacity onPress={handleClearCart}>
                    <Ionicons name="trash-outline" size={24} color={colors.error} />
                </TouchableOpacity>
            </View>

            {/* Error Display */}
            {(error || orderError) && (
                <View style={dynamicStyles.errorContainer}>
                    <Text style={dynamicStyles.errorText}>{error || orderError}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setError(null);
                            clearOrderError();
                        }}
                        style={styles.dismissError}
                    >
                        <Ionicons name="close" size={16} color={colors.error} />
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

            <View style={dynamicStyles.footer}>
                {/* Show selected payment provider if available */}
                {selectedPaymentProvider && (
                    <View style={[styles.selectedProviderContainer, { backgroundColor: colors.surfaceVariant }]}>
                        <Ionicons
                            name={selectedPaymentProvider === 'paypal' ? 'logo-paypal' : 'card'}
                            size={20}
                            color={selectedPaymentProvider === 'paypal' ? '#0070ba' : '#6772e5'}
                        />
                        <Text style={[styles.selectedProviderText, { color: colors.text }]}>
                            {selectedPaymentProvider === 'paypal' ? 'PayPal' : 'Credit Card'} selected
                        </Text>
                        <TouchableOpacity
                            onPress={() => setSelectedPaymentProvider(null)}
                            style={styles.changeProviderButton}
                        >
                            <Text style={[styles.changeProviderText, { color: colors.primary }]}>Change</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.totalContainer}>
                    <Text style={dynamicStyles.totalLabel}>Total:</Text>
                    <Text style={dynamicStyles.totalPrice}>€{getTotalPrice().toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                    style={[dynamicStyles.checkoutButton, (loading || orderLoading) && styles.disabledButton]}
                    onPress={handleCheckout}
                    disabled={loading || orderLoading}
                >
                    <Text style={styles.checkoutButtonText}>
                        {loading || orderLoading
                            ? 'Processing...'
                            : selectedPaymentProvider
                                ? `Pay with ${selectedPaymentProvider === 'paypal' ? 'PayPal' : 'Credit Card'}`
                                : 'Choose Payment & Checkout'
                        }
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

            {/* Payment Provider Selection Modal */}
            <PaymentProviderSelector
                visible={showPaymentSelector}
                onClose={() => setShowPaymentSelector(false)}
                onSelectProvider={handlePaymentProviderSelected}
                selectedProvider={selectedPaymentProvider}
            />
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
        backgroundColor: '#335248',
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
    selectedProviderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    selectedProviderText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    changeProviderButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    changeProviderText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
});