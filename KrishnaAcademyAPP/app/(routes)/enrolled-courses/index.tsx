import useUser from "@/hooks/auth/useUser";
import { SERVER_URI } from "@/utils/uri";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";

const renderCources = ({ item }) => {
  if (item.status === "Draft") {
    return null;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#d2cccc",

        // marginBottom: 10,
        minWidth: "45%",
        maxWidth: "50%",
        marginHorizontal: 5,
        height: 240, // Ensure this is set to control the size
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 4,

        padding: 4,
        borderRadius: 20,
        overflow: "hidden", // Ensure the borderRadius effect applies to children
      }}
      onPress={() =>
        router.push({
          pathname: "/(routes)/quiz-bundle",
          params: { BundleId: item._id },
        })
      }
    >
      <View
        style={{
          // backgroundColor: "#EBEBEB",
          borderRadius: 10,

          width: 150,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          marginTop: 28,
        }}
      >
        {item.image ? (
          <ImageBackground
            placeholder={{
              uri: "https://res.cloudinary.com/dbnnlqq5v/image/upload/v1723394487/images/gxtgjwsur0ledawfh8ll.jpg",
            }}
            source={{ uri: item.image }}
            style={{
              width: 150,
              height: 150, // Adjusted to fill the TouchableOpacity
              // justifyContent: "center",

              // alignItems: "center",
            }}
            imageStyle={{
              paddingHorizontal: 5,
              borderRadius: 20, // Apply borderRadius to the image itself
            }}
          />
        ) : (
          <Ionicons
            name="image-outline"
            size={140}
            color="red"
            style={
              {
                // marginVertical: 10,
              }
            }
          />
        )}
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          marginTop: -10,
          width: "100%",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            // color: "white",
            fontSize: 16,
            marginBottom: 14,
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          {item.bundleName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default function index() {
  const [quizzes, setQuizzes] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuizzes = async () => {
      const user = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(user);
      try {
        const res = await axios.get(
          `${SERVER_URI}/api/v1/Auth/getAllUserCourses/${isUser._id}`
        );
        setQuizzes(res.data.data.courses);

        if (res.status === 200) {
          setLoading(false);
        }
      } catch (error) {
        Toast.show("Error fetching quizzes", {
          type: "danger",
          duration: 1000,
          placement: "top",
          style: { marginTop: 30 },
        });
      }
    };
    getQuizzes();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Place your data fetching logic here
    setTimeout(() => {
      // Simulate a network request
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={{
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center",
        padding: 10,
        gap: 10,
      }}
    >
      {loading ? (
        <ActivityIndicator color={"red"} />
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderCources}
          contentContainerStyle={{ width: "100%", gap: 5 }}
          columnWrapperStyle={{ gap: 5 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}
