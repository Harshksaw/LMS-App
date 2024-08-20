import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Modal,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import React from "react";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventScreenCapture } from 'expo-screen-capture';

// const renderItem = ({ item }) => {
//   // console.log(item, "item");
//   return (
//     <TouchableOpacity
//       style={{
//         backgroundColor: "#fff",
//         borderWidth: 1,
//         borderColor: "#d2cccc",

//         // marginBottom: 10,
//         minWidth: "45%",
//         maxWidth: "50%",
//         marginHorizontal: 5,
//         height: 250, // Ensure this is set to control the size
//         flexDirection: "column",
//         justifyContent: "space-between",
//         alignItems: "center",
//         gap: 4,

//         padding: 4,
//         borderRadius: 20,
//         overflow: "hidden", // Ensure the borderRadius effect applies to children
//       }}
//       onPress={() =>
//         router.push({
//           pathname: "/(routes)/quiz/quiz.details",
//           params: { quizId: item._id },
//         })
//       }
//     >
//       <View
//         style={{
//           position: "absolute",
//           top: 12,
//           left: 12,
//           justifyContent: "flex-start", // Aligns children vertically to the top
//           alignItems: "flex-start", // Aligns children horizontally to the left
//           backgroundColor: "green", // Dark background color
//           borderRadius: 10,
//           alignSelf: "flex-start",
//           padding: 5, // Add padding for better appearance
//         }}
//       >
//         <Text
//           style={{
//             color: "white", // White text color
//             fontSize: 14,
//             // fontWeight: "bold",
//             textAlign: "left", // Align text to the left
//           }}
//         >
//           R100
//         </Text>
//       </View>

//       <View
//         style={{
//           backgroundColor: "#EBEBEB",
//           borderRadius: 10,
//           width: 150,
//           flexDirection: "row",
//           justifyContent: "center",
//           alignItems: "center",
//           // marginBottom: 10,
//           marginTop: 48,
//         }}
//       >
//         {!item.image ? (
//           <ImageBackground
//             source={{ uri: "https://picsum.photos/seed/picsum/200/300" }}
//             style={{
//               width: "100%",
//               height: "100%", // Adjusted to fill the TouchableOpacity
//               // justifyContent: "center",

//               // alignItems: "center",
//             }}
//             imageStyle={{
//               borderRadius: 20, // Apply borderRadius to the image itself
//             }}
//           />
//         ) : (
//           <Ionicons
//             name="image-outline"
//             size={140}
//             color="red"
//             style={
//               {
//                 // marginVertical: 10,
//               }
//             }
//           />
//         )}
//       </View>
//       <View
//         style={{
//           backgroundColor: "#fff",
//           // marginTop: -15,
//           width: "100%",
//           marginVertical: 10,
//           flexDirection: "column",
//           justifyContent: "flex-start",
//           alignItems: "flex-start",
//           paddingHorizontal: 10,

//           // position: "absolute",
//           // bottom: 0,
//           // left: 0,
//           // right: 0,
//           // height: 80, // Adjust the height for your shadow effect
//           // backgroundColor: "rgba(0,0,0,0.4)", // Semi-transparent view for shadow effect
//           // flexDirection: "column",
//           // justifyContent: "flex-start",
//           // alignItems: "center",
//           // gap: 10,
//         }}
//       >
//         <Text
//           style={{
//             // color: "white",
//             fontSize: 16,
//             fontWeight: "600",
//             textAlign: "left",
//           }}
//         >
//           {item.name}
//         </Text>
//         <Text
//           style={{
//             // color: "white",
//             fontSize: 12,
//             fontWeight: "condensed",
//             textAlign: "left",
//           }}
//         >
//           {item.shortDescription.slice(0, 10)}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

function secondsToHms(seconds) {
  const pad = (num, size) => ("00" + num).slice(-size);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secondsLeft, 2)}`;
}


export default function QuizScreen() {
  usePreventScreenCapture();
  const route = useRoute();
  const { quizId } = route.params;



  console.log("🚀 ~ index ~ BundleData:", quizId)
  const [language, setLanguage] = useState<"en" | "hin">("en");
  const [quizDetails, setQuizDetails] = React.useState<any>(null);

  const [count, setCount] = useState<number>(0);
  const [answered, setAnswered] = useState<number>([]);



  const [questions, setQuestions] = useState<any[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<any[]>([]);

  const [userScore, setUserScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [getResultClicked, setGetResultClicked] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);
  const [scoreModalVisible, setScoreModalVisible] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(280)).current;
  const [timeUp, setTimeUp] = useState(false);
  const [visible, setVisible] = useState(false);
  const [remainderTime ,setRemainderTime] = useState(0)
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(questions.length);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const attempted = questions.filter(q => q.answered).length;
    const unanswered = questions.filter(q => !q.answered).length;
    const saved = questions.filter(q => q.saved).length;

    setAttemptedCount(attempted);
    setUnansweredCount(unanswered);
    setSavedCount(saved);
  }, [questions]);


  const handleMenuPress = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hin" : "en");
  };
  const [quizzes, setQuizzes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);
  console.log(quizId)
  console.log("hello");
  useEffect(() => {
    const getQuizDetails = async () => {
      console.log('entered')
      try {
        const res = await axios.get(
          `${SERVER_URI}/api/v1/quiz/getQuizById/${quizId}`
        );
        console.log("🚀 ~ getQuizDetails ~ res:", res)

        const quizData = res?.data?.data;
        setQuizDetails(quizData);
       

        setRemainingTime(quizData.timer);


        setQuestions(quizData.questions);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }


      // console.log(quizData);

    };

    getQuizDetails();
  }, [quizId,refreshing]);
  // console.log(questions, "questions --------------------")

  const handleSave = () => {

    if (count < questions.length - 1) {
      if (questions[count].correctAnswer[language] === userAnswer) {
        setUserScore((userScore) => userScore + 1);
      }
      setCount((count) => count + 1);
      setSelectedBox(null);
      // setTime(20);
    } else {
      setGetResultClicked(true);
      console.log("userScore", userScore);
        fetchAttempts()
      setScoreModalVisible(true);
    }
    console.log("userScore", userScore, count);
  };

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const fetchAttempts = async () => {

      
    const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getAttemptQuiz/${attemptId || "66bc38010eb297c55055ed4b"}`);
    const data = response.data
    console.log("🚀 ~ fetchAttempts ~ data:", data.data.questions)
    setQuestions(data.data.questions);
    
    
  }


  const toggleColor = (index: number | null, count: number) => {
    const optionsArray = Object.values(questions[count]?.options);
    console.log(optionsArray[index][language], "----l", index);
    if (index === null) return;
    setSelectedBox(index);
    setAnswered((prev) => [...prev, count]);
    console.log(optionsArray[index][language], "----l");
    setUserAnswer(optionsArray[index][language]);
     setUserAnswers(prevAnswers => [...prevAnswers, optionsArray[index][language]]);

  };


  // console.log(userAnswers, "--userAnswer");

  const handleSkip = () => {
    console.log("skip", count);
    if (count >= 1) {
      setCount((count) => count - 1);
      setSelectedBox(null);
      // setTime(15);
    }

  };


  const getOptionsArray = (quizData, language) => {
    if (!quizData || !quizData.options) {
      return [];
    }
    return Object.entries(quizData.options).map(([key, value]) => ({
      key,
      value: value[language],
    }));
  };

  // console.log(questions[count + 1]?.question[language], "quizDetails", quizDetails?.questions[0].options);
  // return (<></>)correctAnswer[language]
  const currentQuestion = questions[count]?.question[language]
  const currentOptions = getOptionsArray(quizDetails?.questions[count], language);

  // console.log("currentOptions", currentOptions);



  // const handleMenuPress = () => {
  //   setIsOpen((prev) => !prev);    Animated.timing(translateX, {
  //     toValue: isOpen ? 0 : 280,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // };




  const handleSaveQuestion = async () => {

    try {
      const isUser = await AsyncStorage.getItem("user");
      const user = JSON.parse(isUser);
      console.log("🚀 ~ QuizScreen ~ user", questions[count]._id)

      const res = await axios.post(`${SERVER_URI}/api/v1/quiz/saveUserQuestion`,{
        userId : user._id , questionId : questions[count]._id
      })
      if(res.status === 201){

        
        Toast.show("Saved question");
        setSavedQuestions((prev) => [...prev,questions[count]._id ])
        setRefreshing((prev) => !prev)
      }else{
        Toast.show("Error saving question");
      }


    } catch (error) {
      Toast.show("Error saving question");
    }
  };
  // console.log(savedQuestions, 'saved questions')


  if (loading) {
    return <ActivityIndicator size="large" color="red" style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }} />;
    // return <CustomLoader name="2-curves" color="red" />;
  }

  const handleTimeup = async () => {
    try {
      Toast.show("Time up");
      // setTimeUp(true);
      setScoreModalVisible(true);
    } catch (error) {
      Toast.show("Error saving question");
    }
  };



  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return score + (userAnswer === question.correctAnswer.en || userAnswer === question.correctAnswer.hin  ? 1 : 0);
    }, 0);
  };



  const handleSubmitQuiz = async () => {



      const userI = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(userI);
      // console.log("🚀 ~ QuizScreen ~ isUser:", isUser)


      Toast.show("Submitting attempt...",{
        type: "success",
        duration: 3000,

      });
      // console.log(userAnswers, "userAnswers")

      const attemptData = {
        user: isUser._id, // Assuming you have the current user's ID
        quiz: quizId , // Assuming you have the current quiz's ID
        score: calculateScore(), // Function to calculate the score
        questions: questions.map((question, index) => ({
    question: question._id,
    userAnswer: userAnswers[index], // Get the user answer for the current question
    correctAnswer: question.correctAnswer.en,
    isCorrect: userAnswers[index] === question.correctAnswer.en || userAnswers[index] === question.correctAnswer.hin,
  }))
      };
      // console.log("🚀 ~ handleSubmitQuiz ~ attemptData:", attemptData)

      
      try {
      // Make the API call to submit the attempt

      // Make the API call to submit the attempt using axios
      const response = await axios.post(`${SERVER_URI}/api/v1/quiz/attempt-quiz`, attemptData
       );
      // console.log("🚀 ~ handleSubmitQuiz ~ response:", response)

      // Handle the response
      if (response.status === 201) {
        console.log('Attempt submitted successfully:', response.data._id);

        router.push({
          pathname: "/(routes)/quiz/quiz.result",
          // pathname: "/(routes)/quiz/quiz.solution",
          // params: { quizId: quizId },
          params: { attemptId: response.data._id,  quizId: quizId  },
        })

      } else {
        console.error('Error submitting attempt:', response.data);
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      // Optionally, show an error message to the user
    }






   

  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // backgroundColor:'red',
        padding: 12,
      }}
    >




     {/* TODO: exclude white view to close the modal Modal  */}
        {visible && (
        <Modal
          transparent={true}
          onRequestClose={handleClose}
        >
          <TouchableOpacity
            style={styles.overlay}
            onPress={handleClose}
          >
            <View style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    padding: 20,
    transform: [{ translateX: visible ? 0 : Dimensions.get('window').width * 0.7 }],
  }}>

<View style={{width: 260, height:"88%", backgroundColor: 'white', alignSelf: 'flex-end', marginTop:100, padding: 12, marginRight:-16}}>
  <Text style={{marginTop: 4, marginBottom: 4, fontSize: 16, position: 'absolute', right:16, top:12}}>X</Text>
  <View style={{gap:8 , alignItems: 'flex-start', marginHorizontal: 16, marginTop: 16, marginBottom: 8}}>
    <View style={{gap:8, flexDirection: 'row', alignItems: 'center'}}>
      <View style={{backgroundColor: '#66cc00', height: 12, width: 12, borderRadius: 40}}  />
      <Text>answered</Text>
    </View>
    <View style={{gap:8, flexDirection: 'row', alignItems: 'center'}}>
      <View style={{backgroundColor: '#ccc', height: 12, width: 12, borderRadius: 40}} />
      <Text>unAnswered</Text>
    </View>
  </View>
  <FlatList
  showsVerticalScrollIndicator={false}
    data={questions}
    numColumns={4} // 5 columns per row
    renderItem={({item, index}) => (
      <TouchableOpacity style={styles.menuItem} onPress={() => {
        setCount(index)
        setVisible(false)
      }}>
        
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: answered.includes(index) ? '#66CC00' : '#ccc', // conditional color
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text>{index + 1}</Text>
        </View>
      </TouchableOpacity>
    )}
    keyExtractor={(item, index) => index.toString()}
  />
</View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      <View
        style={{
          //  backgroundColor:'red',
        }}
      >
        {/* {  -- top part including timer, submit, toggle and hambuger  --} */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CountdownCircleTimer
              isPlaying={!scoreModalVisible}
              duration={remainingTime}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[7, 5, 2, 0]}
              size={50}
              strokeWidth={2}
              onComplete={() => {
                handleTimeup();
              }}
              
            >
              {({ remainingTime }) => (
          
                <Text style={{
                  fontSize:10
                }}> {secondsToHms(remainingTime)}
                
                {
                scoreModalVisible && setRemainderTime(remainingTime)
              }</Text>
                
              )}
             
            </CountdownCircleTimer>
          </View>

          {/* //submit */}

          <View
            style={{
              flexDirection: "column",

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setScoreModalVisible(true)}
              style={{
                borderRadius: 20,
                backgroundColor: "red",
                width: 80,
                height: 40,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        {/* <View
          style={{ width: "100%", height: 1, backgroundColor: "#D3D4DB" }}
        /> */}

      </View>

      <View style={{ width: "100%", height: 1, backgroundColor: "#D3D4DB" }} />

      {/* {  -- Questions mapping  --} */}
      <View
        // stickyHeaderIndices={[0]}
        style={{
          flex: 1, marginTop: 12

          // justifyContent: "flex-end",
        }}
      // showsVerticalScrollIndicator={false}
      >

        <View style={{ backgroundColor: "white" , padding:5}}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* {left} */}
            <View style={{ flexDirection: "row", paddingVertical: 4 }}>
              <Text style={{  fontSize: 18,
                  color: "black",
                  fontWeight: "800",
                  alignSelf: "center" }}>{`Q.${count + 1}`}</Text>
              <Text
                style={{
                  fontSize: 18,
                  color: "black",
                  fontWeight: "800",
                  alignSelf: "center",
                  marginLeft: 4,
                }}
              >
                / {questions.length}
              </Text>
            </View>
            {/* {right} */}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Animated.View
                // style={{
                //   // position: "absolute",
                //   flex: 1,
                //   backgroundColor: "#e2e2e2",
                //   zIndex: 99,
                //   height: 740, //TODO: unjust to screen higth as screen-top part later on
                //   width: 260,
                //   // top: 6,
                //   // right: -12,
                //   transform: [{ translateX }],
                // }}
                >
                  <TouchableOpacity style={styles.button} onPress={handleMenuPress}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity onPress={handleSaveQuestion}>
                  <MaterialCommunityIcons
                    style={{ alignSelf: "center" }}
                    name={ savedQuestions.includes(questions[count]._id ) ? "bookmark" : "bookmark-outline"}
                    size={35}
                    color="#d7f776"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{
          marginTop: 20, flex: 1,


          flexDirection: "column",

        }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* //TODO */}
            <Text style={{ fontWeight: "800" }}>
              {"SECTION A : ENGLISH LANGUAGE"}
            </Text>

            <TouchableOpacity
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                backgroundColor: "red",
                width: 80,
                alignItems: "center",
              }}
              onPress={toggleLanguage}
            >
              <Text style={{ fontWeight: "800", fontSize: 12, color: "white" }}>
                {language === "en" ? "English" : "Hindi"}
              </Text>
            </TouchableOpacity>


          </View>

          <View
            style={{
              flex: 1,
              // backgroundColor:'red',
              flexDirection: "column",
              // justifyContent: "space-between",
              // paddingBottom: 15,
            }}
          >

            <ScrollView
            showsVerticalScrollIndicator={false}
              style={{
                flex: 1,
                // backgroundColor: 'pink',
                minHeight: 250,
                // maxHeight: 250,
              }}
            >


              <Text
                style={{
                  marginTop: 16,
                  fontSize: 15,
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "gray",
                }}
              >

                {/* {currentQuestion.replace(/[\t\n]/g, " ")} */}
                {String(currentQuestion).replace(/[\t]/g, "")}
                {/* {console.log(      {String(currentQuestion).replace(/[\t]/g, " ")})} */}
              </Text>



{/* Questions */}
              <View style={{  marginTop: 12,marginBottom:30,paddingBottom:30, padding: 12,minHeight:200 }}>
                {currentOptions.map((option, index) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 5,
                      backgroundColor: "#ffffff",
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: selectedBox === index ? "#f97316" : "#e2e2e2",
                      width: "100%",
                    }}
                    key={index}
                    onPress={() => toggleColor(index, count)}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        textAlign: "left",
                        maxWidth: 280
                      }}
                    >
                      {option.value}
                    </Text>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: selectedBox === index ? "black" : "gray",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedBox === index ? (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 6,
                            backgroundColor: "black",
                          }}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>






{/* {button} */}
            
            </ScrollView>
            <View
                style={{
                // position: "absolute",
                // bottom: 0,
                marginTop: 12,
                marginBottom  :20,
                  // flex: 1, justifyContent: 'flex-end', marginTop: 50
                }}
              >
                {getResultClicked ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setScoreModalVisible(true)}
                      // disabled={true}
                      style={{
                        backgroundColor: "#d1d5db",
                        padding: 16,
                        borderRadius: 20,
                        width: "66%",
                        flexDirection: "column",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          textAlign: "center",
                        }}
                      >
                        Your score: {userScore}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "green",
                          textAlign: "right",
                        }}
                      >
                        View Result
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      marginTop: 12,
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // position: "absolute",
                      // bottom: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={handleSkip}
                      style={{
                        backgroundColor: "white",
                        paddingVertical: 12,
                        paddingHorizontal: 18,
                        borderRadius: 8,
                        width: "auto",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "800",
                          fontSize: 14,
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        {" << PREVIOUS"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSave}
                      style={{
                        backgroundColor: "red",
                        paddingVertical: 12,
                        paddingHorizontal: 18,
                        borderRadius: 8,
                        width: "33%",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "800",
                          fontSize: 14,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        {count === questions.length - 1 ? "Get Result" : "NEXT >>"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

            {/* <ScrollView
              style={{
                // position: "absolute",
                // bottom: 0,
                flex: 1,

                // flexDirection: "column",
                // justifyContent: "space-between",
              }}
            > */}


            
            {/* </ScrollView> */}




          </View>

        </View>

      </View>

      <Modal
        transparent={true}
        visible={scoreModalVisible}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              paddingHorizontal: 12,
              paddingVertical: 18,
              backgroundColor: "white",
              borderRadius: 8,
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "800", textAlign: "left" }}
            >
              Score Card
            </Text>
            <View style={{ paddingHorizontal: 24, gap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "#e2e2e2",
                  borderBottomWidth: 1,
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "row", gap: 3 }}>
                  <MaterialCommunityIcons
                    style={{ alignSelf: "center" }}
                    name="timer"
                    size={20}
                    color="black"
                  />
                  <Text style={{ fontSize: 14, color: "gray" }}>Time left</Text>
                </View>
                <Text style={{ fontSize: 14, color: "gray" }}>
                 {secondsToHms(remainderTime)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "#e2e2e2",
                  borderBottomWidth: 1,
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "row", gap: 3 }}>
                  <MaterialCommunityIcons
                    style={{ alignSelf: "center" }}
                    name="timer"
                    size={20}
                    color="black"
                  />
                  <Text style={{ fontSize: 14, color: "gray" }}>Answered</Text>
                </View>
                <Text style={{ fontSize: 14, color: "gray" }}>{attemptedCount}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "#e2e2e2",
                  borderBottomWidth: 1,
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "row", gap: 3 }}>
                  <MaterialCommunityIcons
                    style={{ alignSelf: "center" }}
                    name="timer"
                    size={20}
                    color="black"
                  />
                  <Text style={{ fontSize: 14, color: "gray" }}>
                    Unanswered
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: "gray" }}>{unansweredCount}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "#e2e2e2",
                  borderBottomWidth: 1,
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "row", gap: 3 }}>
                  <MaterialCommunityIcons
                    style={{ alignSelf: "center" }}
                    name="timer"
                    size={20}
                    color="black"
                  />
                  <Text style={{ fontSize: 14, color: "gray" }}>Saved</Text>
                </View>
                <Text style={{ fontSize: 14, color: "gray" }}>{savedCount}</Text>
              </View>
            </View>
            <Text style={{ alignSelf: "center" }}>
              You are submitting the quiz
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              {timeUp && <Text style={{ color: "red" }}>Time up</Text>}

              {!timeUp && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 4,
                  }}
                  onPress={() => setScoreModalVisible(false)}
                >
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: "#f44336",
                  padding: 10,
                  borderRadius: 4,
                }}
                onPress={() => handleSubmitQuiz()}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Yes, submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // menuContainer: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'white',
  //   padding: 20,
  //   transform: [{ translateX: visible ? 0 : Dimensions.get('window').width * 0.7 }],
  // },
  menu: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
