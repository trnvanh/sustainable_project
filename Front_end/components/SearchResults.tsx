import { useProductsStore } from '@/store/useProductsStore';
import { ProductResponse } from '@/types/productTypes';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import OfferCard from './OfferCard';

interface SearchResultsProps {
    onProductPress?: (product: ProductResponse) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ onProductPress }) => {
    const {
        searchResults,
        searchLoading,
        searchQuery,
        isSearchMode,
        clearSearch,
        setSelectedOffer,
    } = useProductsStore();

    const handleProductPress = (product: ProductResponse) => {
        if (onProductPress) {
            onProductPress(product);
        } else {
            // Convert ProductResponse to OrderItem for compatibility
            const orderItem = {
                id: product.id.toString(),
                name: product.name,
                price: `${product.price} €`,
                image: product.image,
                pickupTime: product.pickupTime || '',
                rating: product.rating || 0,
                distance: product.distance?.toString() || '0',
                portionsLeft: product.portionsLeft || 0,
                location: product.location || { restaurant: '', address: '' },
                description: product.description || '',
            };

            setSelectedOffer(orderItem);
            router.push(`/offer/${product.id}`);
        }
    };

    if (!isSearchMode) {
        return null;
    }

    if (searchLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Searching...</Text>
            </View>
        );
    }

    if (searchResults.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>
                    No products found for "{searchQuery}"
                </Text>
                <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                    <Text style={styles.clearButtonText}>Clear Search</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.resultsTitle}>
                        Search Results ({searchResults.length})
                    </Text>
                    <Text style={styles.queryText} numberOfLines={1}>
                        for "{searchQuery}"
                    </Text>
                </View>
                <TouchableOpacity onPress={clearSearch} style={styles.clearButtonRow}>
                    <Ionicons name="close-circle" size={20} color="#4CAF50" />
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={searchResults}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleProductPress(item)}>
                        <OfferCard
                            id={item.id.toString()}
                            name={item.name}
                            price={`${item.price} €`}
                            image={item.image}
                            pickupTime={item.pickupTime || ''}
                            rating={item.rating || 0}
                            distance={item.distance || 0}
                            portionsLeft={item.portionsLeft || 0}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    titleContainer: {
        flex: 1,
        marginRight: 16,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#16423C',
    },
    queryText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    clearButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
        marginLeft: 4,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        color: '#555',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        margin: 16,
        borderRadius: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    clearButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
});

export default SearchResults;
