import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { Toast } from 'react-native-toast-notifications';
import { Image } from 'expo-image';

interface Item {
  itemType: string;
  item: {
    _id: string;
    bundleName: string;
    price: number;
  } | null;
  price: number;
}

interface Order {
  _id: string;
  user: { name: string };
  items: Item[];
  totalAmount: number;
  orderDate: string;
}
const { width, height } = Dimensions.get('window');

const OrderScreen: React.FC = () => {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrders = async () => {
    try {
      const userI = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(userI || '{}');
      if (!isUser?._id) throw new Error("User ID not found");
      console.log("🚀 ~ fetchOrders ~ isUser._id:", isUser._id)

      const response = await axios.get(
        `${SERVER_URI}/api/v1/payment/getUserOrders/${isUser._id}`
      );
      const ordersData = Object.values(response.data.data) || [];
      // if (!Array.isArray(ordersData)) throw new Error("Orders data format is invalid");
  

      // Sort orders by orderDate
      // const sortedOrders = ordersData.sort(
      //   (a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      // );
      console.log("🚀 ~ fetchOrders ~ ordersData:", ordersData)
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Toast.show("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }
console.log(orders)
if(orders.length === 0){
  return(
    <View style={{ flex: 1, padding: 20, flexDirection:'row', justifyContent:'center', alignItems:'center' }}>
    <Text>No Orders Found</Text>
    </View>
  )
}
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardClick(item)}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' ,

              flexDirection: 'row',
              gap: 10,  
              paddingVertical: 20,

            }}>

              <View>
                <Image source={{ uri: item.items.item ? item.items.item.image : 'https://th.bing.com/th/id/OIP.MRUskKS2h_9Pi4oY75iHCQHaH_?rs=1&pid=ImgDetMain' }} style={{ width: 50, height: 50 }} />
              </View>
              <View style={{
                flexDirection: 'column',
                gap: 5,
              }}>


              <Text style={{
                color: item.items.item ? 'black' : 'red',
              }}>{item.items.item ? item.items.item.bundleName : '#This item is no longer available!!'}</Text>
              <Text>{new Date(item.orderDate).toLocaleDateString()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
       <Modal
      visible={isModalVisible}
      onRequestClose={closeModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedOrder && (
            <>
              <Text style={styles.userText}>User: {selectedOrder.user}</Text>
              <Text style={styles.userText}>Order Id: {selectedOrder.items.item._id}</Text>
              <Text style={styles.amountText}>Total Amount:  ₹{selectedOrder.totalAmount}</Text>
              <Text style={styles.dateText}>Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</Text>

              <View style={styles.itemContainer}>
                <Text style={styles.itemNameText}>
                  {selectedOrder.items.item ? selectedOrder.items.item.bundleName : 'This item is no longer available'}
                </Text>

              </View>

              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker background for more emphasis
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  userText: {
    fontSize: 14,
    color: '#333', // Darker color for text
    fontWeight: '200',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 20,
    color: '#27ae60', // Green color for the amount
    fontWeight: '700',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#777', // Lighter gray for the date text
    marginBottom: 20,
  },
  itemContainer: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Lighter border color
    marginBottom: 15,
  },
  itemNameText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    color: '#888',
  },
  closeButton: {
    fontSize: 18,
    color: '#2980b9', // Blue color for close button
    marginTop: 20,
    fontWeight: '600',
  },
});

export default OrderScreen;