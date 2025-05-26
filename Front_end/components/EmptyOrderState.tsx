import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
    text: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>📦</Text>
            </View>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    iconContainer: {
        marginBottom: 20,
    },
    icon: {
        fontSize: 60,
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
});