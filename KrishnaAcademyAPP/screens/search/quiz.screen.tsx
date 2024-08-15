import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import React from "react";
import Header from "@/components/header/header";

import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "react-native-toast-notifications";




const renderCources = ({ item }) => {

  if (item.status === 'Draft') {
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
        height: 250, // Ensure this is set to control the size
        flexDirection: "column",
        justifyContent: "space-between",
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


        {!item.image ? (
          <ImageBackground
            source={{ uri: item.image }}
            style={{
              width: "100%",
              height: "100%", // Adjusted to fill the TouchableOpacity
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
          backgroundColor: '#fff',
          // marginTop: -15,
          width: "100%",
          marginVertical: 10,
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
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          {item.bundleName}

        </Text>
        <Text
          style={{
            // color: "white",
            fontSize: 12,
            fontWeight: "condensed",
            textAlign: "left",
          }}
        >
          {item.aboutDescription.slice(0, 15)}
        </Text>
      </View>
    </TouchableOpacity>
  )


}
export default function QuizScreen() {
  const [quizzes, setQuizzes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const res = await axios.get(`${SERVER_URI}/api/v1/Bundle/course-bundle`);
        setQuizzes(res.data.data);


        // console.log(res.data.data,'get all quizes');
      } catch (error) {
        Toast.show("Error fetching quizzes", { type: "danger", duration: 1000, placement: 'top', style: { marginTop: 30 } });
        console.log(error);
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

  if (quizzes.length === 0) {
    return <ActivityIndicator size="large" color="rgb(224, 21, 21)"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor:'red'
      }}
    />
  }

  return (


    <View
      style={{
        flex: 1,
        // backgroundColor:'red',

      }}
    >



      <View
        style={{

          // marginHorizontal: 10,
          // backgroundColor: "red",

          flexDirection: "column",
          justifyContent: "center",
          // alignItems: "center",
          padding: 10,
          gap: 10


          // height: "100%",
        }}
      >

        <FlatList
          data={quizzes}
          renderItem={renderCources}
          contentContainerStyle={{ width: "100%", gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
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