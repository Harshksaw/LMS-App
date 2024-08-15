import React, { useEffect, useState } from "react";
import QuizScreen from "@/screens/search/quiz.screen";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { ScrollView, Text, View } from "react-native";
import { Toast } from "react-native-toast-notifications";

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
<Text>hkhkhkh</Text>
        {/* Render quiz cards here */}
        {quizzes.map((quiz, index) => (
          <QuizCard key={index} quiz={quiz} />
        ))}
      {/* </ScrollView> */}
</SafeAreaView>


  );
}
const QuizCard = ({ quiz }) => (
  <View style={{ margin: 10, padding: 10, backgroundColor: '#fff', borderRadius: 5 }}>
    <Text>{quiz.title}</Text>
    {/* Add more quiz details here */}
  </View>
);
