import PieCharts from "@/components/charts/PaiCharts";
import { SERVER_URI } from "@/utils/uri";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const calculateTotals = (data) => {
  const totalQuestions = data.length;
  const correctAnswers = data.filter((item) => item.isCorrect).length;
  const incorrectAnswers = data.filter(
    (item) => !item.isCorrect && !item.unanswered
  ).length;
  const unansweredQuestions = data.filter((item) => item.unanswered).length;

  const arrayOfObjects = [
    { color: "red", bgColor: "white", title: "total", alpha: totalQuestions },
    {
      color: "blue",
      bgColor: "#009FFF",
      title: "correct",
      alpha: correctAnswers,
    },
    {
      color: "green",
      bgColor: "#FFA5BA",
      title: "incorrect",
      alpha: incorrectAnswers,
    },
    {
      color: "green",
      bgColor: "#BDB2FA",
      title: "unanswered",
      alpha: unansweredQuestions,
    },
  ];
  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    arrayOfObjects,
  };
};

export default function quizresult() {
  const route = useRoute();
  const { attemptId, quizId } = route.params as any;
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      // TODO: HARSH
      router.push("/(tabs)");
      return true; // Prevent the default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener on unmount
  }, [navigation]);

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const response = await axios.get(
        `${SERVER_URI}/api/v1/quiz/getAttemptQuiz/${
          attemptId || "66bc38010eb297c55055ed4b"
        }`
      );
      const data = response.data;
      setQuestions(data.data.questions);
    };

    const leaderBoard = async () => {
      const response = await axios.get(
        `${SERVER_URI}/api/v1/quiz/getLeaderboard/${
          attemptId || "66bc38010eb297c55055ed4b"
        }`
      );
      const data = response.data;
    };

    fetchAttempts();
    leaderBoard();
  }, []);

  const {
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    arrayOfObjects,
  } = calculateTotals(questions);

  const pieData = [
    {
      value: correctAnswers,
      color: "#009FFF",
      gradientCenterColor: "#006DFF",
      text: "Correct",
      title: "Correct answers",
    },
    {
      value: incorrectAnswers,
      color: "#FFA5BA",
      gradientCenterColor: "#FF7F97",
      text: "Incorrect",
      title: "Incorrect answers",
    },
    {
      value: unansweredQuestions,
      color: "#BDB2FA",
      gradientCenterColor: "#8F80F3",
      text: "Unanswered",
      title: "unanswers",
    },
  ];

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 2,
        flexDirection: "column",
        gap: 15,
        backgroundColor: "lightred",
        paddingTop: 20,
        paddingBottom: 0,
      }}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: "100%" }}
      >
        <FlatList
          data={arrayOfObjects}
          numColumns={3}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                margin: 8,
                borderRadius: 14,
                height: 100,
                borderWidth: 1,
                backgroundColor: item.bgColor,
                paddingBottom: 10,
              }}
            >
              <Text>{item.alpha}</Text>
              <Text>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item.title}
        />
      </ScrollView>

      <View style={{ flex: 1, backgroundColor: "red" }}>
        <PieCharts pieData={pieData} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 0,
          marginTop: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "white",
            borderWidth: 1,
            padding: 16,
            borderRadius: 4,
          }}
          onPress={() => {
            router.push({
              pathname: "/(routes)/quiz/quiz.details",
              params: { quizId: quizId },
            });
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "black",
            }}
          >
            Re-attempt Test
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(routes)/quiz/quiz.solution",
              params: { attemptId: attemptId },
            });
          }}
          style={{
            flex: 1,
            backgroundColor: "#f44336",
            padding: 16,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            Solutions
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
