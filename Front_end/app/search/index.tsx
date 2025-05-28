import SearchInput from '@/components/SearchInput';
import SearchResults from '@/components/SearchResults';
import SearchSuggestions from '@/components/SearchSuggestions';
import { useTheme } from '@/context/ThemeContext';
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
    const { colors } = useTheme();
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

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
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
            color: colors.text,
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
            color: colors.primary,
            marginRight: 4,
            fontWeight: '500',
        },
        advancedSearchContainer: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderColor: colors.border,
            borderWidth: colors.text === '#000000' ? 0 : 1,
        },
        advancedSectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 12,
            color: colors.text,
        },
        priceRangeContainer: {
            marginBottom: 16,
        },
        filterLabel: {
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 8,
            color: colors.textSecondary,
        },
        priceInputRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        priceInput: {
            backgroundColor: colors.surface,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flex: 1,
            fontSize: 14,
            color: colors.text,
            borderColor: colors.border,
            borderWidth: 1,
        },
        priceSeparator: {
            marginHorizontal: 12,
            color: colors.textSecondary,
        },
        categoriesContainer: {
            marginBottom: 16,
        },
        categoriesScroll: {
            flexDirection: 'row',
            marginVertical: 8,
        },
        categoryChip: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        selectedCategoryChip: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        categoryChipText: {
            color: colors.textSecondary,
            fontSize: 14,
        },
        selectedCategoryChipText: {
            color: colors.surface,
        },
        applyButton: {
            backgroundColor: colors.primary,
            borderRadius: 25,
            paddingVertical: 12,
            alignItems: 'center',
            marginTop: 8,
        },
        applyButtonText: {
            color: colors.surface,
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
            backgroundColor: colors.surface,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: 90,
            justifyContent: 'center',
            borderColor: colors.border,
            borderWidth: 1,
        },
        selectedSortOption: {
            backgroundColor: colors.accent,
            borderColor: colors.primary,
            borderWidth: 1,
        },
        sortOptionText: {
            fontSize: 14,
            marginRight: 4,
            color: colors.text,
        },
        loadingContainer: {
            paddingVertical: 40,
            alignItems: 'center',
        },
        loadingText: {
            marginTop: 8,
            color: colors.textSecondary,
            fontSize: 14,
        },
    });

    return (
        <ScrollView style={dynamicStyles.container}>
            <View style={dynamicStyles.header}>
                <TouchableOpacity onPress={() => router.back()} style={dynamicStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle}>Search</Text>
            </View>

            <SearchInput
                placeholder="Search products, stores..."
                style={dynamicStyles.searchInput}
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

            <View style={dynamicStyles.advancedSearchToggle}>
                <TouchableOpacity
                    onPress={() => setShowAdvanced(!showAdvanced)}
                    style={dynamicStyles.advancedToggleButton}
                >
                    <Text style={dynamicStyles.advancedToggleText}>
                        {showAdvanced ? 'Hide Advanced Search' : 'Advanced Search'}
                    </Text>
                    <Ionicons
                        name={showAdvanced ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>

            {showAdvanced && (
                <View style={dynamicStyles.advancedSearchContainer}>
                    <Text style={dynamicStyles.advancedSectionTitle}>Filter by:</Text>

                    {/* Price Range */}
                    <View style={dynamicStyles.priceRangeContainer}>
                        <Text style={dynamicStyles.filterLabel}>Price Range (€)</Text>
                        <View style={dynamicStyles.priceInputRow}>
                            <TextInput
                                style={dynamicStyles.priceInput}
                                placeholder="Min"
                                placeholderTextColor={colors.textSecondary}
                                value={minPrice}
                                onChangeText={setMinPrice}
                                keyboardType="numeric"
                            />
                            <Text style={dynamicStyles.priceSeparator}>to</Text>
                            <TextInput
                                style={dynamicStyles.priceInput}
                                placeholder="Max"
                                placeholderTextColor={colors.textSecondary}
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Category Selection */}
                    <View style={dynamicStyles.categoriesContainer}>
                        <Text style={dynamicStyles.filterLabel}>Categories</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={dynamicStyles.categoriesScroll}
                        >
                            {categories.map((category: CategoryResponse) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        dynamicStyles.categoryChip,
                                        selectedCategoryId === category.id && dynamicStyles.selectedCategoryChip
                                    ]}
                                    onPress={() => setSelectedCategoryId(
                                        selectedCategoryId === category.id ? null : category.id
                                    )}
                                >
                                    <Text
                                        style={[
                                            dynamicStyles.categoryChipText,
                                            selectedCategoryId === category.id && dynamicStyles.selectedCategoryChipText
                                        ]}
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Sort Options */}
                    <View style={dynamicStyles.sortContainer}>
                        <Text style={dynamicStyles.filterLabel}>Sort By</Text>
                        <View style={dynamicStyles.sortOptionsRow}>
                            <TouchableOpacity
                                style={[
                                    dynamicStyles.sortOption,
                                    sortBy === 'price' && dynamicStyles.selectedSortOption
                                ]}
                                onPress={() => {
                                    setSortBy('price');
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                            >
                                <Text style={dynamicStyles.sortOptionText}>Price</Text>
                                {sortBy === 'price' && (
                                    <Ionicons
                                        name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                        size={16}
                                        color={colors.text}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    dynamicStyles.sortOption,
                                    sortBy === 'distance' && dynamicStyles.selectedSortOption
                                ]}
                                onPress={() => {
                                    setSortBy('distance');
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                            >
                                <Text style={dynamicStyles.sortOptionText}>Distance</Text>
                                {sortBy === 'distance' && (
                                    <Ionicons
                                        name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                        size={16}
                                        color={colors.text}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    dynamicStyles.sortOption,
                                    sortBy === 'rating' && dynamicStyles.selectedSortOption
                                ]}
                                onPress={() => {
                                    setSortBy('rating');
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                            >
                                <Text style={dynamicStyles.sortOptionText}>Rating</Text>
                                {sortBy === 'rating' && (
                                    <Ionicons
                                        name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                        size={16}
                                        color={colors.text}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Apply Filters Button */}
                    <TouchableOpacity
                        style={dynamicStyles.applyButton}
                        onPress={handleAdvancedSearch}
                    >
                        <Text style={dynamicStyles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            )}

            {searchLoading ? (
                <View style={dynamicStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={dynamicStyles.loadingText}>Searching...</Text>
                </View>
            ) : (
                <SearchResults />
            )}
        </ScrollView>
    );
}
