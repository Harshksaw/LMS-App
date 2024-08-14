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


import QuizCard from "@/components/quiz/quiz.bundlecard";
import StudyMaterialCard from "@/components/quiz/studymaterial";
import { useRoute } from "@react-navigation/native";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { styles } from "./styles";
import InfoScreen from "./InfoScreen";
import Button from "@/components/button/button";
import { router } from "expo-router";

const { height, width } = Dimensions.get("window");


const ContentsScreen = ({data}) => (

    <ScrollView style={styles.tabContent}>

    <View>

      <QuizCard quizzes={data.quizes} />

      {/* //TODO  */}
      {/* <StudyMaterialCard studyMaterials={courseData[0].studyMaterials} /> */}




    </View>

  </ScrollView>
  )

  const VideoScreen = ({data}) => {
    const [videodata, setvideoData] = React.useState([]);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {videodata.length === 0 ? (
          <View style={styles.noVideoContainer}>
          <Image
            source={{ uri: 'https://unbridledwealth.com/wp-content/uploads/2017/08/video-placeholder.jpg' }} // Replace with your image URL
            style={styles.noVideoImage}
          />
          <Text style={styles.noVideoText}>No video available</Text>
        </View>
      ) : (
        // Render your video content here
        <View>
          {/* Replace this with your actual video rendering logic */}
          <Text>Video Content</Text>
        </View>
      )}
    </View>

    )
  }

const Tab = createMaterialTopTabNavigator();

export default function index() {

  const [BundleData, setBundleData] = React.useState([]);
  
  const route = useRoute();
  const { BundleId } = route.params;

  // console.log("🚀 ~ index ~ BundleId:", BundleId)


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






  const onPress = () => {
    router.push({
      pathname: '/(routes)/payment',
      params: { itemId: BundleId, itemPrice : BundleData.price, itemData: JSON.stringify(BundleData) },


    });
  };
  // console.log("🚀 ~ index ~ BundleData:", BundleData)
  
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
          height: height * 0.35,

          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Image source={{ uri: BundleData?.image }} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{BundleData.bundleName}</Text>
        </View>
      </View>
      

      <View style={{flex:1}}>
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
          <Tab.Screen name="Overview"  component={() => <InfoScreen data={BundleData} />}  />
          <Tab.Screen name="Content" component={() => <ContentsScreen  data={BundleData}/>} />
          <Tab.Screen name="Video" component={() => <VideoScreen data={[]}  />} />
        </Tab.Navigator>
        <Button title="Enroll Now" onPress={onPress }/>
      </View>
    </SafeAreaView>
  );
}

