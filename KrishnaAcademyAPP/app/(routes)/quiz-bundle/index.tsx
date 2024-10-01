import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import QuizCard from "@/components/quiz/quiz.bundlecard";

import { useRoute } from "@react-navigation/native";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { styles } from "./styles";
import InfoScreen from "./InfoScreen";
import Button from "@/components/button/button";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import VideoScreen from "./ViewScreen";

const { height, width } = Dimensions.get("window");

const ContentsScreen = ({ data, bundleId, userId, handleBought }) => {
  const [isBundleBought, setIsBundleBought] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const response = await axios.post(
          `${SERVER_URI}/api/v1/bundle/checkPurchase`,
          {
            userId,
            courseId: bundleId,
          }
        );
        if (response.status === 200) {
          setLoading(false);
          handleBought();
          setIsBundleBought(true);
        }

        // setIsBundleBought(response.data.isPurchased);
      } catch (error) {
        if (error.response.status === 404) {
          setLoading(false);
          setIsBundleBought(false);
        } else if (error.response.status === 400) {
          console.error("Bad request: Missing required parameters");
        } else if (error.response.status === 401) {
          console.error("User not authenticated");
        } else if (error.response.status === 403) {
          console.error("User not authorized to access this course bundle");
        } else {
          console.error("Unexpected status code:", error.response.status);
        }
        console.error("Error checking purchase status:", error);
      }
    };

    checkPurchaseStatus();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.tabContent}>
        <QuizCard quizzes={data.quizes} />
        {/* //TODO  */}
        {/* <StudyMaterialCard studyMaterials={courseData[0].studyMaterials} /> */}
      </ScrollView>
      {!isBundleBought && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f4f4f480",
          }}
        >
          <Ionicons name="lock-closed-outline" size={100} color="red" />
          <Text
            style={{
              color: "red",
              marginBottom: 20,
              fontSize: 25,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Unlock
          </Text>
          {/* <Button title="Go to Payment" onPress={() => navigate('/(routes)/payment', { itemId: bundleId })} /> */}
        </View>
      )}
    </View>
  );
};



const Tab = createMaterialTopTabNavigator();

export default function index() {
  const [BundleData, setBundleData] = React.useState([]);



  const [isBought, setIsBought] = React.useState(false);
  const handleBought = () => {
    setIsBought(true);
  };

  const route = useRoute();
  const { BundleId } = route.params as any;

  const [userId, setUserId] = React.useState("");

  const fetchBundleData = async () => {
    const userI = await AsyncStorage.getItem("user");
    const isUser = JSON.parse(userI as any);
    setUserId(isUser._id);
    try {
      const response = await axios.get(
        `${SERVER_URI}/api/v1/bundle/course-bundle/${BundleId}`
      );

      if (response.status === 200 && response.data.success) {
        setBundleData(response.data.data);
        console.log("🚀 ~ fetchBundleData ~ response.data.data:", response.data.data)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBundleData();
  }, [BundleId]);

  const onPress = () => {
    router.push({
      pathname: "/(routes)/payment",
      params: {
        itemId: BundleId,
        itemPrice: BundleData.price,
        itemData: JSON.stringify(BundleData),
      },
    });
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: "lightblue",
        flexDirection: "column",
        justifyContent: "flex-start",
        // backgroundColor: "lightblue",
      }}
    >
      <View
        style={{
          height: height * 0.38,

          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Image source={{ uri: BundleData?.image }} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{BundleData?.bundleName}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Home"
          tabBarOptions={{
            activeTintColor: "red",

            labelStyle: {
              fontSize: 16,
            },

            style: {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,

              borderBottomRightRadius: 15,
              marginHorizontal: 20,
              overflow: "hidden",
            },
            indicatorStyle: {
              backgroundColor: "red",
              height: 2,
            },
          }}
        >
          <Tab.Screen
            name="Overview"
            component={() => <InfoScreen data={BundleData} />}
          />
          <Tab.Screen
            name="Content"
            component={() => (
              <ContentsScreen
                data={BundleData}
                bundleId={BundleId}
                userId={userId}
                handleBought={handleBought}
              />
            )}
          />
          <Tab.Screen
            name="Video"
            component={() => <VideoScreen data={BundleData?.Videos} />}
          />
        </Tab.Navigator>
        {!isBought && <Button title="Enroll Now" onPress={onPress} />}
      </View>
    </SafeAreaView>
  );
}
