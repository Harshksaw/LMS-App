import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import HomeBannerSlider from "@/components/home/home.banner.slider";
import AllCourses from "@/components/courses/all.courses";
import { useEffect, useState } from "react";

import React from "react";
import { Video } from "expo-av";
import StudyMaterialsList from "@/components/studymaterials";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import QuizScreen from "../search/quiz.screen";
import { usePreventScreenCapture } from 'expo-screen-capture';
export default function HomeScreen() {
  usePreventScreenCapture();
  const [videoUri, setVideoUri] = useState(null);
  const videoref = React.useRef(null);



  return (
   <SafeAreaView
   style={{
    flex: 1,
    paddingTop: 50,
   }}
   >

   
      <Header />
      {/* <SearchInput homeScreen={true} /> */}
      <ScrollView showsVerticalScrollIndicator={false}
      style={
        {
          // flex:1,
          backgroundColor: "white",
          // padding: 10,
          // paddingHorizontal: 10,
        }
      }
      >
        <HomeBannerSlider />

        {/* <AllCourses /> */}

        {/* <StudyMaterialsList /> */}

        <View
          style={{ height: 'auto', marginHorizontal: 0, paddingHorizontal: 0, gap:5, marginTop:5 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              marginHorizontal: 16
              // backgroundColor: "lightblue",
            }}
          >
            <TouchableOpacity
            // onPress={()=>{setRefreshing(!refreshing)}}
            >
              <Text style={styles.heading}>Test Series</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/courses",
                  // params: { study: JSON.stringify(studyMaterials) },
                })
              }
            >
              {/* <Ionicons name="arrow-forward" size={30} color="gray" /> */}

              <Text
                style={{
                  color: "red",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

                <QuizScreen/>

        </View>
      </ScrollView>
      </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 16,
  },
});
{
  /* <Video
      source={{
        uri: 'https://d33zqdivlk1hm.cloudfront.net/SampleVideo_1280x720_20mb.mp4',
      }}
      useNativeControls

      resizeMode='contain'
      isLooping
      style={{ width: '100%', height: 300 }}
    /> */
}
