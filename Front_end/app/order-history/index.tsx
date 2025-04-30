import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderHistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {/* Gọi lại danh sách đơn cũ của user ở đây */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F0F1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#335248',
  },
});
