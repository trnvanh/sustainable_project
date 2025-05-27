import { useProductsStore } from '@/store/useProductsStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchInputProps {
    placeholder?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    style?: any;
}

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = "Search products, stores...",
    onFocus,
    onBlur,
    style,
}) => {
    const {
        searchQuery,
        searchProductsAction,
        clearSearch,
        setSearchQuery,
        isSearchMode,
    } = useProductsStore();

    const [localQuery, setLocalQuery] = useState(searchQuery);

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery.trim()) {
                searchProductsAction(localQuery);
            } else if (localQuery === '') {
                clearSearch();
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [localQuery]);

    // Sync with store when search is cleared externally
    useEffect(() => {
        if (!isSearchMode && localQuery) {
            setLocalQuery('');
        }
    }, [isSearchMode]);

    const handleTextChange = (text: string) => {
        setLocalQuery(text);
        setSearchQuery(text);
    };

    const handleClearPress = () => {
        setLocalQuery('');
        clearSearch();
    };

    return (
        <View style={[styles.container, style]}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
                placeholder={placeholder}
                style={styles.input}
                value={localQuery}
                onChangeText={handleTextChange}
                onFocus={onFocus}
                onBlur={onBlur}
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
            {localQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearPress} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        marginLeft: 8,
    },
});

export default SearchInput;
