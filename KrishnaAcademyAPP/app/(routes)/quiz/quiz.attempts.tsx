import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizAttempts = () => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const userI = await AsyncStorage.getItem("user");
        const isUser = JSON.parse(userI);
        const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getAllAttempt/${isUser._id}`);
        const data = response.data.data;
        setAttempts(data); // Directly set the fetched data
      } catch (error) {
        console.error('Error fetching attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  console.log(attempts, "----");

 
const renderItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.quizName}>{item.quiz.name}</Text>
      <Text style={styles.score}>Score: {item.score}</Text>
    </View>
    <Text>Attempt Date: {new Date(item.attemptDate).toLocaleDateString()}</Text>
    <Text>Number of Questions: {item.questions.length}</Text>
    {/* <View style={styles.questions}>
      {item?.questions?.map((question, index) => (
        <View key={index} style={styles.question}>
          <Text>User Answer: {question.userAnswer || 'Unanswered'}</Text>
          <Text>Correct Answer: {question.correctAnswer.en}</Text>
          <Text>Is Correct: {question.isCorrect ? 'Yes' : 'No'}</Text>
        </View>
      ))}
    </View> */}
  </View>
);


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={attempts}
        renderItem={renderItem}
        keyExtractor={item => item?._id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quizName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  questions: {
    marginTop: 10,
  },
  question: {
    marginBottom: 10,
  },
});

export default QuizAttempts;