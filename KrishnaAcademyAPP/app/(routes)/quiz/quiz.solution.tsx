
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { SafeAreaView } from 'react-native-safe-area-context';

const quizsolution = () => {
  const [userSelections, setUserSelections] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<any[]>([]);
  const route = useRoute();
  const { attemptId } = route.params;
  console.log("🚀 ~ quizsolution ~ attemptId:", attemptId)

  useEffect(() => {
    // Fetch user's attempts and correct answers from attemptSchema
    const fetchAttempts = async () => {
      try {
        const response = await axios.post(`${SERVER_URI}/api/v1/quiz/get-attempt-quiz/${attemptId}` );
        const data = response.data
        console.log("🚀 ~ fetchAttempts ~ data:", data.data)
        setUserSelections(data.userSelections);
        setCorrectAnswers(data.correctAnswers);
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    };

    fetchAttempts();
  }, [attemptId]);

  const renderItem = ({ item, index }) => (
    <View>
      <Text>Question: {item.question}</Text>
      <Text>Your Answer: {userSelections[index]}</Text>
      <Text>Correct Answer: {correctAnswers[index]}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    backgroundColor:'red'
    }}>
      <Text>hhhh</Text>
      <FlatList
        data={userSelections}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default quizsolution;