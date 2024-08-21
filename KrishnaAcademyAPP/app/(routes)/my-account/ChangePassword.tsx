import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { Toast } from 'react-native-toast-notifications';
import Button from '@/components/button/button';

const ChangePasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    try {
      const response = await axios.post(`${SERVER_URI}/api/v1/auth/sendPassOtp`, { phoneNumber });
      if (response.data.success) {
        setOtpSent(true);
        Toast.show('OTP sent successfully');
      } else {
        Toast.show('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error sending OTP');
    }
  };

  const changePassword = async () => {
    try {
      const response = await axios.post(`${SERVER_URI}/api/v1/auth/changepassword`, { phoneNumber, otp, newPassword });
      if (response.data.success) {
Toast.show('Password changed successfully');
      } else {
        Toast.show('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Toast.show('Error changing password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      {otpSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </>
      )}
      {!otpSent ? (
        <Button title="Send OTP" onPress={sendOtp} 
        
        />
      ) : (
        <Button title="Change Password" onPress={changePassword} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default ChangePasswordScreen;