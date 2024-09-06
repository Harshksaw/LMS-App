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
import { SERVER_URI } from "@/utils/uri";
import { router } from "expo-router";

const PaymentPage = () => {
  const route = useRoute();
  const { itemId, itemData, itemPrice } = route.params;
  const [isUser, setIsUser] = useState<any>({});

  // const [purchaseDetails, setPurchaseDetails] = useState<any>({});
  const ItemData = JSON.parse(itemData);

  const [coupon, setCoupon] = useState("");

  const [totalPrice, setTotalPrice] = useState(ItemData.price);
  const [couponApplied, setCouponApplied] = useState(0);
  const [Id, setItemId] = useState("");

  const createOrder = async ({ user, totalAmount, purchaseDetails }: any) => {
    console.log(typeof purchaseDetails.razorpay_payment_id, "purchaseDetails");

    const items = {
      itemType: "Bundle",
      item: itemId,
      price: totalPrice,
    };
    try {
      const response = await axios.post(
        `${SERVER_URI}/api/v1/payment/create-order`,
        {
          user: user?._id,
          items,
          totalAmount,
          details: purchaseDetails.razorpay_payment_id,
        }
      );
      Toast.show("Order created successfully", {
        type: "success",
        duration: 5000,
        placement: "top",
      });
      return response.data;
    } catch (error) {
      console.error(error.message);
      // throw error;
    }
  };

  const assignCourse = async ({ userId, courseId }: any) => {
    try {
      const response = await axios.post(
        `${SERVER_URI}/api/v1/bundle/assignCourseBundle`,
        {
          userId,
          courseId,
        }
      );
      Toast.show("Order added to users successfully", {
        type: "success",
        duration: 3000,
        placement: "top",
      });
      return response.data;
    } catch (error) {
      // throw error;
    }
  };

  useEffect(() => {
    setItemId(itemId);

    const getUser = async () => {
      const userI = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(userI);
      setIsUser(isUser);
    };
    getUser();
  }, []);

  const applyCoupon = async () => {
    try {
      const response = await axios.post(
        `${SERVER_URI}/api/v1/bundle/apply-coupon`,
        { coupon }
      );
      if (response.data.success) {
        const amt = (totalPrice * response.data.discountPercentage) / 100;
        setCouponApplied(amt);
        setTotalPrice(totalPrice - amt);
        Toast.show("Coupon Applied", { type: "success" });
      } else {
        Toast.show("Invalid coupon", { type: "danger" });
      }
    } catch (error) {
      Toast.show("Error applying coupon", { type: "danger" });
    }
  };

  // TODO razorpoay payment

  const handlePayment = async () => {
    if (!isUser.email || !isUser.phoneNumber || !isUser.name) {
      Toast.show("Incomplete user data");
    }

    if (!ItemData || !ItemData.bundleName) {
      Toast.show("Item data not found");
    }

    if (!itemPrice) {
      console.log(itemPrice, "itemPrice");
      Toast.show("Item price not found");
    }

    var options = {
      description: `Buying ${ItemData.bundleName} for ${ItemData.price}`,
      image: `${ItemData.image}`,
      currency: "INR",
      key: "rzp_test_frHyAhT1IdPBwO", // Your api key
      amount: `${ItemData.price * 100}`,
      name: `${ItemData.bundleName}`,
      prefill: {
        email: `${isUser.email}`,
        contact: `${isUser.phoneNumber}`,
        name: `${isUser.name}`,
      },
      theme: { color: "rgb(247, 70, 70)" },
    };

    const data = await RazorpayCheckout.open(options);

    if (data && data.razorpay_payment_id) {
      const orderData = await createOrder({
        user: isUser,
        totalAmount: ItemData.price,
        purchaseDetails: data,
      });

      if (orderData) {
        const assignbundle = await assignCourse({
          userId: isUser._id,
          courseId: itemId,
        });
        if (assignbundle) {
          router.push({
            pathname: "/(routes)/enrolled-courses",
          });
          Toast.show("you have purchased the bundle", {
            type: "success",
            duration: 1000,
            placement: "top",
          });
        }
      }

      Toast.show("Payment successful", {
        type: "success",
        duration: 1000,
        placement: "bottom",
      });
    } else {
      Toast.show("Payment failed", {
        type: "error",
        duration: 1000,
        placement: "top",
      });
      throw new Error("Payment data is null");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
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
      {couponApplied > 0 && (
        <View style={styles.item}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "green" }}>
            {"Coupon discount"}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "green" }}>
            ₹{couponApplied}
          </Text>
        </View>
      )}

      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter coupon code"
          value={coupon}
          onChangeText={setCoupon}
        />
        <TouchableOpacity
          disabled={!coupon.length}
          style={{
            backgroundColor: "red",
            padding: 12,
            borderRadius: 24,
            alignSelf: "center",
            elevation: 4,
            alignItems: "center",
            marginHorizontal: "auto",
            width: "80%",
            opacity: !coupon.length ? 0.6 : 1,
          }}
          onPress={applyCoupon}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Apply coupon
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.total}>
        Total Price: ₹{totalPrice - couponApplied}
      </Text>

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
