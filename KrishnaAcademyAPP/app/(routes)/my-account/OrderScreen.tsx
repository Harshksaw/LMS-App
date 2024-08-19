import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-notifications';
import Button from '@/components/button/button';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Order {
  _id: string;
  user: { name: string };
  items: { itemType: string; item: { name: string }; price: number }[];
  totalAmount: number;
  orderDate: string;
}

const OrderScreen: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
  
  useEffect(() => {
    const fetchOrders = async () => {
        const userI = await AsyncStorage.getItem("user");
        const isUser = JSON.parse(userI);
      try {
        const response = await axios.get(`${SERVER_URI}/api/v1/payment/getUserOrders/${isUser._id}`);
        setOrders(response.data);

      } catch (error) {
        Toast.show("Error fetching orders");
        console.error('Error fetching orders:', error);
      } 
    };

    fetchOrders();
  }, []);


  const handleCardClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <SafeAreaView style={{
        flex: 1,
        paddingTop:20,
        // justifyContent: 'center',
        // alignItems: 'center',
      }}>

        <Text
        style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,

        }}
        >
            Orders
        </Text>
      {orders.map((order) => (
        <TouchableOpacity key={order._id} onPress={() => handleCardClick(order)}>
          <OrderCard order={order} />
        </TouchableOpacity>
      ))}
      <OrderModal isVisible={isModalVisible} onClose={closeModal} order={selectedOrder} />
    </SafeAreaView>
  );
};

export default OrderScreen;
const OrderModal = ({ isVisible, onClose, order }) => {
    if (!order) return null;
  
    return (
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Order ID: {order._id}</Text>
          <Text>User: {order.user.name}</Text>
          <Text>Total Amount: ${order.totalAmount}</Text>
          <Text>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Text>
          <View style={styles.itemsContainer}>
            <Text style={styles.subtitle}>Items:</Text>
            {order.items.map((item, index) => (
              <Text key={index}>
                {item.itemType}: {item.item.name} - ${item.price}
              </Text>
            ))}
          </View>
          <Button title="Close" onPress={onClose} />
        </View>
      </Modal>
    );
  };
  

  const OrderCard = ({ order }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Order ID: {order._id}</Text>
        <Text style={styles.text}>User: {order.user.name}</Text>
        <Text style={styles.text}>Total Amount: ${order.totalAmount}</Text>
        <Text style={styles.text}>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Text>
        <View style={styles.itemsContainer}>
          <Text style={styles.subtitle}>Items:</Text>
          {order.items.map((item, index) => (
            <Text key={index} style={styles.text}>
              {item.itemType}: {item.item.name} - ${item.price}
            </Text>
          ))}
        </View>
      </View>
    );
  };
  const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    
    subtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
    },
    itemsContainer: {
      marginTop: 10,
    },
    card: {
        width: 360,
        backgroundColor: '#1a1a1a',
        color: '#e0e0e0',
        height: 300,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        borderRadius: 10,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#e0e0e0',
      },
      text: {
        color: '#a0a0a0',
      },
     
  });
  