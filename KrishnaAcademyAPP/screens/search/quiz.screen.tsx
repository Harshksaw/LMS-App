import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";

import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import React from "react";
import Header from "@/components/header/header";

import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export const courseData = [
  {
    id: 'course1',
    name: 'React Native Basics',
image : 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
    description: 'Learn the basics of React Native and build your first mobile app.',
    price: 29.99,
    quizzes: [
      {
        id: 'quiz1',
        name: 'Introduction to React Native',
        questions: 10,
      },
      {
        id: 'quiz2',
        name: 'React Native Components',
        questions: 15,
      },
    ],
    studyMaterials: [
      {
        id: 'material1',
        title: 'React Native Documentation',
        link: 'https://reactnative.dev/docs/getting-started',
      },
      {
        id: 'material2',
        title: 'React Native Tutorial',
        link: 'https://www.tutorialspoint.com/react_native/index.htm',
      },
    ],
  },
  {
    id: 'course2',
    name: 'Advanced React Native',
image : 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
    description: 'Take your React Native skills to the next level with advanced concepts.',
    price: 49.99,
    quizzes: [
      {
        id: 'quiz3',
        name: 'State Management',
        questions: 20,
      },
      {
        id: 'quiz4',
        name: 'Performance Optimization',
        questions: 25,
      },
    ],
    studyMaterials: [
      {
        id: 'material3',
        title: 'State Management in React Native',
        link: 'https://reactnative.dev/docs/state-management',
      },
      {
        id: 'material4',
        title: 'Performance Optimization Techniques',
        link: 'https://www.reactnative.guide/optimizing-performance.html',
      },
    ],
  },
  {
    id: 'course3',
    name: 'React Native with Redux',
image : 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
    description: 'Learn how to integrate Redux with React Native for state management.',
    price: 39.99,
    quizzes: [
      {
        id: 'quiz5',
        name: 'Redux Basics',
        questions: 12,
      },
      {
        id: 'quiz6',
        name: 'Redux Middleware',
        questions: 18,
      },
    ],
    studyMaterials: [
      {
        id: 'material5',
        title: 'Redux Documentation',
        link: 'https://redux.js.org/introduction/getting-started',
      },
      {
        id: 'material6',
        title: 'Redux Middleware Tutorial',
        link: 'https://redux.js.org/advanced/middleware',
      },
    ],
  },
  {
    id: 'course4',
    name: 'React Native with Firebase',
image : 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
    description: 'Integrate Firebase with React Native for backend services.',
    price: 59.99,
    quizzes: [
      {
        id: 'quiz7',
        name: 'Firebase Basics',
        questions: 14,
      },
      {
        id: 'quiz8',
        name: 'Firebase Authentication',
        questions: 22,
      },
    ],
    studyMaterials: [
      {
        id: 'material7',
        title: 'Firebase Documentation',
        link: 'https://firebase.google.com/docs',
      },
      {
        id: 'material8',
        title: 'Firebase Authentication Guide',
        link: 'https://firebase.google.com/docs/auth',
      },
    ],
  },
];



// const renderItem = ({ item }) => {
//   console.log(item, "item");
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
//         gap:4,


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
//           R1001
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
//           backgroundColor:'#fff',
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
//           {/* {item.shortDescription.slice(0,10)} */}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

const renderCources = ({ item }) => {

  return (
    <TouchableOpacity
    style={{
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#d2cccc",

      // marginBottom: 10,
      minWidth: "45%",
      maxWidth: "50%",
      marginHorizontal: 5,
      height: 250, // Ensure this is set to control the size
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      gap:4,


      padding: 4,
      borderRadius: 20,
      overflow: "hidden", // Ensure the borderRadius effect applies to children
    }}
    onPress={() =>
      router.push({
        pathname: "/(routes)/quiz-bundle",
        params: { BundleId: item._id },
      })
    }
  >
    <View
      style={{

        position: "absolute",
        top: 12,
        left: 12,
        justifyContent: "flex-start", // Aligns children vertically to the top
        alignItems: "flex-start", // Aligns children horizontally to the left
        backgroundColor: "green", // Dark background color
        borderRadius: 10,
        alignSelf: "flex-start",
        padding: 5, // Add padding for better appearance
      }}
    >
      <Text
        style={{
          color: "white", // White text color
          fontSize: 12,
          // fontWeight: "bold",
          textAlign: "left", // Align text to the left
        }}
      >
      ₹{item?.price}
      </Text>
    </View>

    <View
      style={{
        backgroundColor: "#EBEBEB",
        borderRadius: 10,
        width: 150,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // marginBottom: 10,
        marginTop: 48,
      }}
    >

     
      {!item.image ? (
        <ImageBackground
          source={{ uri: item.image }}
          style={{
            width: "100%",
            height: "100%", // Adjusted to fill the TouchableOpacity
            // justifyContent: "center",

            // alignItems: "center",
          }}
          imageStyle={{
            borderRadius: 20, // Apply borderRadius to the image itself
          }}
        />
      ) : (
        <Ionicons
          name="image-outline"
          size={140}
          color="red"
          style={
            {
              // marginVertical: 10,
            }
          }
        />
      )}
    </View>
    <View
      style={{
        backgroundColor:'#fff',
        // marginTop: -15,
        width: "100%",
        marginVertical: 10, 
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 10,

        // position: "absolute",
        // bottom: 0,
        // left: 0,
        // right: 0,
        // height: 80, // Adjust the height for your shadow effect
        // backgroundColor: "rgba(0,0,0,0.4)", // Semi-transparent view for shadow effect
        // flexDirection: "column",
        // justifyContent: "flex-start",
        // alignItems: "center",
        // gap: 10,
      }}
    >
      <Text
        style={{
          // color: "white",
          fontSize: 16,
          fontWeight: "600",
          textAlign: "left",
        }}
      >
        {item.bundleName}

      </Text>
      <Text
        style={{
          // color: "white",
          fontSize: 12,
          fontWeight: "condensed",
          textAlign: "left",
        }}
      >
        {item.aboutDescription.slice(0,15)}
      </Text>
    </View>
  </TouchableOpacity>
  )


}
export default function QuizScreen() {
  const [quizzes, setQuizzes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  console.log("hello");
  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const res = await axios.get(`${SERVER_URI}/api/v1/Bundle/course-bundle`);
        setQuizzes(res.data.data);

        console.log(res.data.data,'get all quizes');
      } catch (error) {
        console.log(error);
      }
    };
    getQuizzes();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Place your data fetching logic here
    setTimeout(() => {
      // Simulate a network request
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor:'red',

      }}
    >



      <View
        style={{

          // marginHorizontal: 10,
          // backgroundColor: "red",

          flexDirection: "column",
          justifyContent: "center",
          // alignItems: "center",
          padding: 10,
          gap:10


          // height: "100%",
        }}
      >
        {/* <FlatList
          data={quizzes}
          renderItem={renderItem}
          contentContainerStyle={{ width: "100%", gap: 10,  }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        /> */}
        <FlatList
            data={quizzes}
          renderItem={renderCources}
          contentContainerStyle={{ width: "100%", gap: 10, backgroundColor:'lightgray' }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

</View>
  );
}