import { useProductsStore } from '@/store/useProductsStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Mock data for popular searches - in a real app, this could come from the backend
const POPULAR_SEARCHES = [
    'veggie burger',
    'sushi',
    'pizza',
    'salad',
    'bakery',
    'coffee',
];

interface SearchSuggestionsProps {
    onSelectSuggestion: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    onSelectSuggestion
}) => {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const { searchQuery } = useProductsStore();

    // In a real app, we'd likely use AsyncStorage or a similar mechanism
    // to persist recent searches between app sessions
    useEffect(() => {
        // Mock implementation - in a real app, load from storage
        setRecentSearches([
            'restaurant',
            'pasta',
            'vegetarian',
            'thai food',
            'sustainable'
        ]);
    }, []);

    // Add current search to recent searches when user submits a query
    useEffect(() => {
        if (searchQuery && searchQuery.trim() !== '') {
            // Don't add duplicates
            if (!recentSearches.includes(searchQuery)) {
                setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
            }
        }
    }, [searchQuery]);

    const handleSelectSuggestion = (suggestion: string) => {
        onSelectSuggestion(suggestion);
    };

    const renderSuggestion = (text: string, isRecent: boolean = false) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelectSuggestion(text)}
        >
            <Ionicons
                name={isRecent ? "time-outline" : "trending-up-outline"}
                size={16}
                color="#777"
                style={styles.suggestionIcon}
            />
            <Text style={styles.suggestionText}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {recentSearches.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    {recentSearches.map(item => renderSuggestion(item, true))}
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Searches</Text>
                {POPULAR_SEARCHES.map(item => renderSuggestion(item))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    suggestionIcon: {
        marginRight: 12,
    },
    suggestionText: {
        fontSize: 14,
        color: '#444',
    },
});

export default SearchSuggestions;
