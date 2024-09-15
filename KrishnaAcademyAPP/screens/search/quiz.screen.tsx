import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import React from "react";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "react-native-toast-notifications";

const { width, height } = Dimensions.get("screen");

const renderCources = ({ item }: { item: any }) => {
  if (item.status === "Draft") {
    return null;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderWidth: 0.5,
        elevation: 3,
        borderColor: "#d2cccc",
        minWidth: "45%",
        maxWidth: "50%",
        marginHorizontal: 5,
        // height: 250, // Ensure this is set to control the size
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 4,
        padding: 4,
        borderRadius: 20,
        width: width / 2 - 40,
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
          position: "absolute",
          top: 12,
          left: 12,
          justifyContent: "flex-start", // Aligns children vertically to the top
          alignItems: "flex-start", // Aligns children horizontally to the left
          backgroundColor: "green", // Dark background color
          borderRadius: 10,
          alignSelf: "flex-start",
          padding: 5, // Add padding for better appearance
        }}
      >
        <Text
          style={{
            color: "white", // White text color
            fontSize: 12,
            // fontWeight: "bold",
            textAlign: "left", // Align text to the left
          }}
        >
          ₹{item?.price}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#EBEBEB",
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 48,
          marginBottom: 15,
        }}
      >
        {item.image ? (
          <ImageBackground
            placeholder={{
              uri: "https://res.cloudinary.com/dbnnlqq5v/image/upload/v1723394487/images/gxtgjwsur0ledawfh8ll.jpg",
            }}
            source={{ uri: item?.image }}
            style={{
              width: 160,
              height: 140,
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
          // marginTop: -15,
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
            marginBottom: 4,
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
export default function QuizScreen() {
  const [quizzes, setQuizzes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URI}/api/v1/bundle/course-bundle`
        );
        setQuizzes(res.data.data);
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
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  if (quizzes.length === 0) {
    return (
      <ActivityIndicator
        size="large"
        color="rgb(224, 21, 21)"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 30,
      }}
    >
      <View
        style={{
          paddingLeft: 15,
        }}
      >
        <FlatList
          data={quizzes}
          renderItem={renderCources}
          contentContainerStyle={{ width: "100%", gap: 20 }}
          columnWrapperStyle={{ gap: 5 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
}
