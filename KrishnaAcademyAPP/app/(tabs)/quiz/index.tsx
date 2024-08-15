import React, { useEffect, useState } from "react";
import QuizScreen from "@/screens/search/quiz.screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native-gesture-handler";

export default function Search() {

  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    const fetchQuizzes = async () => {

      const userI = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(userI);
      const bundlesRes = await axios.get(`${SERVER_URI}/api/v1/Bundle/getUserBundleQuizzes/${isUser._id}`);
      Toast.show("Fetching Quizzes", { type: "success", duration: 1000, placement: 'top' , style: { marginTop:30 } });
      const bundles = bundlesRes.data.data;
      console.log("🚀 ~ fetchQuizzes ~ bundles:", bundles)
      setQuizzes(bundles)
      let allQuizzes = [];

      // Iterate over each bundle to fetch quizzes
      for (const bundle of bundles) {
        
      //   const res = await axios.get(`${SERVER_URI}/api/v1/Bundle/getUserBundleQuizzes/${bundle._id}`);
      //   allQuizzes = [...allQuizzes, ...res.data.data.courses];
      }
      // Toast.show("Fetching Quizzes", { type: "success", duration: 1000, placement: 'top', style: { marginTop: 30 } });
      // console.log(allQuizzes, "------------------");
      // setQuizzes(allQuizzes);

    }
    fetchQuizzes();
  }, []);
  return (

<SafeAreaView
style={{
  flex:1,
  paddingTop: 50,
}}
>

{/* <ScrollView> */}

<View style={{flex:1}}>
<View
        style={{

          // marginHorizontal: 10,
          // backgroundColor: "red",
flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          // alignItems: "center",
          // padding: 10,
          gap: 10


          // height: "100%",
        }}
      >
<FlatList
          data={quizzes}
          renderItem={renderCources}
          // contentContainerStyle={{ width: "100%",  alignItems:'center' }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item.id}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
        />
        </View>
</View>
</SafeAreaView>


  );
}

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
        width: '100%',
        // minWidth: "46%",
        // maxWidth: "50%",
        marginLeft: 8,
        height: 250, // Ensure this is set to control the size
        flexDirection: "column",
        // justifyContent: "space-between",
        alignItems: "center",
        gap: 4,


        padding: 12,
        borderRadius: 20,
        overflow: "hidden", // Ensure the borderRadius effect applies to children
      }}
      onPress={() =>
        router.push({
        
          pathname: "/(routes)/quiz/quiz.details",
          params:{quizId :item._id }
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
          {"purchased"}
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
            source={{ uri: item.image ? item.image : "https://picsum.photos/200" }}
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
          />
        )}
      </View>
      <View
        style={{
          backgroundColor: '#fff',
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
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          {item.name}

        </Text>
        {/* <Text
          style={{
            // color: "white",
            fontSize: 12,
            fontWeight: "condensed",
            textAlign: "left",
          }}
        >
          {item.shortDescription.slice(0, 15)}
        </Text> */}
      </View>
    </TouchableOpacity>
  )


}