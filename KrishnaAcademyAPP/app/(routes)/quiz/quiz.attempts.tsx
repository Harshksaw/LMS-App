import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizAttempts = () => {
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {

        const userI = await AsyncStorage.getItem("user");
        const isUser = JSON.parse(userI);
      try {
        const response = await axios.get(`${SERVER_URI}/api/v1/quiz/get-all-attempts/${isUser._id}`)
        const data = response.data;
        setAttempts(data.data);
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    };

    fetchAttempts();
  }, []);

  const renderItem = ({ item }) => (
    <View key={item._id} style={styles.card}>
      <Text style={styles.title}>Attempt ID: {item._id}</Text>
      <Text>Attempt Date: {new Date(item.attemptDate).toLocaleString()}</Text>
      <Text>Score: {item.score}</Text>
      <Text>User ID: {item.user}</Text>
      <Text>Quiz ID: {item.quiz}</Text>
      <View style={styles.questions}>
        {item.questions.map((question, index) => (
          <View key={index} style={styles.question}>
            <Text>Question ID: {question.question}</Text>
            <Text>User Answer: {question.userAnswer || 'Unanswered'}</Text>
            <Text>Correct Answer: {question.correctAnswer}</Text>
            <Text>Is Correct: {question.isCorrect ? 'Yes' : 'No'}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={attempts}
        renderItem={renderItem}
        keyExtractor={item => item._id}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questions: {
    marginTop: 10,
  },
  question: {
    marginBottom: 10,
  },
});

export default QuizAttempts;