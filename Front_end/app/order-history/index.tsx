import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductsStore } from '@/store/useProductsStore';
import { mockHistoryOrders } from '@/mocks/data/products';
import { OrderItem } from '@/types/order';
import Rating from '@/components/Rating';

export default function OrderHistoryScreen() {
  const user = useAuthStore((state) => state.user);

  const historyOrders = useProductsStore((s) => s.historyOrders);

  const userOrderHistory = historyOrders.filter((order) =>
    user?.historyOrderIds.includes(order.id)
  );

  const updateFeedback = useProductsStore((s) => s.updateOrderFeedback);

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenFeedbackModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setRating(order.customerFeedback?.customerRating || 0);
    setFeedback(order.customerFeedback?.feedback || '');
    setModalVisible(true);
  };

  const handleSaveFeedback = async () => {
    const customerFeedback = {
      customerRating: rating,
      feedback: feedback,
    };
    if (selectedOrder) {
      await updateFeedback(selectedOrder.id, customerFeedback);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.location}>{item.location?.restaurant}</Text>
        { item.date && <Text style={styles.date}>Ordered on: {item.date}</Text>}
        {item.customerFeedback?.customerRating !== undefined && (
          <Text style={styles.feedback}>Your rating: {item.customerFeedback.customerRating} ⭐️</Text>
        )}
        {item.customerFeedback?.feedback && <Text style={styles.feedback}>Feedback: {item.customerFeedback.feedback}</Text>}

        <TouchableOpacity style={styles.feedbackButton} onPress={() => handleOpenFeedbackModal(item)}>
          <Text style={styles.feedbackButtonText}>
            {item.customerFeedback ? 'Edit Feedback' : 'Leave Feedback'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      {userOrderHistory.length === 0 ? (
        <Text style={styles.emptyText}>No past orders yet.</Text>
      ) : (
        <FlatList
          data={userOrderHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Modal for feedback */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rate & Feedback</Text>

            <Rating rating={rating} setRating={setRating} />

            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Write your feedback..."
              style={styles.input}
              multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveFeedback}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  list: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#7C9B8D',
    marginVertical: 2,
  },
  location: {
    fontSize: 13,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  date: {
  fontSize: 12,
  color: '#999',
  marginTop: 4,
  },
  feedback: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    fontStyle: 'italic',
  },
  feedbackButton: {
    marginTop: 8,
    backgroundColor: '#7C9B8D',
    padding: 8,
    borderRadius: 8,
  },
  feedbackButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    minHeight: 60,
  },
  saveButton: {
    backgroundColor: '#335248',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#335248',
  },
});
