import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  RefreshControl,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import Loader from "@/components/loader/loader";

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("screen");
const renderCources = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#d2cccc",
        width: width / 2 - 20,
        marginHorizontal: 5,
        // maxHeight: 260, // Ensure this is set to control the size
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 3,
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
          width: 150,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          // marginBottom: 10,
          marginTop: 48,
        }}
      >
        {item.image ? (
          <ImageBackground
            source={{ uri: item.image }}
            style={{
              width: 160,
              height: 140, // Adjusted to fill the TouchableOpacity
              // justifyContent: "center",

              // alignItems: "center",
            }}
            imageStyle={{
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
          marginVertical: 10,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingHorizontal: 10,

          // position: "absolute",
          // bottom: 0,
          // left: 0,
          // right: 0,
          // height: 80, // Adjust the height for your shadow effect
          // backgroundColor: "rgba(0,0,0,0.4)", // Semi-transparent view for shadow effect
          // flexDirection: "column",
          // justifyContent: "flex-start",
          // alignItems: "center",
          // gap: 10,
        }}
      >
        <Text
          style={{
            // color: "white",
            fontSize: 16,
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

export default function CoursesScreen() {
  const [quizzes, setQuizzes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const isUser = JSON.parse(user);

        const res = await axios.post(
          `${SERVER_URI}/api/v1/bundle/getAllcourse-bundle`
        );

        setQuizzes(res.data.data);

        setLoading(false);
      } catch (error) {}
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

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View
      style={
        {
          // flex:1
          // backgroundColor: "red",
          // paddingBottom: 10,
        }
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              fontVariant: ["small-caps"],
              color: "black",
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            Courses
          </Text>

          <FlatList
            data={quizzes}
            renderItem={renderCources}
            contentContainerStyle={{
              width: "100%",
              gap: 12,
              paddingBottom: 100,
              marginLeft: 5,
            }}
            columnWrapperStyle={{ gap: 5 }}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 13,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent gray background
  },
  comingSoonText: {
    fontSize: 30,
    fontWeight: "bold",
    fontVariant: ["small-caps"],

    color: "white",
  },
});
