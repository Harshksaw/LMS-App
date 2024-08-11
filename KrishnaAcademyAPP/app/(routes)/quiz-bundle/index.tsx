import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { courseData } from "@/screens/search/quiz.screen";

import QuizCard from "@/components/quiz/quiz.bundlecard";
import StudyMaterialCard from "@/components/quiz/studymaterial";
import { useRoute } from "@react-navigation/native";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { styles } from "./styles";
import InfoScreen from "./InfoScreen";

const { height, width } = Dimensions.get("window");


const ContentsScreen = () => (
  <ScrollView style={styles.tabContent}>

    <View>

      <QuizCard quizzes={courseData[0].quizzes} />
      <StudyMaterialCard studyMaterials={courseData[0].studyMaterials} />




    </View>

  </ScrollView>
);

const Tab = createMaterialTopTabNavigator();

export default function index() {

  const [BundleData, setBundleData] = React.useState(courseData[0]);
  const route = useRoute();
  const { BundleId } = route.params;

  console.log("🚀 ~ index ~ BundleId:", BundleId)


  const fetchBundleData = async () => {
    try {
      const response = await axios.get(`${SERVER_URI}/api/v1/Bundle/course-bundle/${BundleId}`);
      console.log("🚀 ~ file: index.tsx ~ line 136 ~ fetchBundleData ~ response", response.data.data);

      if (response.status === 200 && response.data.success) {
        setBundleData(response.data.data);
        
      } else {
        console.error("Failed to fetch bundle data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    fetchBundleData();


  }, [BundleId]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: "lightblue",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{
          height: height * 0.35,
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Image source={{ uri: BundleData?.image }} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>Quiz Bundle Name</Text>
        </View>
      </View>
      <View style={styles.tabContainer}>
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
          <Tab.Screen name="About"  component={() => <InfoScreen data={BundleData} />}  />
          <Tab.Screen name="Content" component={() => <ContentsScreen  data={BundleData}/>} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}


