import React, { useEffect, useState } from 'react';
import { View, Text, TextInput,TouchableOpacity, FlatList,Button, StyleSheet} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Toast } from 'react-native-toast-notifications';
import RazorpayCheckout from 'react-native-razorpay';

const PaymentPage = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Item 1', price: 100 },
    { id: '2', name: 'Item 2', price: 200 },
  ]);

  const route = useRoute();
  const { itemId,  itemData , itemPrice} = route.params;

  const ItemData = JSON.parse(itemData);
  console.log("🚀 ~ file: index.tsx ~ line 136 ~ fetchBundleData ~ response",   ItemData)
  

  const [coupon, setCoupon] = useState('');


  const [totalPrice, setTotalPrice] = useState(items.reduce((acc, item) => acc + item.price, 0));
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(40);
  const [Id, setItemId] = useState('');

  const createOrder = async ({user, items, totalAmount,} :any) => {
    try {
      const response = await axios.post('api/v1/payment/create-order', {
        user,
        items,
        totalAmount,
        // coupon
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
      const response = await axios.post('/api/apply-coupon', { coupon });
      if (response.data.success) {
        setDiscount(response.data.discount);
        setTotalPrice(totalPrice - response.data.discount);
      } else {
        alert('Invalid coupon');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert('Error applying coupon');
    }
  };


// TODO razorpoay payment

  const handlePayment = async() => {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: '', // Your api key
      amount: '5000',
      name: 'foo',
      prefill: {
        email: 'void@razorpay.com',
        contact: '9191919191',
        name: 'Razorpay Software'
      },
      theme: {color: '#F37254'}
    }

    await RazorpayCheckout.open(options).then((data) => {
      // handle success
      Toast.show('Payment successful');
      // Alert.alert(`Success: ${data.razorpay_payment_id}`);
    }).catch((error) => {
      console.log(error)
      // handle failure
      Toast.show('Payment failed');
      // Alert.alert(`Error: ${error.code} | ${error.description}`);
    });
  }


  
  return (
    <SafeAreaView style={styles.container}>

      <View
      style={{alignItems: 'center', justifyContent: 'center',}}
      >
        <Text style={{fontSize: 24,fontWeight: 'bold',}}>{"Purchase Details"}</Text>
        <Image source={{uri: ItemData.image}} style={{width: 200, height: 200, borderRadius: 12, marginVertical: 12}} />


      </View>
      
          <View style={styles.item}>
            <Text style={{fontSize: 16,fontWeight: 'bold',}}>{"Course price"}</Text>
            <Text style={{fontSize: 16,fontWeight: 'bold',}}>${itemPrice}</Text>
          </View>
          {/* {
        couponApplied > 0 && (
          <View style={styles.item}>
          <Text style={{fontSize: 16,fontWeight: 'bold',}}>{"Coupon discount"}</Text>
          <Text style={{fontSize: 16,fontWeight: 'bold',}}>${couponApplied}</Text>
        </View>
        )
      } */}


      <Text style={styles.total}>Total Price: ${totalPrice}</Text>
    
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
      style={{backgroundColor: "red", padding:12,borderRadius: 24, alignSelf: 'center',elevation: 4 , alignItems: 'center',marginHorizontal:'auto', width: '80%', position: 'absolute', bottom: 24}}  
      onPress={() => {
        var options = {
          description: 'Credits towards consultation',
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: "rzp_test_frHyAhT1IdPBwO", // Your api key
          amount: '5000',
          name: 'fo7o',
          prefill: {
            email: 'void@razorpay.com',
            contact: '9191919191',
            name: 'Razorpay Software'
          },
          theme: {color: '#F37254'}
        }
        RazorpayCheckout.open(options).then((data) => {
          // handle success
          alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
          // handle failure
          console.log(error)
          alert(`Error: ${error.code} | ${error.description}`);
        });
      }}>
        <Text style={{color: 'white', textAlign: 'center'}}>Confirm purchase</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 40
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    alignSelf:'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 24,
    marginBottom: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  discount: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
});

export default PaymentPage;