
import  PieCharts  from "@/components/charts/PaiCharts";
import { SERVER_URI } from "@/utils/uri";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const arrayOfObjects = [
  { color: 'red', title: 'Apple', alpha: 'a' },
  { color: 'blue', title: 'Blueberry', alpha: 'b' },
  { color: 'green', title: 'Grapes', alpha: 'c' },
  { color: 'yellow', title: 'Lemon', alpha: 'd' },
  { color: 'orange', title: 'Orange', alpha: 'e' },
  { color: 'purple', title: 'Plum', alpha: 'f' }
];
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

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
  };
};


export default function quizresult() {
  const route = useRoute();
  const { attemptId } = route.params as any;

 



  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {

    const fetchAttempts = async () => {

      
      const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getAttemptQuiz/${attemptId || "66bc38010eb297c55055ed4b"}`);
      const data = response.data
      console.log("🚀 ~ fetchAttempts ~ data:", data.data.questions)
      setQuestions(data.data.questions);
      
      
    }

    fetchAttempts();


  }, []);

  const { correctAnswers, incorrectAnswers, unansweredQuestions } = calculateTotals(questions);
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
          borderWidth: 1, borderColor: item.color }}>
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
        >
          <Text style={{
            textAlign: 'center',
                color: "black",
          }}>Re-attempt Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
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