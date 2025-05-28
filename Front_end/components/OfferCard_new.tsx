import { ProductResponse } from '@/types/productTypes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import CartButton from './CartButton';
import StarRating from './StarRating';

export interface Offer {
    id: string;
    name: string;
    price: string;
    image: string | number;
    pickupTime: string;
    rating: number;
    distance: string | number;
    portionsLeft: number;
    location?: {
        restaurant: string;
        address: string;
    };
    description?: string;
}

export default function OfferCard({
    id,
    name,
    price,
    image,
    pickupTime,
    rating,
    distance,
    portionsLeft,
    location,
    description,
}: Offer) {
    const router = useRouter();

    // Convert Offer to ProductResponse for CartButton
    const productForCart: ProductResponse = {
        id: parseInt(id),
        name,
        price: typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price,
        pickupTime,
        distance: typeof distance === 'string' ? parseFloat(distance.replace(/[^0-9.]/g, '')) : distance,
        portionsLeft,
        rating,
        image: typeof image === 'string' ? image : '',
        location: location || { restaurant: '', address: '' },
        description: description || ''
    };

    // Normalize image value into ImageSourcePropType
    const getImageSource = (): ImageSourcePropType => {
        if (typeof image === 'string') {
            return { uri: image };
        } else if (typeof image === 'number') {
            return image;
        } else if (typeof image === 'object' && 'uri' in image) {
            return image;
        } else {
            return { uri: 'https://via.placeholder.com/160x100.png?text=Food' };
        }
    };

    return (
        <Pressable style={styles.card} onPress={() => router.push(`/offer/${id}`)}>
            <View style={styles.imageContainer}>
                <Image source={getImageSource()} style={styles.cardImage} />
                <CartButton
                    product={productForCart}
                    style={styles.cartButton}
                    size="small"
                />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardName}>{name}</Text>
                <Text style={styles.cardPrice}>{price}</Text>

                <View style={styles.infoRow}>
                    <StarRating rating={rating} size={16} />
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={14} color="#777" />
                    <Text style={styles.infoText}>{pickupTime}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={14} color="#777" />
                    <Text style={styles.infoText}>{distance + " km"}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                        name={portionsLeft <= 1 ? 'fire' : 'food'}
                        size={14}
                        color={portionsLeft <= 1 ? '#D32F2F' : '#777'}
                    />
                    <Text style={[styles.infoText, portionsLeft <= 2 && styles.lowPortions]}>
                        {portionsLeft} left
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 200,
        flexShrink: 0,
        backgroundColor: '#F2F5F3',
        borderRadius: 10,
        padding: 10,
        marginRight: 12,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    cardImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
    },
    cartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    cardContent: {
        flex: 1,
    },
    cardName: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardPrice: {
        fontSize: 14,
        color: '#4CAF50',
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    lowPortions: {
        color: '#D32F2F',
        fontWeight: '600',
    },
});
