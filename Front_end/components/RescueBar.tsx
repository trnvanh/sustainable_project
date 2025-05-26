import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';
import api from "@/api/axiosConfig";
import {OrderItem} from "@/types/order";
import {router} from "expo-router";

type RescueBarProps = {
    portionsLeft: number;
    offer: OrderItem;
};

export default function RescueBar({ portionsLeft, offer }: RescueBarProps) {
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const maxCount = portionsLeft;
    const isDisabled = portionsLeft === 0;

    const increment = () => {
        if (count < maxCount) setCount(count + 1);
    };

    const decrement = () => {
        if (count > 0) setCount(count - 1);
    };

    const handleSwipe = () => {
        if(count === 0){
            showMessage({
                message: 'Please select quantity',
                type: 'warning',
                icon: 'warning',
            });
            return;
        }
        // Transform offer to the desired format
        const simplifiedOffer = {
            ...offer,
            id: offer.id || "",
            title: offer.name || "",
            restaurant: offer.location?.restaurant || "",
            image: offer.image || "",
            date: offer.pickupTime || "",
            status: "Preparing", // Default status as per your example
        };

        // Check if offer has a valid id
        if (!simplifiedOffer.id) {
            showMessage({
                message: 'Failed to add order: Missing ID',
                type: 'error',
                icon: 'error',
            });
            return;
        }

        // Get existing activeOrders from localStorage or initialize as empty array
        let activeOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];

        // Check for duplicate by id
        if (activeOrders.some((order) => order.id === simplifiedOffer.id)) {
            showMessage({
                message: 'Order already exists',
                type: 'warning',
                icon: 'warning',
            });
            return;
        }

        // Add the simplified offer to activeOrders
        activeOrders.push(simplifiedOffer);

        // Save updated activeOrders back to localStorage
        localStorage.setItem('activeOrders', JSON.stringify(activeOrders));

        showMessage({
            message: 'Add to order successfully',
            type: 'success',
            icon: 'success',
        });

        router.replace('/orders');
    };

    useEffect(() => {
        checkFavorite();
    }, []);

    const checkFavorite = async () => {
        try {
            const res = await api.get(`/products/${offer.id}/is-favorited`);
            console.log(res.data)
            if (res.data) {
                setIsFavorite(!isFavorite);
            } else {
                setIsFavorite(false);
            }

        } catch (error: any) {

        } finally {

        }
    };

    const handleFavorite = async () => {
        try {
            setLoading(true)
            await api.post(`/products/${offer.id}/favorite`, { favorite: !isFavorite });

            setIsFavorite(!isFavorite);
            showMessage({
                message: 'Success',
                description: isFavorite
                    ? 'Product removed from wishlist!'
                    : 'Product added to wishlist!',
                type: 'success',
                icon: 'success',
            });
        } catch (error: any) {
            showMessage({
                message: 'Failed !',
                // description: error.response?.data?.message || 'Thao tác thất bại!',
                type: 'danger',
                icon: 'danger',
            });
        } finally {
            setLoading(false)
        }
    };

    // if (loading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color="#4CAF50" />
    //             <Text style={{ marginTop: 8, color: '#555'}}>Loading offer...</Text>
    //         </View>
    //     );
    // }

    return (
        <View style={styles.container}>
            {/* Portion + Counter */}
            <View style={styles.counterRow}>
                <View>
                    <Text style={styles.leftText}>{maxCount} left</Text>
                    <Text style={styles.subText}>I’ll rescue</Text>
                </View>

                <View style={styles.counter}>
                    <TouchableOpacity onPress={decrement} style={styles.counterButton}>
                        <Ionicons name="remove" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{count}</Text>
                    <TouchableOpacity onPress={increment} style={styles.counterButton}>
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Swipe to Rescue + Favorite Button */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.swipeContainer, isDisabled && styles.swipeDisabled]}
                    onPress={handleSwipe}
                    disabled={isDisabled}
                >
                    <Text style={styles.swipeText}>
                        {isDisabled ? 'Unavailable' : 'Order'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleFavorite}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? '#FF4444' : '#FFF'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // loadingContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingTop: 120,
    //     backgroundColor: '#C4DAD2',
    // },
    container: {
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    counterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    leftText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B4332',
    },
    subText: {
        fontSize: 14,
        color: '#1B4332',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6A9C89',
        borderRadius: 30,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    counterButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    counterValue: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 12, //
    },
    swipeContainer: {
        flex: 1, //
        backgroundColor: '#16423C',
        paddingVertical: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    swipeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    swipeDisabled: {
        backgroundColor: '#ccc',
    },
    favoriteButton: {
        backgroundColor: '#16423C',
        padding: 22,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});