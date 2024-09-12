import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const QuizBundleCard = ({ quizzes }) => {
  const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Quizzes
      </Text>
      {quizzes?.map((quiz: any) => (
        <TouchableOpacity
          key={quiz._id}
          style={styles.quizCard}
          onPress={() => {
            router.push({
              pathname: "/(routes)/quiz/quiz.details",
              params: { quizId: quiz._id },
            });
          }}
        >
          <Image
            source={{
              uri: !!quiz.image
                ? quiz.image
                : "https://img.freepik.com/free-vector/realistic-wooden-brown-judge-gavel_88138-139.jpg?size=626&ext=jpg&ga=GA1.1.1387862008.1722622005&semt=sph",
            }}
            style={styles.quizImage}
          />
          <View style={styles.quizInfo}>
            <View style={{ gap: 4, paddingHorizontal: 2 }}>
              <Text style={styles.itemTitle}>{quiz.name}</Text>
            </View>

            <View
              style={{
                marginTop: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Ionicons name="timer" size={20} />
                <Text style={styles.itemTitle}>
                  {convertSecondsToTime(quiz.timer)}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>
                Questions: {quiz.questions.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingBottom: 100,
  },
  quizCard: {
    backgroundColor: "#fff",
    // backgroundColor: "#f2eded",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  quizImage: {
    width: "20%",
    height: 70,
    borderRadius: 10,
  },
  quizInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 20,
    height: "95%",

    marginVertical: 10,
    borderRadius: 10,
    width: "85%",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});

export default QuizBundleCard;

// [{"__v": 4, "_id": "66b865553676f9484bc9e7f7", "category": "", "createdAt": "2024-08-11T07:16:37.667Z", "isListed": false, "isPaid": false, "isPartOfBundle": true, "name": "arhshs", "price": 0, "questions": ["66b865683676f9484bc9e7f9", "66b88dc42be8db03b3158219", "66b88f332be8db03b315822e", "66b88ff72be8db03b315823c"], "shortDescription": "1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",1.\\tCriminal Law (Amendment) Act 2013, came into force\",", "timer": 182, "updatedAt": "2024-08-11T10:18:31.426Z"}, {"__v": 0, "_id": "66b82c6bce2a4ad6216b943b", "category": "", "createdAt": "2024-08-11T03:13:47.325Z", "image": "https://picsum.photos/200", "isListed": false, "isPaid": false, "isPartOfBundle": true, "name": "krishna", "price": 0, "questions": [], "shortDescription": "ipc", "timer": 7200, "updatedAt": "2024-08-11T03:13:47.325Z"}, {"__v": 1, "_id": "66b7b3f739e79b74b2aaa64e", "category": "", "createdAt": "2024-08-10T18:39:51.378Z", "isListed": false, "isPaid": false, "isPartOfBundle": true, "name": "Test Quize", "price": 0, "questions": ["66b7b44239e79b74b2aaa650"], "shortDescription": "Test Quiz Description", "timer": 61, "updatedAt": "2024-08-10T18:41:07.122Z"}, {"__v": 1, "_id": "66b7a24d5e0917b922872180", "category": "", "createdAt": "2024-08-10T17:24:29.413Z", "isListed": false, "isPaid": false, "isPartOfBundle": true, "name": "ghhbciduw", "price": 0, "questions": ["66b7a2635e0917b922872182"], "shortDescription": "bjdeiuwco", "timer": 13200, "updatedAt": "2024-08-10T17:24:51.731Z"}]
