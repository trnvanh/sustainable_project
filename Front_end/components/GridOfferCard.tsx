import api from '@/api/axiosConfig';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useStoreStore } from '@/store/useStoreStore';
import { ProductResponse } from '@/types/productTypes';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import CartButton from './CartButton';
import StarRating from './StarRating';

// Get screen width to calculate card width
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2; // Subtract padding and divide by 2 for two columns

export interface GridOfferProps {
    id: string;
    name: string;
    price: string | number;
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
    storeId?: number;
}

export default function GridOfferCard(props: GridOfferProps) {
    const {
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
        storeId
    } = props;

    const { favorites } = useFavoritesStore();
    const { getStoreAddressById } = useStoreStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [storeAddress, setStoreAddress] = useState<string>('');
    const [displayAddress, setDisplayAddress] = useState<string>('');

    // Check if item is already in favorites
    const isFavorite = favorites.some(fav => fav.id.toString() === id.toString());

    // Fetch store address if storeId is provided and no location address exists
    useEffect(() => {
        const fetchStoreAddress = async () => {
            if (storeId && (!location?.address || location.address.trim() === '')) {
                try {
                    const address = await getStoreAddressById(storeId);
                    setStoreAddress(address);
                } catch (error) {
                    console.error('Failed to fetch store address:', error);
                    setStoreAddress('Address not available');
                }
            }
        };

        fetchStoreAddress();
    }, [storeId, location?.address]);

    // Determine which address to display
    useEffect(() => {
        if (location?.address && location.address.trim() !== '') {
            setDisplayAddress(location.address);
        } else if (storeAddress && storeAddress.trim() !== '') {
            setDisplayAddress(storeAddress);
        } else {
            setDisplayAddress(`${distance} km away`);
        }
    }, [location?.address, storeAddress, distance]);

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

    const handleFavoriteToggle = async (e: any) => {
        // Prevent the card press event
        e.stopPropagation();

        if (isProcessing) return;

        try {
            setIsProcessing(true);
            await api.post(`/products/${id}/favorite`);

            // Update favorites store based on current state
            if (isFavorite) {
                // Remove from favorites
                useFavoritesStore.setState((state) => ({
                    ...state,
                    favorites: state.favorites.filter(item => item.id.toString() !== id.toString())
                }));
            } else {
                // Need to check the structure of favorites in the store and adapt accordingly
                // This approach is safer than directly adding the product
                useFavoritesStore.getState().loadExploreData();
            }

            showMessage({
                message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
                type: 'success',
                icon: 'success',
            });
        } catch (error) {
            showMessage({
                message: 'Failed to update favorites',
                type: 'danger',
                icon: 'danger',
            });
        } finally {
            setIsProcessing(false);
        }
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

    const handlePress = () => {
        router.push({
            pathname: '/offer/[offerId]',
            params: { offerId: id, from: 'Store' },
    })};

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.imageContainer}>
                <Image source={getImageSource()} style={styles.cardImage} />
                <View style={styles.actionButtonContainer}>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleFavoriteToggle}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={18}
                            color={isFavorite ? "#E53935" : "#fff"}
                        />
                    </TouchableOpacity>
                    <CartButton
                        product={productForCart}
                        style={styles.cartButton}
                        size="small"
                    />
                </View>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardName} numberOfLines={1}>{name}</Text>
                <Text style={styles.cardPrice}>{price}</Text>

                <View style={styles.infoRow}>
                    <StarRating rating={rating} size={14} />
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={14} color="#777" />
                    <Text style={styles.infoText} numberOfLines={1}>{pickupTime}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={14} color="#777" />
                    <Text style={styles.infoText} numberOfLines={1}>{displayAddress}</Text>
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
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: '#F2F5F3',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
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
    actionButtonContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
    },
    favoriteButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartButton: {
        // Position is now handled by parent container
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
