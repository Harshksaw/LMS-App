import React, { useEffect, useState } from "react";
import QuizScreen from "@/screens/search/quiz.screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import QuizCard from "@/components/quiz/quiz.bundlecard";
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
      const bundlesRes = await axios.get(`${SERVER_URI}/api/v1/bundle/getUserBundleQuizzes/${isUser._id}`);
      // Toast.show("Fetching Quizzes", { type: "success", duration: 1000, placement: 'top' , style: { marginTop:30 } });
      const bundles = bundlesRes.data.data;
      console.log("🚀 ~ fetchQuizzes ~ bundles:", bundles)
      setQuizzes(bundles)
      // let allQuizzes = [];

      // Iterate over each bundle to fetch quizzes
      // for (const bundle of bundles) {

      //   const res = await axios.get(`${SERVER_URI}/api/v1/bundle/getUserBundleQuizzes/${bundle._id}`);
      //   allQuizzes = [...allQuizzes, ...res.data.data.courses];
      // }
      // Toast.show("Fetching Quizzes", { type: "success", duration: 1000, placement: 'top', style: { marginTop: 30 } });
      // console.log(allQuizzes, "------------------");
      // setQuizzes(allQuizzes);

    }
    fetchQuizzes();
  }, []);
  return (

    <SafeAreaView
      style={{
        flex: 1,
        // paddingTop: 50,
        paddingHorizontal: 12
      }}
    >
    <ScrollView showsVerticalScrollIndicator={false}>


      <QuizCard quizzes={quizzes}/>
    </ScrollView>
    </SafeAreaView>


  );
}

