
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const quizsolution = () => {
  const [userSelections, setUserSelections] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<any[]>([]);

  const [quizData, setQuizData] = useState<any>([]);

  const [questions, setQuestions] = useState<any[]>([]);
  const route = useRoute();
  const { attemptId } = route.params as any;
  console.log("🚀 ~ quizsolution ~ attemptId:", attemptId)

  // const quizDetails = JSON.parse(questionData)

  useEffect(() => {

    const fetchAttempts = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getAttemptQuiz/${attemptId || "66bc38010eb297c55055ed4b"}`);
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




  const renderItem = ({ item,index }) => {

    // const data = JSON.stringify(item)
    const data = item
    // console.log("🚀 ~ quizsolution ~ data:", data)
    // Check if item and item.question exist
    if (!data || !data.question) {
      return <ActivityIndicator size="large" color="#0000ff" />
    }

    const { question, options } = data?.question;
    // console.log("🚀 ~ renderItem ~ options:", options)

    // Check if question and options exist
    if (!question || !options) {
      return <ActivityIndicator size="large" color="#0000ff" />
    }
    const isCorrect = item.isCorrect;
    const icon = isCorrect ? <FontAwesome name="check" size={24} color="green" /> : <FontAwesome name="times" size={24} color="red" />;



    return (
      <View style={styles.questionContainer}>
        {/* {console.log(typeof options)} */}

        <Text style={styles.questionText}>{index +1}. {question.en}</Text>
        <View style={{
          flexDirection:'column',
          justifyContent:'center',
          // alignItems:'center',
          paddingBottom:20,
          gap:5,
          marginTop:10,
          paddingHorizontal:10,
          paddingLeft:10,
        }}>

        
        {Object.keys(options).map((key, index) => {
          // { console.log(key, item.userAnswer, item.correctAnswer) }
          const option = options[key];
          let optionStyle = styles.optionText;
          let icon = null;

          // Check if option exists
          if (!option) {
            return null;
          }

          if (option.en == item.userAnswer) {
            console.log("🚀 ~ renderItem", item.userAnswer)
            optionStyle = styles.userAnswerText;
          }
          if (option.en == item.correctAnswer) {
            console.log("🚀 ~ renderItem ~ key", key)
            optionStyle = styles.correctAnswerText;
          }

          console.log(`Option ${key}: ${option.en} - ${optionStyle}`);

          if (item.isCorrect) {
            icon = <FontAwesome name="check" size={24} color="green" />;
          } else {
            icon = <FontAwesome name="times" size={24} color="red" />;
          }
          return (
            <View style={{
              flexDirection: 'row',
              // justifyContent: 'space-between',
              // alignItems: 'center',
              // backgroundColor: 'red',
              padding: 5,
              borderRadius: 10,
              marginVertical: 5,
              backgroundColor: 'rgb(240, 236, 236)',
            }}>


              <Text key={key} style={optionStyle}>
              {`${index + 1}. ${option.en}`}

              </Text>

            </View>
          );
        })}
        </View>
        <View style={{
          position: 'absolute',
          right: 20,
          top: 10,
        }}>
          {icon}
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 20,
        marginTop: 20,
        paddingBottom:80,
      }}
    >

      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
      }}>Quiz Solution</Text>
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

    borderRadius: 20,

    marginBottom: 20,
    backgroundColor: 'rgb(234, 228, 228)',
    padding: 10,
    paddingHorizontal: 20,

    minHeight: 80,
  },
  questionText: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingRight: 20,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
  },
  userAnswerText: {
    // tintColor: 'red',
    // backgroundColor: 'red',
    fontSize: 16,
    color: 'red',

  },
  correctAnswerText: {
    // tintColor: 'green',
    // backgroundColor: 'green',
    fontSize: 16,
    color: 'green',
  },
});