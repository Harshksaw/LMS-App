
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { SafeAreaView } from 'react-native-safe-area-context';

const quizsolution = () => {
  const [userSelections, setUserSelections] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<any[]>([]);

  const [questions, setQuestions] = useState<any[]>([]);
  const route = useRoute();
  const { attemptId } = route.params;
  console.log("🚀 ~ quizsolution ~ attemptId:", attemptId)

  // const quizDetails = JSON.parse(questionData)

  useEffect(() => {

    const fetchAttempts = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getAttemptQuiz/${attemptId}` );
        const data = response.data
        console.log("🚀 ~ fetchAttempts ~ data:", data.data.questions)
        // console.log(JSON.parse(questionData), 'questionData')
        setQuestions(data.data.questions);
        setUserSelections(data.data.questions.map(q => q.userAnswer));
        setCorrectAnswers(data.data.questions.map(q => q.correctAnswer));
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    };

    fetchAttempts();
  }, [attemptId]);


  return (
<ActivityIndicator size="large" color="#0000ff" />
  )
  const renderItem = ({ item, index }) => {
    console.log(correctAnswers, 'correctAnswers');
    // console.log(quizDetails, 'questionData.options');
    const questionData = quizDetails.find(q => q._id === item.question);
    console.log("🚀 ~ renderItem ~ questionData:", questionData)
    
    return (
      <View key={item._id} style={{ marginBottom: 20 }}>
      {/* <Text>Question: {questionData.question.en}</Text> */}
      {Object.entries(questionData.options).map(([key, option]) => {
        console.log(key, option, 'key, option', correctAnswers[index]);
        let textColor = 'black';
        let background = 'white';
        if (key === correctAnswers[index]) {
          textColor = 'green', background = 'lightgreen';
        } else if (key === userSelections[index]) {
          textColor = 'red', background = 'red';
        }
    
        return (
          <Text key={key} style={{ color: textColor,backgroundColor:background  }}>
            {option.en} 
            {key === userSelections[index] && ' (Your Answer)'} 
            {key === correctAnswers[index] && ' (Correct Answer)'}
          </Text>
        );
      })}
    </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={questions}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </SafeAreaView>
  );
};


export default quizsolution;