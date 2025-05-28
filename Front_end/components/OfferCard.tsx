import { useTheme } from '@/context/ThemeContext';
import { ProductResponse } from '@/types/productTypes';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import CartButton from './CartButton';

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
    const { colors } = useTheme();

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

    const dynamicStyles = StyleSheet.create({
        card: {
            width: 200,
            flexShrink: 0,
            backgroundColor: colors.surface,
            borderRadius: 10,
            padding: 10,
            marginRight: 12,
            borderColor: colors.border,
            borderWidth: colors.text === '#000000' ? 0 : 1,
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
            color: colors.text,
        },
        cardPrice: {
            fontSize: 14,
            color: colors.primary,
            marginBottom: 6,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        infoText: {
            fontSize: 12,
            color: colors.textSecondary,
            marginLeft: 4,
        },
        lowPortions: {
            color: colors.error,
            fontWeight: '600',
        },
    });

    return (
        <Pressable style={dynamicStyles.card} onPress={() => router.push(`/offer/${id}`)}>
            <View style={dynamicStyles.imageContainer}>
                <Image source={getImageSource()} style={dynamicStyles.cardImage} />
                <CartButton
                    product={productForCart}
                    style={dynamicStyles.cartButton}
                    size="small"
                />
            </View>
            <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.cardName}>{name}</Text>
                <Text style={dynamicStyles.cardPrice}>{price}</Text>

                <View style={dynamicStyles.infoRow}>
                    <FontAwesome name="star" size={20} color="gold" />
                    <Text style={dynamicStyles.infoText}>{rating}</Text>
                </View>

                <View style={dynamicStyles.infoRow}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={dynamicStyles.infoText}>{pickupTime}</Text>
                </View>

                <View style={dynamicStyles.infoRow}>
                    <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={dynamicStyles.infoText}>{distance + " km"}</Text>
                </View>

                <View style={dynamicStyles.infoRow}>
                    <MaterialCommunityIcons
                        name={portionsLeft <= 1 ? 'fire' : 'food'}
                        size={14}
                        color={portionsLeft <= 1 ? colors.error : colors.textSecondary}
                    />
                    <Text style={[dynamicStyles.infoText, portionsLeft <= 2 && dynamicStyles.lowPortions]}>
                        {portionsLeft} left
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
