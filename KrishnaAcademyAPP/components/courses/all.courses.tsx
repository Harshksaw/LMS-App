import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import CourseCard from "@/components/cards/course.card";

export default function AllCourses() {
  const dummyJson = [
    {
      _id: "5f7399d9597c3438287399da",
      courseName: "Introduction to Programming",
      courseDescription: "This course covers the basics of programming",
      instructor: "5f7399d9597c3438287399d9",
      price: 19.99,
      thumbnail: "https://picsum.photos/200",
      tag: ["programming", "beginner"],
      category: "5f7399d9597c3438287399d8",
      studentsEnrolled: [
        "5f7399d9597c3438287399d7",
        "5f7399d9597c3438287399d6",
      ],
      instructions: ["Follow the instructions carefully"],
      status: "Published",
      createdAt: "2021-01-01T00:00:00.000Z",
    },
    {
      _id: "5f7399d9597c3438287399db",
      courseName: "Data Structures and Algorithms",
      courseDescription:
        "This course covers advanced data structures and algorithms",
      instructor: "5f7399d9597c3438287399d9",
      price: 29.99,
      thumbnail: "https://picsum.photos/200",
      tag: ["data structures", "algorithms"],
      category: "5f7399d9597c3438287399d8",
      studentsEnrolled: [
        "5f7399d9597c3438287399d5",
        "5f7399d9597c3438287399d4",
      ],
      instructions: ["Complete the exercises carefully"],
      status: "Published",
      createdAt: "2021-01-02T00:00:00.000Z",
    },
    {
      _id: "5f7399d9597c3438287399dc",
      courseName: "Web Development",
      courseDescription: "This course covers the basics of web development",
      instructor: "5f7399d9597c3438287399d9",
      price: 14.99,
      thumbnail: "https://picsum.photos/200",
      tag: ["web development", "beginner"],
      category: "5f7399d9597c3438287399d8",
      studentsEnrolled: [
        "5f7399d9597c3438287399d3",
        "5f7399d9597c3438287399d2",
      ],
      instructions: ["Follow the instructions carefully"],
      status: "Draft",
      createdAt: "2021-01-03T00:00:00.000Z",
    },
    {
      _id: "5p0399d9597c73382s73c9rc",
      courseName: "Machine Learning",
      courseDescription: "This course covers the basics of machine learning",
      instructor: "5f7399d9597c3438287399d9",
      price: 39.99,
      thumbnail: "https://picsum.photos/200",
      tag: ["machine learning", "beginner"],
      category: "5f7399d9597c3438287399d8",
      studentsEnrolled: [
        "5f7399d9597c3438287399d1",
        "5f7399d9597c3438287399d0",
      ],
      instructions: ["Complete the exercises carefully"],
      status: "Published",
      createdAt: "2021-01-01T00:00:00.000Z",
    },
  ];
  const [courses, setCourses] = useState<CoursesType[]>(dummyJson);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-courses`)
      .then((res: any) => {
        setCourses(res.data.courses);
      })
      .catch((error) => {});
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
    Nunito_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#000000",
            fontFamily: "Raleway_700Bold",
          }}
        >
          Popular courses
        </Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/courses")}>
          <Text
            style={{
              fontSize: 15,
              color: "#ED3137",
              fontFamily: "Nunito_600SemiBold",
            }}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>
      {/* <FlatList
        ref={flatListRef}
        data={courses}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <CourseCard item={item} />}
      /> */}
      <FlatList
        ref={flatListRef}
        data={courses}
        contentContainerStyle={{ width: "100%", gap: 0, paddingHorizontal: 16 }}
        columnWrapperStyle={{ gap: 8 }}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <CourseCard item={item} />}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //   />
        // }
      />
    </View>
  );
}
