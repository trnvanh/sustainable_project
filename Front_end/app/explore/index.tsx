import api from "@/api/axiosConfig";
import CategoryCard from '@/components/CategoryCard';
import OfferCard from '@/components/OfferCard';
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useProductsStore } from "@/store/useProductsStore";
// import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTheme } from '@/context/ThemeContext';
import { CategoryResponse } from '@/types/categoryTypes';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from "react-native-flash-message";

export default function Explore() {
    const {
        historyOrders,
        nearbyOffers,
        currentDeals,
        categories,
        categoryProducts,
        categoryLoading,
        loadExploreData,
        loadProductsByCategory,
        loading,
        setSelectedOffer,
        setSelectedCategory,
        isSearchMode,
    } = useProductsStore();

    const { colors } = useTheme();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    useEffect(() => {
        loadExploreData();
    }, []);

    const handleCategoryPress = (category: CategoryResponse) => {
        setSelectedCategory(category);
        setSelectedCategoryId(category.id);
        loadProductsByCategory(category.id);
    };

    const handleAddFavorite = async (id: string) => {
        try {
            useFavoritesStore.setState({ loading: true });
            await api.post(`/products/${id}/favorite`);

            useFavoritesStore.setState((state) => ({
                favorites: state.favorites.filter((item) => item.id.toString() !== id),
            }));
            showMessage({
                message: 'Successfully added',
                type: 'success',
                icon: 'success',
            });
        } catch (error: any) {
            showMessage({
                message: 'Failed to add',
                type: 'danger',
                icon: 'danger',
            });
        }
        finally {
            useFavoritesStore.setState({ loading: false });
        }
    };

    const renderOfferRow = (title: string, data: typeof historyOrders, type: 'historyOrders' | 'nearbyOffers' | 'currentDeals') => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={dynamicStyles.sectionTitle}>{title}</Text>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/see-all',
                        params: { title, type }
                    })}
                >
                    <Text style={dynamicStyles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    // Use TouchableOpacity to navigate to the offer details page
                    <TouchableOpacity onPress={() => {
                        setSelectedOffer(item);
                        // router.push({ pathname: '/offer', params: { offerId: item.id } });
                        router.push(`/offer/${item.id}`);
                        // console.log(item);
                    }}>
                        <OfferCard
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            image={item.image}
                            pickupTime={item.pickupTime || ""}
                            rating={item.rating}
                            distance={item.distance || 0}
                            portionsLeft={item.portionsLeft}
                            location={item.location}
                            description={item.description}
                            storeId={item.storeId}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 8, color: colors.textSecondary }}>Loading offer...</Text>
            </View>
        );
    }

    const dynamicStyles = {
        container: {
            ...styles.container,
            backgroundColor: colors.background,
        },
        searchButton: {
            ...styles.searchButton,
            backgroundColor: colors.surface,
        },
        searchButtonText: {
            ...styles.searchButtonText,
            color: colors.textMuted,
        },
        locationText: {
            ...styles.locationText,
            color: colors.text,
        },
        sectionTitle: {
            ...styles.sectionTitle,
            color: colors.text,
        },
        seeAll: {
            ...styles.seeAll,
            color: colors.primary,
        },
    };

    return (
        <ScrollView style={dynamicStyles.container}>
            {/* Search bar */}
            <TouchableOpacity
                style={styles.searchContainer}
                onPress={() => router.push('/search')}
            >
                <View style={dynamicStyles.searchButton}>
                    <Ionicons name="search" size={20} color={colors.textMuted} style={{ marginRight: 8 }} />
                    <Text style={dynamicStyles.searchButtonText}>Search products, stores...</Text>
                </View>
            </TouchableOpacity>

            {/* Current Location */}
            <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={20} color={colors.success} />
                <Text style={dynamicStyles.locationText}>Tampere 33100</Text>
            </View>

            {/* Categories */}
            <View style={styles.categorySection}>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <CategoryCard
                            name={item.name}
                            image={item.image}
                            onPress={() => handleCategoryPress(item)}
                        />
                    )}
                />
            </View>

            {/* Category Products */}
            {selectedCategoryId && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {categories.find((cat: CategoryResponse) => cat.id === selectedCategoryId)?.name || 'Category Products'}
                        </Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: '/see-all',
                                    params: {
                                        title: categories.find((cat: CategoryResponse) => cat.id === selectedCategoryId)?.name || 'Category Products',
                                        type: 'categoryProducts',
                                        categoryId: selectedCategoryId?.toString()
                                    }
                                })}
                                style={{ marginRight: 16 }}
                            >
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedCategoryId(null)}>
                                <Text style={styles.seeAll}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {categoryLoading ? (
                        <View style={styles.categoryLoadingContainer}>
                            <ActivityIndicator size="small" color="#4CAF50" />
                            <Text style={{ marginTop: 8, color: '#555' }}>Loading products...</Text>
                        </View>
                    ) : categoryProducts.length > 0 ? (<FlatList
                        data={categoryProducts}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                setSelectedOffer(item as any);
                                router.push(`/offer/${item.id}`);
                            }}>
                                <OfferCard
                                    id={item.id.toString()}
                                    name={item.name}
                                    price={typeof item.price === 'number' ? `${item.price} €` : item.price}
                                    image={item.image}
                                    pickupTime={item.pickupTime || ""}
                                    rating={item.rating}
                                    distance={typeof item.distance === 'string' ? parseFloat(item.distance) : (item.distance || 0)}
                                    portionsLeft={item.portionsLeft || 0}
                                    location={item.location}
                                    description={item.description || ""}
                                    storeId={item.storeId}
                                />
                            </TouchableOpacity>
                        )}
                    />
                    ) : (
                        <View style={styles.noProductsContainer}>
                            <Text style={styles.noProductsText}>No products found in this category</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Offer sections from store */}
            {renderOfferRow('Rescue Again', historyOrders, 'historyOrders')}
            {renderOfferRow('Nearby Offers', nearbyOffers, 'nearbyOffers')}
            {renderOfferRow('Deals 1€', currentDeals, 'currentDeals')}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 120,
        backgroundColor: '#C4DAD2',
    },
    container: {
        padding: 16,
        paddingTop: 50,
        backgroundColor: '#C4DAD2',
    },
    searchContainer: {
        marginBottom: 12,
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
    },
    searchButtonText: {
        color: '#999',
        fontSize: 14,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    locationText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#444',
    },
    categorySection: {
        marginBottom: 24,
        marginTop: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    seeAll: {
        fontSize: 14,
        color: '#4CAF50',
    },
    categoryLoadingContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noProductsContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
        borderRadius: 8,
    },
    noProductsText: {
        fontSize: 14,
        color: '#555',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
