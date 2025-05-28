import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    color?: string;
    emptyColor?: string;
    showHalfStars?: boolean;
}

export default function StarRating({
    rating,
    maxStars = 5,
    size = 16,
    color = '#FFD700', // Gold color
    emptyColor = '#E0E0E0', // Light gray
    showHalfStars = true,
}: StarRatingProps) {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = showHalfStars && rating % 1 >= 0.5;
        const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

        // Render full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FontAwesome
                    key={`full-${i}`}
                    name="star"
                    size={size}
                    color={color}
                    style={styles.star}
                />
            );
        }

        // Render half star if needed
        if (hasHalfStar) {
            stars.push(
                <View key="half" style={styles.starContainer}>
                    <FontAwesome
                        name="star"
                        size={size}
                        color={emptyColor}
                        style={[styles.star, styles.backgroundStar]}
                    />
                    <FontAwesome
                        name="star-half-o"
                        size={size}
                        color={color}
                        style={[styles.star, styles.halfStar]}
                    />
                </View>
            );
        }

        // Render empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <FontAwesome
                    key={`empty-${i}`}
                    name="star-o"
                    size={size}
                    color={emptyColor}
                    style={styles.star}
                />
            );
        }

        return stars;
    };

    return (
        <View style={styles.container}>
            {renderStars()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        marginRight: 1,
    },
    starContainer: {
        position: 'relative',
    },
    backgroundStar: {
        position: 'absolute',
    },
    halfStar: {
        position: 'relative',
    },
});
