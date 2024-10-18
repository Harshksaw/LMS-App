import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { Toast } from 'react-native-toast-notifications';

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
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text>{item ? item.bundleName : 'Item not found'}</Text>
          <Text>{new Date(item.orderDate).toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
        )}
      />
      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        animationType="slide"
      >
        <View style={{ flex: 1, padding: 20 }}>
          {selectedOrder && (
            <>
              <Text>User: {selectedOrder.user?.name}</Text>
              <Text>Total Amount: {selectedOrder.totalAmount}</Text>
              <Text>Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</Text>
              <FlatList
                data={selectedOrder.items}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                    <Text>{item.item ? item.item.bundleName : 'Item not found'}</Text>
                    <Text>{item.price}</Text>
                  </View>
                )}
              />
              <TouchableOpacity onPress={closeModal}>
                <Text style={{ color: 'blue', marginTop: 20 }}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default OrderScreen;
