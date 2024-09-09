import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import QuizCard from "@/components/quiz/quiz.bundlecard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { ScrollView } from "react-native";

export default function Search() {
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    const fetchQuizzes = async () => {
      const userI = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(userI);
      const bundlesRes = await axios.get(
        `${SERVER_URI}/api/v1/bundle/getUserBundleQuizzes/${isUser._id}`
      );
      const bundles = bundlesRes.data.data;

      setQuizzes(bundles);
    };
    fetchQuizzes();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // paddingTop: 50,
        paddingHorizontal: 12,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <QuizCard quizzes={quizzes} />
      </ScrollView>
    </SafeAreaView>
  );
}
