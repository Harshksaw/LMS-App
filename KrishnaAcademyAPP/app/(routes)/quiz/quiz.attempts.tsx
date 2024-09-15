import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const QuizAttempts = () => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const userI = await AsyncStorage.getItem("user");
        const isUser = JSON.parse(userI as any);
        const response = await axios.get(
          `${SERVER_URI}/api/v1/quiz/getAllAttempt/${isUser._id}`
        );
        const data = response.data.data;

        setAttempts(data); // Directly set the fetched data
      } catch (error) {
        console.error("Error fetching attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{
          flex: 1,
          alignItems: "center",
        }}
      />
    );
  }

  const handleSolutions = (id: string, quizId: string) => {
    router.push({
      pathname: "/(routes)/quiz/quiz.result",
      params: { attemptId: id, quizId: quizId },
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSolutions(item._id, item.quiz._id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.quizName}>{item.quiz?.name.slice(0, 25)}</Text>
        <Text style={styles.score}>Score: {item?.score}</Text>
      </View>

      <View style={styles.cardHeader}>
        <Text
          style={{
            fontSize: 12,
            color: "#888",
          }}
        >
          Attempted: {new Date(item.attemptDate).toLocaleDateString()}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#888",
          }}
        >
          {" "}
          {item.questions.length}Questions
        </Text>
        {/* <View style={styles.questions}>
        <View key={index} style={styles.question}>
        <Text>User Answer: {question.userAnswer || 'Unanswered'}</Text>
        <Text>Correct Answer: {question.correctAnswer.en}</Text>
        {item?.questions?.map((question, index) => (
          <Text>Is Correct: {question.isCorrect ? 'Yes' : 'No'}</Text>
        </View>
      ))}?? */}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={attempts}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>Nothing to see here...</Text>
        }
        keyExtractor={(item) => item?._id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    margin: 15,
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  quizName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  questions: {
    marginTop: 10,
  },
  question: {
    marginBottom: 10,
  },
});

export default QuizAttempts;
