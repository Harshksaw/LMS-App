import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { Toast } from "react-native-toast-notifications";
import RazorpayCheckout from "react-native-razorpay";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentPage = () => {
  

  const route = useRoute();
  const { itemId, itemData, itemPrice } = route.params;

  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const ItemData = JSON.parse(itemData);
  // console.log(
  //   "🚀 ~ file: index.tsx ~ line 136 ~ fetchBundleData ~ response",
  //   ItemData
  // );

  const [coupon, setCoupon] = useState("");

  const [totalPrice, setTotalPrice] = useState(
    ItemData.price 
  );
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(40);
  const [Id, setItemId] = useState("");

  const createOrder = async ({ user,  totalAmount }: any) => {
    console.log(purchaseDetails, "purchaseDetails");

    const items ={
      "itemType":"Bundle",
      "item": itemId,
      "price": totalPrice
    }
    try {
      const response = await axios.post("api/v1/payment/create-order", {
        user,
        items,
        totalAmount,
        details: purchaseDetails

      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    setItemId(itemId);
  }, []);

  const applyCoupon = async () => {
    try {
      const response = await axios.post("/api/apply-coupon", { coupon });
      if (response.data.success) {
        setDiscount(response.data.discount);
        setTotalPrice(totalPrice - response.data.discount);
      } else {
        alert("Invalid coupon");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert("Error applying coupon");
    }
  };

  // TODO razorpoay payment

  const handlePayment = async () => {
    const userI = await AsyncStorage.getItem("user");
    const isUser = JSON.parse(userI);



    if (!isUser.email || !isUser.phoneNumber || !isUser.name) {
      console.log(isUser.email, isUser.phoneNumber, isUser.name);
      Toast.show("Incomplete user data");
      throw new Error("Incomplete user data");
    }


    if (!ItemData || !ItemData.bundleName) {
      Toast.show("Item data not found");
      throw new Error("Item data not found");
    }

    if (!itemPrice) {
      console.log(itemPrice, "itemPrice");
      Toast.show("Item price not found");
      throw new Error("Item price not found");
    }



    var options = {
      description: `Buying ${ItemData.bundleName} for ${itemPrice}`,
      image: `${ItemData.image}`,
      currency: "INR",
      key: "rzp_test_frHyAhT1IdPBwO", // Your api key
      amount: `${itemPrice}*100`,
      name: `${ItemData.bundleName}`,
      prefill: {
        email: `${isUser.email}`,
        contact: `${isUser.phoneNumber}`,
        name: `${isUser.name}`,
      },
      theme: { color: "rgb(247, 70, 70)" },
    };

    await RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        Toast.show("Payment successful");
        setPurchaseDetails(data);
      })
      .catch((error) => {
        console.log(error);
        // handle failure
        Toast.show("Payment failed");
        // Alert.alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {"Purchase Details"}
        </Text>
       
        <Image
          source={{ uri: ItemData.image }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 12,
            marginVertical: 12,
          }}
        />
         <Text style={{ fontSize: 24, fontWeight: "bold" }}>
         {ItemData.bundleName}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
    {ItemData.shortDescription}
        </Text>
      </View>

      <View style={styles.item}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {"Course price"}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>₹{itemPrice}</Text>
      </View>
      {/* {
        couponApplied > 0 && (
          <View style={styles.item}>
          <Text style={{fontSize: 16,fontWeight: 'bold',}}>{"Coupon discount"}</Text>
          <Text style={{fontSize: 16,fontWeight: 'bold',}}>${couponApplied}</Text>
        </View>
        )
      } */}

      <Text style={styles.total}>Total Price: ₹{totalPrice}</Text>

      {/*
    
      <TextInput
        style={styles.input}
        placeholder="Enter coupon code"
        value={coupon}
        onChangeText={setCoupon}
      />
      <TouchableOpacity 
      style={{backgroundColor: "red", padding:12,borderRadius: 24, alignSelf: 'center',elevation: 4 , alignItems: 'center',marginHorizontal:'auto', width: '80%'}}   onPress={applyCoupon}>
        <Text style={{color: 'white', textAlign: 'center'}}>Apply coupon</Text>
      </TouchableOpacity>
      </View> */}

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 12,
          borderRadius: 24,
          alignSelf: "center",
          elevation: 4,
          alignItems: "center",
          marginHorizontal: "auto",
          width: "80%",
          position: "absolute",
          bottom: 24,
        }}
        onPress={handlePayment}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Confirm purchase
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 40,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    alignSelf: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 24,
    marginBottom: 10,
  },
  total: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 50,
  },
  discount: {
    fontSize: 16,
    color: "green",
    marginTop: 10,
  },
});

export default PaymentPage;
