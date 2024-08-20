import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";

import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { router } from "expo-router";
import { Image } from "expo-image";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/button/button";
import { Toast } from "react-native-toast-notifications";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
];

async function getUser() {
  const usera = await AsyncStorage.getItem("user");
  const isUser = JSON.parse(usera);
  return isUser;
}

export default function ProfileScreen() {
  const { user } = useUser();
  const [dob, setDob] = useState(new Date(user?.additionalDetails?.dob || new Date()));
  const [state, setState] = useState(user?.additionalDetails?.state || "");
  const [usercity, setCity] = useState(user?.additionalDetails.city || "");
  const [show, setShow] = useState(false);

  useEffect(() => {
    getUser().then((user) => {
      setDob(new Date(user?.additionalDetails?.dob || new Date()));
      setState(user?.additionalDetails?.state || "");
      setCity(user?.additionalDetails.city || "");
    });
  }, []);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dob;
    setShow(false);
    setDob(currentDate);
  };

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const logoutHandler = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refresh_token");
    router.push("/(routes)/login");
  };

  const updateCity = (newCity: string) => {
    setCity(newCity);
  };

  const handleUpdateAdditionalDetails = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(user);
      const response = await axios.post(
        `${SERVER_URI}/api/v1/auth/additionalDetails/${isUser._id}`,
        {
          dob,
          state,
          city: usercity,
        }
      );

      if (response.status === 200) {
        Toast.show("Additional details updated successfully!", {
          type: "success",
        });
      } else {
        alert("Error updating additional details!");
      }
    } catch (error) {
      console.error("Error updating additional details:", error);
      alert("Internal server error!");
    }
  };

  return (
    <>
      <LinearGradient
        colors={["#E5ECF9", "#F6F7F9"]}
        style={{ flex: 1, paddingTop: 80 }}
      >
        <ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View style={{ position: "relative" }}>
              <Image
                source={{
                  uri: `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}`,
                }}
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 8,
                  borderRadius: 100,
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 36, paddingHorizontal: 16, gap: 8 }}>
            <Text style={{ fontSize: 16 }}>Name:</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 4,
                borderColor: "#c4c4c4",
                fontSize: 16,
                paddingVertical: 3,
              }}
              value={user?.name}
              editable={false}
              placeholder="Name"
            />

            <Text style={{ fontSize: 16 }}>Mobile No:</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 4,
                borderColor: "#c4c4c4",
                fontSize: 16,
                paddingVertical: 3,
              }}
              value={`${user?.phoneNumber}`}
              editable={false}
              placeholder="Mobile Number"
              keyboardType="numeric"
            />

            <Text style={{ fontSize: 16 }}>Email:</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 4,
                borderColor: "#c4c4c4",
                fontSize: 16,
                paddingVertical: 3,
              }}
              value={user?.email}
              editable={false}
              placeholder="Email"
              keyboardType="email-address"
            />

            <Text style={{ fontSize: 16 }}>DOB:</Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderColor: "#c4c4c4",
                }}
              >
                <Text style={{ flex: 1, color: "gray" }}>
                  {dob.toLocaleDateString()}
                </Text>
                <TouchableOpacity onPress={() => setShow(true)}>
                  <Text style={{ color: "black" }}>Select date</Text>
                </TouchableOpacity>
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dob}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <Text style={{ fontSize: 16 }}>State:</Text>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 4,
                borderColor: "#c4c4c4",
                paddingVertical: 0,
              }}
            >
              <Picker
                selectedValue={state}
                onValueChange={(itemValue) => setState(itemValue)}
              >
                <Picker.Item label="Select a state" value="" />
                {states.map((state) => (
                  <Picker.Item label={state} value={state} key={state} />
                ))}
              </Picker>
            </View>

            <Text style={{ fontSize: 16 }}>City:</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 4,
                borderColor: "#c4c4c4",
                fontSize: 16,
                paddingVertical: 3,
              }}
              value={usercity}
              editable={true}
              placeholder="City"
              onChangeText={updateCity}
            />
          </View>

          <View style={{ paddingVertical: 24 }}>
            <Button title="Update" onPress={handleUpdateAdditionalDetails} />
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Button title="Logout" onPress={logoutHandler} />
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}