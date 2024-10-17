import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";
import Button from "@/components/button/button";
import { SafeAreaView } from "react-native-safe-area-context";

interface Order {
  _id: string;
  bundleName: string;
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
  const fetchOrders = async () => {
    const userI = await AsyncStorage.getItem("user");
    const isUser = JSON.parse(userI);
    try {
      const response = await axios.get(
        `${SERVER_URI}/api/v1/payment/getUserOrders/${isUser._id}`
      );
      const ordersArray = Object.values(response.data.data); // Convert object to array
      const sortedOrders = ordersArray.sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      console.log("🚀 ~ fetchOrders ~ sortedOrders:", sortedOrders)
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      Toast.show("Error fetching orders");
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
  // console.log("🚀 ~ file: OrderScreen.tsx ~ line 77 ~ OrderScreen ~ orders", orders.map((orde)=> orde))
  orders.map((orde)=> console.log("🚀 ~ file: OrderScreen.tsx ~ line 77 ~ OrderScreen ~ orders", orde))
  return (
    <View style={{ flex: 1, padding: 20 }}>
    <FlatList
      data={orders}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleCardClick(item)}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 10,
              }}>{item?.bundleName}</Text>

              <Text>{item?.totalAmount}</Text>
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
            <Text>User: {selectedOrder.user.name}</Text>
            <Text>Total Amount: {selectedOrder.totalAmount}</Text>
            <Text>Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</Text>
            <FlatList
              data={selectedOrder.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                  <Text>{item.item ? item.item.name : 'Item not found'}</Text>
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
const OrderModal = ({ isVisible, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Order ID: {order._id}</Text>
        <Text>User: {order.user.name}</Text>
        <Text>Total Amount: ₹{order.totalAmount}</Text>
        <Text>
          Order Date: {new Date(order.orderDate).toLocaleDateString()}
        </Text>

        <View style={styles.itemsContainer}>
          <Text style={styles.subtitle}>Items:</Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "semibold",
              marginTop: 10,
            }}
          >
            {order.items.itemType}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "semibold",
              marginTop: 10,
            }}
          >
            ₹ {order.items.price}
          </Text>
          {/* <Text>{order.items.item}</Text> */}
        </View>
      </View>
      <Button title="Close" onPress={onClose} />
    </Modal>
  );
};

const OrderCard = ({ order }) => {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>Order ID: {order._id}</Text>
        <Text style={styles.text}>User: {order.user.name}</Text>
      </View>
      <View>
        <Text style={styles.text}>Total Amount: ₹ {order.totalAmount}</Text>
        <Text style={styles.text}>
          Order Date: {new Date(order.orderDate).toLocaleDateString()}
        </Text>
      </View>

      <Text
        style={{
          ...styles.text,
          fontSize: 18,
          fontWeight: "bold",
          marginVertical: 10,
        }}
      >
        Course: {order?.items?.item?.bundleName ?? "N/A"}
      </Text>

      <View style={styles.itemsContainer}>
        <Text style={styles.subtitle}>Items:</Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "semibold",
            marginTop: 10,
          }}
        >
          {order.items.itemType}:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "semibold",
            marginTop: 10,
          }}
        >
          ₹ {order.items.price}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent:'center',
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  card: {
    width: "90%",
    backgroundColor: "rgb(255, 255, 255)",
    color: "#000000",

    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
  },
  text: {
    color: "#000000",
  },
});
