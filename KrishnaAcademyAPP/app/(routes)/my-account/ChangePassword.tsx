import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import Button from "@/components/button/button";
import { router } from "expo-router";

const ChangePasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);

  const sendOtp = async () => {
    if (phoneNumber?.length !== 10) {
      Toast.show("Please Correct Mobile Number", {
        type: "danger",
      });
      return;
    }
    setButtonSpinner(true);
    try {
      const response = await axios.post(
        `${SERVER_URI}/api/v1/auth/sendPassOtp`,
        { phoneNumber }
      );
      if (response.data.success) {
        setOtpSent(true);
        Toast.show("OTP sent successfully");
      } else {
        Toast.show("Failed to send OTP");
      }
      setButtonSpinner(false);
    } catch (error) {
      Toast.show(
        "phone not registered, enter correct mobile number*" ??
          "Error sending OTP",
        {
          type: "danger",
        }
      );
      setButtonSpinner(false);
    }
  };

  const handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordSixValue.test(password)) {
      return "Password must be at least 6 characters long";
    }
    if (!passwordOneNumber.test(password)) {
      return "Password must include at least one number";
    }

    if (!passwordSpecialCharacter.test(password)) {
      return "Password must include at least one special character";
    }
  };

  const changePassword = async () => {
    const validationMessage = handlePasswordValidation(newPassword);
    if (validationMessage) {
      Toast.show(validationMessage, { type: "danger" });
      return;
    }
    setButtonSpinner(true);
    try {
      const response = await axios.post(
        `${SERVER_URI}/api/v1/auth/changepassword`,
        { phoneNumber, otp, newPassword }
      );
      if (response.data.success) {
        Toast.show("Password changed successfully");
        router.replace("/(routes)/login");
      } else {
        Toast.show("Wrong OTP", {
          type: "danger",
        });
        Toast.show("Failed to change password");
      }
      setButtonSpinner(false);
    } catch (error: any) {
      Toast.show(error?.response?.data?.message ?? "Error changing password", {
        type: "danger",
      });
      setButtonSpinner(false);
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
        <TouchableOpacity
          disabled={buttonSpinner}
          style={{
            padding: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            backgroundColor: "#ED3137",
            marginTop: 15,
          }}
          onPress={sendOtp}
        >
          {buttonSpinner ? (
            <ActivityIndicator size="small" color={"white"} />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Raleway_700Bold",
              }}
            >
              Send OTP
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={buttonSpinner}
          style={{
            padding: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            backgroundColor: "#ED3137",
            marginTop: 15,
          }}
          onPress={changePassword}
        >
          {buttonSpinner ? (
            <ActivityIndicator size="small" color={"white"} />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Raleway_700Bold",
              }}
            >
              Change Password
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default ChangePasswordScreen;
