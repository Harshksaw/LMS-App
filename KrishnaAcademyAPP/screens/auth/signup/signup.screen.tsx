import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { useEffect, useState } from "react";
import { commonStyles } from "@/styles/common/common.styles";
import { router } from "expo-router";

import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import React from "react";
import { collectDeviceData } from "@/utils/device.data";



export default function SignUpScreen() {
  const [otpSentCount, setOtpSentCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
  });
  const [required, setRequired] = useState("");
  const [error, setError] = useState({
    password: "",
  });


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setIsOtpButtonDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // useEffect(() => {
  //   if (userInfo.phoneNumber.length == 10) {
  //     handleOtp();
  //   }
  // }, [userInfo.phoneNumber]);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordSpecialCharacter.test(password)) {
      setError({
        ...error,
        password: "Write at least one special character",
      });
      setUserInfo({ ...userInfo, password: "" });
      return "Password must include at least one special character";
    } else if (!passwordOneNumber.test(password)) {
      setError({
        ...error,
        password: "Write at least one number",
      });
      setUserInfo({ ...userInfo, password: "" });
      return "Password must include at least one number";
    } else if (!passwordSixValue.test(password)) {
      setError({
        ...error,
        password: "Write at least 6 characters",
      });
      setUserInfo({ ...userInfo, password: "" });
      return "Password must be at least 6 characters long";
    } else {
      setError({
        ...error,
        password: "",
      });
      setUserInfo({ ...userInfo, password });
      return "";
    }
  };
  const handleOtp = async () => {
    Toast.show("sending otp");
    console.log("called otp");
    if (otpSentCount >= 3) {
      Toast.show('You can only request OTP 3 times in an hour.');
      return;
    }

    setButtonSpinner(true);
    const response = await axios.post(`${SERVER_URI}/api/v1/auth/sendotp`, {
      phoneNumber: userInfo.phoneNumber,
    });
    if (response.status == 200) {
      Toast.show(`${response.data.OtpMessage}`);
      setOtpSentCount((prevCount) => prevCount + 1);
      setButtonSpinner(false);
      setTimer(120);
      setIsOtpButtonDisabled(true);

      setTimeout(() => {
        setOtpSentCount(0);
      }, 3600000);
    } else {
      Toast.show(`${response.data.OtpMessage}`)
    }
  };





  const handleSignup = async () => {
    setButtonSpinner(true);
    const validationMessage = handlePasswordValidation(userInfo.password);
    if (validationMessage) {
      Toast.show(validationMessage, { type: "danger", placement:'top' });
      setButtonSpinner(false);
      return;
    }
    Toast.show("Signup successful", { type: "success" });

    const deviceData = await collectDeviceData();
    console.log("🚀 ~ handleSignup ~ deviceData:", deviceData);
    if (!deviceData) {
      Toast.show("Error in collecting device data", {
        type: "danger",

      });
    }



    try {
      const response = await axios.post(`${SERVER_URI}/api/v1/auth/signup`, {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        phoneNumber: userInfo.phoneNumber,
        otp: userInfo.otp,
        accountType: "Student",
        deviceData: deviceData,
      });

      console.log(response.data, "0000");


      Toast.show(response.data.message, {
        type: "success",
      });
      setUserInfo({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        otp: "",
      });
      setButtonSpinner(false);
      router.push("/(routes)/login");



    } catch (error) {
      console.error(error); // Log the error for debugging
      Toast.show(error?.message || "Signup failed. Please try again.", {
        type: "error",
      }); // Display an error message to the user
      setButtonSpinner(false); // Stop the button spinner if used
    }
  };

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 20 }}
    >
      <ScrollView>
        <Image
          style={styles.signInImage}
          source={require("@/assets/sign-in/signup.png")}
        />
        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
          Let's get started!
        </Text>
        <Text style={styles.learningText}>
          Create an account to LMS to get all features
        </Text>
        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[styles.input, { paddingLeft: 40, marginBottom: -12 }]}
              keyboardType="default"
              value={userInfo.name}
              placeholder="Name"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, name: value })
              }
            />
            <AntDesign
              style={{ position: "absolute", left: 26, top: 14 }}
              name="user"
              size={20}
              color={"#A1A1A1"}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              marginHorizontal: 2,
              gap: 5,
            }}
          >
            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="email@gmail.com"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, email: value })
              }
            />
            <Fontisto
              style={{ position: "absolute", left: 26, top: 17.8 }}
              name="email"
              size={20}
              color={"#A1A1A1"}
            />
            {required && (
              <View style={commonStyles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
              </View>
            )}

            {/* //phone number */}

            <View style={{
              // backgroundColor:'red',
              // flexDirection: "row",
            }}>

            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              keyboardType="number-pad"
              value={userInfo.phoneNumber}
              placeholder="Phone Number"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, phoneNumber: value })
              }
              />
              <TouchableOpacity onPress={handleOtp} style={{
    position: "absolute",
    right: 40,
    top: 20.8,
    // marginTop: -2,
  }} >

  <Ionicons name="send-outline" size={20} color={"#000"} 
  
  />
  </TouchableOpacity>
              </View>
            
            <Fontisto
              style={{ position: "absolute", left: 26, top: 17.8 }}
              name="email"
              size={20}
              color={"#A1A1A1"}
            />
            {required && (
              <View style={commonStyles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
              </View>
            )}

            <View style={{
              // flexDirection: "row",
              // justifyContent: "space-between",
            }}>

              <TextInput
                style={[styles.input, { paddingLeft: 20, width: '92%', marginTop: 5 }]}
                keyboardType="default"
                value={userInfo.otp}
                placeholder="OTP"
                onChangeText={(value) => setUserInfo({ ...userInfo, otp: value })}
              />
            
            </View>
            <View>

              {timer > 0 && (
                <Text>{`Please wait ${Math.floor(timer / 60)}:${timer % 60} minutes before requesting another OTP.`}</Text>
              )}

            </View>
            <Fontisto
              style={{ position: "absolute", left: 26, top: 17.8 }}
              name="email"
              size={20}
              color={"#A1A1A1"}
            />
            {required && (
              <View style={commonStyles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
              </View>
            )}

            <View style={{ marginTop: 15 }}>
              <TextInput
                style={commonStyles.input}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                defaultValue=""
                placeholder="********"
                onChangeText={handlePasswordValidation}
              />
              <TouchableOpacity
                style={styles.visibleIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>
              <SimpleLineIcons
                style={styles.icon2}
                name="lock"
                size={20}
                color={"#A1A1A1"}
              />
            </View>
            {error.password && (
              <View style={[commonStyles.errorContainer, {}]}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                  {error.password}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                marginHorizontal: 16,
                backgroundColor: "#ED3137",
                marginTop: 15,
              }}
              onPress={handleSignup}
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
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupRedirect}>
              <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Raleway_600SemiBold",
                    color: "#ED3137",
                    marginLeft: 5,
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  signInImage: {
    width: "60%",
    height: 250,
    alignSelf: "center",
    marginTop: 50,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
  },
  learningText: {
    textAlign: "center",
    color: "#575757",
    fontSize: 15,
    marginTop: 5,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 30,
  },
  input: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 16,
    backgroundColor: "white",
    color: "#A1A1A1",
  },
  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },
  icon2: {
    position: "absolute",
    left: 23,
    top: 17.8,
    marginTop: -2,
  },
  forgotSection: {
    marginHorizontal: 16,
    textAlign: "right",
    fontSize: 16,
    marginTop: 10,
  },
  signupRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
});
