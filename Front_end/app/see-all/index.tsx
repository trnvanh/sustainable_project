import GridOfferCard from '@/components/GridOfferCard';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useProductsStore } from '@/store/useProductsStore';
import { FavoriteResponse } from '@/types/favoriteTypes';
import { OrderItem } from '@/types/order';
import { ProductResponse } from '@/types/productTypes';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Combined type for items that can appear in the grid
type GridItem = OrderItem | ProductResponse | FavoriteResponse;

export default function SeeAllScreen() {
    const {
        historyOrders,
        nearbyOffers,
        currentDeals,
        categoryProducts,
        categories,
        setSelectedOffer
    } = useProductsStore();

    const { favorites } = useFavoritesStore();

    // State for sorting and filtering
    const [sortBy, setSortBy] = useState<'price' | 'distance' | 'rating' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);

    // States for loading and refresh
    const [isRefreshing, setIsRefreshing] = useState(false);

    const params = useLocalSearchParams<{
        title: string;
        type: 'historyOrders' | 'nearbyOffers' | 'currentDeals' | 'categoryProducts' | 'favorites';
        categoryId?: string;
    }>();

    // Reset pagination when filters change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedCategoryFilter, sortBy, sortOrder]);

    const { title, type, categoryId } = params;

    // Get the appropriate data based on the type
    const getData = (): GridItem[] => {
        switch (type) {
            case 'historyOrders':
                return historyOrders as GridItem[];
            case 'nearbyOffers':
                return nearbyOffers as GridItem[];
            case 'currentDeals':
                return currentDeals as GridItem[];
            case 'categoryProducts':
                return categoryProducts as GridItem[];
            case 'favorites':
                return favorites as GridItem[];
            default:
                return [];
        }
    };

    // Sort data based on selected criteria
    const sortData = (items: GridItem[]): GridItem[] => {
        if (!sortBy) return items;

        return [...items].sort((a, b) => {
            let comparison = 0;

            // Handle different sort criteria
            switch (sortBy) {
                case 'price':
                    // Convert price to number if it's a string
                    const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : a.price;
                    const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : b.price;
                    comparison = priceA - priceB;
                    break;

                case 'rating':
                    comparison = a.rating - b.rating;
                    break;

                case 'distance':
                    const distanceA = 'distance' in a ?
                        (typeof a.distance === 'string' ? parseFloat(a.distance) : (a.distance || 0)) : 0;
                    const distanceB = 'distance' in b ?
                        (typeof b.distance === 'string' ? parseFloat(b.distance) : (b.distance || 0)) : 0;
                    comparison = distanceA - distanceB;
                    break;
            }

            // Apply sort order
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    };

    // Filter data based on search query and category
    const filterData = (items: GridItem[]): GridItem[] => {
        let filteredItems = items;

        // Filter by search query
        if (searchQuery) {
            filteredItems = filteredItems.filter(item => {
                // Name is common to all types
                const nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

                // Check description if available (not all types have it)
                const descriptionMatch = 'description' in item &&
                    item.description &&
                    item.description.toLowerCase().includes(searchQuery.toLowerCase());

                // For items that might have location info
                const locationMatch =
                    (('location' in item) && item.location && (
                        (item.location.restaurant && item.location.restaurant.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (item.location.address && item.location.address.toLowerCase().includes(searchQuery.toLowerCase()))
                    ));

                return nameMatch || descriptionMatch || locationMatch;
            });
        }

        // Filter by category if selected
        if (selectedCategoryFilter !== null) {
            filteredItems = filteredItems.filter(item => {
                // Check if item has a categories property and if it includes the selected category
                return 'categories' in item &&
                    Array.isArray(item.categories) &&
                    item.categories.some(cat => cat.id === selectedCategoryFilter);
            });
        }

        return filteredItems;
    };

    // Get, filter and sort the data for display
    const rawData = getData();
    const filteredData = filterData(rawData);
    const data = sortData(filteredData);

    // Pagination state
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const PAGE_SIZE = 10;

    // Get paginated data
    const getPaginatedData = () => {
        return data.slice(0, page * PAGE_SIZE);
    };

    // Handle pagination
    const handleLoadMore = () => {
        if (isLoadingMore || getPaginatedData().length >= data.length) return;

        setIsLoadingMore(true);
        setTimeout(() => {
            setPage(page + 1);
            setIsLoadingMore(false);
        }, 500);
    };

    // Get the data to display based on pagination
    const displayData = getPaginatedData();

    // Handle refresh
    const handleRefresh = () => {
        setIsRefreshing(true);
        // Refresh data based on type
        try {
            // For future implementation: add API refresh calls here
            // For now, we'll just simulate it with a delay
            setTimeout(() => {
                setIsRefreshing(false);
            }, 1000);
        } catch (error) {
            console.error("Error refreshing data:", error);
            setIsRefreshing(false);
        }
    };

    // Get the category name if it's category products
    const getCategoryName = (): string => {
        if (type === 'categoryProducts' && categoryId) {
            const category = categories.find(cat => cat.id === parseInt(categoryId));
            return category?.name || title || 'Products';
        }
        return title || 'Products';
    };

    const displayTitle = getCategoryName();

    // Handle item press
    const handleItemPress = (item: GridItem) => {
        setSelectedOffer(item as OrderItem);
        router.push(`/offer/${item.id}`);
    };

    if (!data || data.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{displayTitle}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.emptyContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>No items found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{displayTitle}</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                ) : null}
            </View>

            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptionsContainer}>
                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'price' && styles.selectedSortOption]}
                        onPress={() => {
                            setSortBy('price');
                            setSortOrder(sortBy === 'price' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                        }}
                    >
                        <Text style={styles.sortOptionText}>Price</Text>
                        {sortBy === 'price' && (
                            <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color="#4CAF50" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'rating' && styles.selectedSortOption]}
                        onPress={() => {
                            setSortBy('rating');
                            setSortOrder(sortBy === 'rating' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc');
                        }}
                    >
                        <Text style={styles.sortOptionText}>Rating</Text>
                        {sortBy === 'rating' && (
                            <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color="#4CAF50" />
                        )}
                    </TouchableOpacity>

                    {type !== 'favorites' && (
                        <TouchableOpacity
                            style={[styles.sortOption, sortBy === 'distance' && styles.selectedSortOption]}
                            onPress={() => {
                                setSortBy('distance');
                                setSortOrder(sortBy === 'distance' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                            }}
                        >
                            <Text style={styles.sortOptionText}>Distance</Text>
                            {sortBy === 'distance' && (
                                <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color="#4CAF50" />
                            )}
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            {/* Category filter section - only show if we have categories */}
            {categories && categories.length > 0 && (
                <View style={styles.categoryFilterContainer}>
                    <Text style={styles.sortLabel}>Filter by category:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptionsContainer}>
                        <TouchableOpacity
                            style={[styles.categoryOption, selectedCategoryFilter === null && styles.selectedCategoryOption]}
                            onPress={() => setSelectedCategoryFilter(null)}
                        >
                            <Text style={styles.categoryOptionText}>All</Text>
                        </TouchableOpacity>

                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryOption,
                                    selectedCategoryFilter === category.id && styles.selectedCategoryOption
                                ]}
                                onPress={() => setSelectedCategoryFilter(category.id)}
                            >
                                <Text style={styles.categoryOptionText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <FlatList<GridItem>
                data={displayData as GridItem[]}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={['#4CAF50']}
                    />
                }
                renderItem={({ item }) => (
                    <View style={styles.itemWrapper}>
                        <GridOfferCard
                            id={item.id.toString()}
                            name={item.name}
                            price={typeof item.price === 'number' ? `${item.price} €` : item.price}
                            image={item.image}
                            pickupTime={item.pickupTime || ""}
                            rating={item.rating}
                            distance={'distance' in item ?
                                (typeof item.distance === 'string' ? parseFloat(item.distance) : (item.distance || 0))
                                : 0}
                            portionsLeft={item.portionsLeft || 0}
                            location={'location' in item ? item.location : undefined}
                            description={'description' in item ? item.description : undefined}
                            storeId={'storeId' in item ? item.storeId : undefined}
                        />
                    </View>
                )}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoadingMore ? (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#4CAF50" />
                        <Text style={styles.loadingMoreText}>Loading more...</Text>
                    </View>
                ) : null}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4DAD2',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
        marginHorizontal: 12,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 14,
        color: '#333',
    },
    clearButton: {
        padding: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    listContent: {
        padding: 8,
        paddingBottom: 24,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    itemWrapper: {
        marginBottom: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    sortContainer: {
        padding: 12,
        backgroundColor: '#E7F0F1',
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 8,
    },
    sortLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
    },
    sortOptionsContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F5F3',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        minWidth: 80,
        justifyContent: 'center',
    },
    selectedSortOption: {
        backgroundColor: '#DBEEDD',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    sortOptionText: {
        fontSize: 14,
        color: '#333',
        marginRight: 4,
    },
    loadingMoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    loadingMoreText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
    categoryFilterContainer: {
        padding: 12,
        backgroundColor: '#E7F0F1',
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 8,
    },
    categoryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F5F3',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        minWidth: 80,
        justifyContent: 'center',
    },
    selectedCategoryOption: {
        backgroundColor: '#DBEEDD',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    categoryOptionText: {
        fontSize: 14,
        color: '#333',
    },
});
