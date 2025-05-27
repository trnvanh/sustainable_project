import SearchInput from '@/components/SearchInput';
import SearchResults from '@/components/SearchResults';
import SearchSuggestions from '@/components/SearchSuggestions';
import { useProductsStore } from '@/store/useProductsStore';
import { CategoryResponse } from '@/types/categoryTypes';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SearchScreen() {
    const {
        searchQuery,
        searchLoading,
        searchResults,
        searchProductsAction,
        advancedSearchAction,
        clearSearch,
        setSearchQuery,
        categories,
        loadExploreData
    } = useProductsStore();

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [sortBy, setSortBy] = useState<'price' | 'distance' | 'rating' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        // Load categories for the advanced search filter
        loadExploreData();
    }, []);

    const handleAdvancedSearch = () => {
        advancedSearchAction({
            searchTerm: searchQuery,
            ...(selectedCategoryId && { categoryId: selectedCategoryId }),
            ...(minPrice && { minPrice: parseFloat(minPrice) }),
            ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search</Text>
            </View>

            <SearchInput
                placeholder="Search products, stores..."
                style={styles.searchInput}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            {/* Show suggestions when there are no results yet or when explicitly showing suggestions */}
            {showSuggestions && searchResults.length === 0 && !searchLoading && (
                <SearchSuggestions
                    onSelectSuggestion={(suggestion) => {
                        setSearchQuery(suggestion);
                        searchProductsAction(suggestion);
                        setShowSuggestions(false);
                    }}
                />
            )}

            <View style={styles.advancedSearchToggle}>
                <TouchableOpacity
                    onPress={() => setShowAdvanced(!showAdvanced)}
                    style={styles.advancedToggleButton}
                >
                    <Text style={styles.advancedToggleText}>
                        {showAdvanced ? 'Hide Advanced Search' : 'Advanced Search'}
                    </Text>
                    <Ionicons
                        name={showAdvanced ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#4CAF50"
                    />
                </TouchableOpacity>
            </View>

            {showAdvanced && (
                <View style={styles.advancedSearchContainer}>
                    <Text style={styles.advancedSectionTitle}>Filter by:</Text>

                    {/* Price Range */}
                    <View style={styles.priceRangeContainer}>
                        <Text style={styles.filterLabel}>Price Range (€)</Text>
                        <View style={styles.priceInputRow}>
                            <TextInput
                                style={styles.priceInput}
                                placeholder="Min"
                                value={minPrice}
                                onChangeText={setMinPrice}
                                keyboardType="numeric"
                            />
                            <Text style={styles.priceSeparator}>to</Text>
                            <TextInput
                                style={styles.priceInput}
                                placeholder="Max"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Category Selection */}
                    <View style={styles.categoriesContainer}>
                        <Text style={styles.filterLabel}>Categories</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesScroll}
                        >
                            {categories.map((category: CategoryResponse) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategoryId === category.id && styles.selectedCategoryChip
                                    ]}
                                    onPress={() => setSelectedCategoryId(
                                        selectedCategoryId === category.id ? null : category.id
                                    )}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            selectedCategoryId === category.id && styles.selectedCategoryChipText
                                        ]}
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Sort Options */}
                    <View style={styles.sortContainer}>
                        <Text style={styles.filterLabel}>Sort By</Text>
                        <View style={styles.sortOptionsRow}>
                            <TouchableOpacity
                                style={[
                                    styles.sortOption,
                                    sortBy === 'price' && styles.selectedSortOption
                                ]}
                                onPress={() => {
                                    setSortBy('price');
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                            >
                                <Text style={styles.sortOptionText}>Price</Text>
                                {sortBy === 'price' && (
                                    <Ionicons
                                        name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                        size={16}
                                        color="#333"
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.sortOption,
                                    sortBy === 'distance' && styles.selectedSortOption
                                ]}
                                onPress={() => {
                                    setSortBy('distance');
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                            >
                                <Text style={styles.sortOptionText}>Distance</Text>
                                {sortBy === 'distance' && (
                                    <Ionicons
                                        name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                        size={16}
                                        color="#333"
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.sortOption,
                                    sortBy === 'rating' && styles.selectedSortOption
                                ]}
                                onPress={() => {
                                    setSortBy('rating');
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                            >
                                <Text style={styles.sortOptionText}>Rating</Text>
                                {sortBy === 'rating' && (
                                    <Ionicons
                                        name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                        size={16}
                                        color="#333"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Apply Filters Button */}
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleAdvancedSearch}
                    >
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            )}

            {searchLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            ) : (
                <SearchResults />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4DAD2',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    searchInput: {
        marginBottom: 16,
    },
    advancedSearchToggle: {
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    advancedToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    advancedToggleText: {
        color: '#4CAF50',
        marginRight: 4,
        fontWeight: '500',
    },
    advancedSearchContainer: {
        backgroundColor: '#E8E8E8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    advancedSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    priceRangeContainer: {
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#555',
    },
    priceInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1,
        fontSize: 14,
    },
    priceSeparator: {
        marginHorizontal: 12,
        color: '#555',
    },
    categoriesContainer: {
        marginBottom: 16,
    },
    categoriesScroll: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    categoryChip: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedCategoryChip: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    categoryChipText: {
        color: '#555',
        fontSize: 14,
    },
    selectedCategoryChipText: {
        color: 'white',
    },
    applyButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sortContainer: {
        marginBottom: 16,
    },
    sortOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sortOption: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 90,
        justifyContent: 'center',
    },
    selectedSortOption: {
        backgroundColor: '#E0F2E9',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    sortOptionText: {
        fontSize: 14,
        marginRight: 4,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        color: '#555',
        fontSize: 14,
    },
});
