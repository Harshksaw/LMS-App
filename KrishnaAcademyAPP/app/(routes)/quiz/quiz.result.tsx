
import  PieCharts  from "@/components/charts/PaiCharts";
import { SERVER_URI } from "@/utils/uri";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// const arrayOfObjects = [
//   { color: 'red', title: 'Apple', alpha: 'a' },
//   { color: 'blue', title: 'Blueberry', alpha: 'b' },
//   { color: 'green', title: 'Grapes', alpha: 'c' },
//   { color: 'yellow', title: 'Lemon', alpha: 'd' },
//   { color: 'orange', title: 'Orange', alpha: 'e' },
//   { color: 'purple', title: 'Plum', alpha: 'f' }
// ];
// const pieData = [
//   {
//     value: 47,
//     color: '#009FFF',
//     gradientCenterColor: '#006DFF',
//     focused: true,
//   },
//   { value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
//   { value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3' },
//   { value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97' },
// ];


const calculateTotals = (data) => {
  const totalQuestions = data.length;
  const correctAnswers = data.filter(item => item.isCorrect).length;
  const incorrectAnswers = data.filter(item => !item.isCorrect && !item.unanswered).length;
  const unansweredQuestions = data.filter(item => item.unanswered).length;

  
  const arrayOfObjects = [
    { color: 'red', bgColor: 'white' , title: 'total', alpha: totalQuestions },
    { color: 'blue', bgColor: '#009FFF' , title: 'correct', alpha: correctAnswers },
    { color: 'green', bgColor: '#FFA5BA' , title: 'incorrect', alpha: incorrectAnswers},
    { color: 'green', bgColor: '#BDB2FA' , title: 'unanswered', alpha: unansweredQuestions},
    // { color: 'yellow', title: 'Lemon', alpha: 'd' },
    // { color: 'orange', title: 'Orange', alpha: 'e' },
    // { color: 'purple', title: 'Plum', alpha: 'f' }
  ];
  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    arrayOfObjects
  };
};


export default function quizresult() {
  const route = useRoute();
  const { attemptId, quizId } = route.params as any;
  const navigation = useNavigation();
  

  useEffect(() => {  
    const backAction = () => {  
      // TODO: HARSH
      // navigation.navigate(); 
      return true; // Prevent the default back action  
    };  

    const backHandler = BackHandler.addEventListener(  
      'hardwareBackPress',  
      backAction  
    );  

    return () => backHandler.remove(); // Clean up the event listener on unmount  
  }, [navigation]);  


  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {

    const fetchAttempts = async () => {

      
      const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getAttemptQuiz/${attemptId || "66bc38010eb297c55055ed4b"}`);
      const data = response.data
      console.log("🚀 ~ fetchAttempts ~ data:", data.data.questions)
      setQuestions(data.data.questions);
      
      
    }

    const leaderBoard = async () => {
      const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getLeaderboard/${attemptId || "66bc38010eb297c55055ed4b"}`);
      const data = response.data
      console.log("🚀 ~ leaderBoard ~ data:", data)

    }


    fetchAttempts();
    leaderBoard();


  }, []);

  const { correctAnswers, incorrectAnswers, unansweredQuestions, arrayOfObjects } = calculateTotals(questions);
  console.log("🚀 ~ quizresult ~ unansweredQuestions:", unansweredQuestions)
  
  const pieData = [
    { value: correctAnswers,   color: '#009FFF', gradientCenterColor: '#006DFF', text: 'Correct',title:'Correct answers' },
    { value: incorrectAnswers,   color: '#FFA5BA', gradientCenterColor: '#FF7F97', text: 'Incorrect' ,title:'Incorrect answers'},
    { value: unansweredQuestions, color: '#BDB2FA', gradientCenterColor: '#8F80F3', text: 'Unanswered' , title:'unanswers' },
  ];
  
  console.log("🚀 ~ quizresult ~ correctAnswers:", correctAnswers)

  return (
    <ScrollView style={{ flex: 1, padding: 12, flexDirection:'column',
      gap: 15, backgroundColor: 'lightred',
      paddingTop: 50, paddingBottom: 50

     }}>


      <FlatList
        data={arrayOfObjects}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={{ flex: 1, alignItems: 'center', 
          justifyContent: 'center', padding: 10, margin: 8, borderRadius: 14, height: 100, 
          borderWidth: 1 , backgroundColor: item.bgColor}}>
            <Text>{item.alpha}</Text>
            <Text>{item.title}</Text>
          </View>)}
        keyExtractor={(item) => item.title}
      />

      <View style={{flex: 1, backgroundColor:'red'}}> 
    <PieCharts pieData={pieData} />
      </View>
        
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'relative', 
        
        bottom: 0, left: 0, right: 0, padding: 12, gap: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "white",
            borderWidth: 1,
            padding: 16,
            borderRadius: 4,
          }}
          onPress={()=> {
    router.push({
      pathname: "/(routes)/quiz/quiz.details",
      params: { quizId: quizId }
    })
          }}
        >
          <Text style={{
            textAlign: 'center',
                color: "black",
          }}>Re-attempt Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=> {

            router.push({
              pathname: '/(routes)/quiz/quiz.solution',
              params: {attemptId : attemptId}
            })
          }}
          style={{
            flex: 1,
            backgroundColor: "#f44336",
            padding: 16,
            borderRadius: 4,
          }}

        >
          <Text style={{
            textAlign: 'center',
            color: "white",
          }}>Solutions</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  )
}