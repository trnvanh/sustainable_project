import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RescueBarProps = {
  portionsLeft: number;
};

export default function RescueBar({ portionsLeft }: RescueBarProps) {
  const [count, setCount] = useState(0);
  const maxCount = portionsLeft;
  const isDisabled = portionsLeft === 0;

  const increment = () => {
    if (count < maxCount) setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) setCount(count - 1);
  };

  const handleSwipe = () => {
    // connect to Google auth logic
    console.log(`User swiped to rescue ${count} item(s)`);
  };

  return (
    <View style={styles.container}>
      {/* Portion + Counter */}
      <View style={styles.counterRow}>
        <View>
          <Text style={styles.leftText}>{maxCount} left</Text>
          <Text style={styles.subText}>I’ll rescue</Text>
        </View>

        <View style={styles.counter}>
          <TouchableOpacity onPress={decrement} style={styles.counterButton}>
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{count}</Text>
          <TouchableOpacity onPress={increment} style={styles.counterButton}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Swipe to Rescue */}
      <TouchableOpacity style={[styles.swipeContainer, isDisabled && styles.swipeDisabled]} onPress={handleSwipe} disabled={isDisabled}>
        <Text style={styles.swipeText}>
          {isDisabled ? 'Unavailable' : 'Swipe To Rescue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 30,
    },
    counterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    leftText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1B4332',
    },
    subText: {
      fontSize: 14,
      color: '#1B4332',
    },
    counter: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#6A9C89',
      borderRadius: 30,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    counterButton: {
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    counterValue: {
      fontSize: 16,
      color: 'white',
      fontWeight: 'bold',
      marginHorizontal: 8,
    },
    swipeContainer: {
      backgroundColor: '#16423C',
      paddingVertical: 24,
      borderRadius: 8,
      marginTop: 16,
      alignItems: 'center',
    },
    swipeText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    swipeDisabled: {
      backgroundColor: '#ccc',
    },
  });
  