import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Alert,
} from "react-native";

import Header from "@/components/header/header";
import { Toast } from "react-native-toast-notifications";
import HomeBannerSlider from "@/components/home/home.banner.slider";

import { useState } from "react";

import React from "react";
import { router, useFocusEffect, usePathname } from "expo-router";
import QuizScreen from "../search/quiz.screen";
import { usePreventScreenCapture } from "expo-screen-capture";
export default function HomeScreen() {
  usePreventScreenCapture();
  // const [videoUri, setVideoUri] = useState(null);
  // const videoref = React.useRef(null);

  const [backPressCount, setBackPressCount] = useState(0);
  const backAction = () => {
    if (backPressCount === 0) {
      setBackPressCount((prevCount) => prevCount + 1);
      setTimeout(() => setBackPressCount(0), 2000);
      Toast.show("Press again to close the app");
    } else if (backPressCount === 1) {
      BackHandler.exitApp();
    }
    return true;
  };

  // const backAction = () => {
  //   Alert.alert(
  //     "Are You Sure?",
  //     "You Want to Exit From the application?",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => {},
  //         style: "cancel",
  //       },
  //       {
  //         text: "OK",
  //         onPress: () => BackHandler.exitApp(),
  //       },
  //     ],
  //     {
  //       cancelable: false,
  //     }
  //   );
  //   return true;
  // };

  useFocusEffect(
    React.useCallback(() => {
      console.log("djkfhdsjkhf");
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [backAction])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 50,
      }}
    >
      <Header />
      {/* <SearchInput homeScreen={true} /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          // flex:1,
          backgroundColor: "white",

          // paddingHorizontal: 10,
        }}
      >
        <HomeBannerSlider />

        {/* <AllCourses /> */}

        {/* <StudyMaterialsList /> */}

        <View
          style={{
            height: "auto",
            marginHorizontal: 0,
            paddingHorizontal: 0,
            gap: 5,
            marginTop: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              marginHorizontal: 16,
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

          <QuizScreen />
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
