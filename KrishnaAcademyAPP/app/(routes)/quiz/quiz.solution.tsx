
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { SafeAreaView } from 'react-native-safe-area-context';

const quizsolution = () => {
  const [userSelections, setUserSelections] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<any[]>([]);

  const [quizData, setQuizData] = useState<any>([]);

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

        setQuestions(data.data.questions);
        setUserSelections(data.data.questions.map(q => q.userAnswer));
        setCorrectAnswers(data.data.questions.map(q => q.correctAnswer));
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    };

    fetchAttempts();
  }, [attemptId]);




const renderItem = ({ item }) => {

  // const data = JSON.stringify(item)
  const data = item
  console.log("🚀 ~ quizsolution ~ data:", data)
  // Check if item and item.question exist
  if (!data || !data.question) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  const { question, options } = data?.question;

  // Check if question and options exist
  if (!question || !options) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  return (
    <View style={styles.questionContainer}>
      {/* Render the question text */}
      <Text style={styles.questionText}>{question.en}</Text>
      {Object.keys(options).map((key) => {
        const option = options[key];
        let optionStyle = styles.optionText;

        // Check if option exists
        if (!option) {
          return null;
        }

        if (key === item.userAnswer) {
          optionStyle = styles.userAnswerText;
        }
        if (key === item.correctAnswer) {
          optionStyle = styles.correctAnswerText;
        }

        return (
          <Text key={key} style={optionStyle}>
            {option.en}
          </Text>
        );
      })}
    </View>
  );
};
//     );
//   };

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

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
  },
  userAnswerText: {
    fontSize: 16,
    color: 'green',
  },
  correctAnswerText: {
    fontSize: 16,
    color: 'red',
  },
});