import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewComponent,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { getCourseList } from '../../Services';
// import SubHeading from '../SubHeading';
import Colors from "../../utils/Colors";
import CourseItem from "./CourseItem";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { router } from "expo-router";
const sampleItem = [
  {
    id: 1,
    name: "React Native Course",
    banner: {
      url: "https://example.com/banner1.jpg",
    },
    chapters: [
      { title: "Introduction" },
      { title: "Getting Started" },
      { title: "Components" },
    ],
    time: 10,
    price: 0,
  },
  {
    id: 2,
    name: "Advanced React Native",
    banner: {
      url: "https://example.com/banner2.jpg",
    },
    chapters: [
      { title: "Advanced Components" },
      { title: "State Management" },
      { title: "Performance Optimization" },
    ],
    time: 15,
    price: 50,
  },
  {
    id: 3,
    name: "React Native with Redux",
    banner: {
      url: "https://example.com/banner3.jpg",
    },
    chapters: [
      { title: "Introduction to Redux" },
      { title: "Redux with React Native" },
      { title: "Advanced Redux" },
    ],
    time: 12,
    price: 30,
  },
];
export default function CourseList({ level }) {
  const [courseList, setCourseList] = useState([]);
  const [courses, setCourses] = useState<CoursesType[]>([]);
  const [originalCourses, setOriginalCourses] = useState<CoursesType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    setCourseList(sampleItem);
    // getCourseList(level).then((res) => {
    //     setCourseList(res?.courses);
    // });
  };
  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-layout/Categories`)
      .then((res) => {
        // setcategories(res.data.layout.categories);
        fetchCourses();
      })
      .catch((error) => {});
  }, []);

  const fetchCourses = () => {
    axios
      .get(`${SERVER_URI}/get-courses`)
      .then((res: any) => {
        setCourses(res.data.courses);
        setOriginalCourses(res.data.courses);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <View
      style={{
        paddingBottom: 30,
        paddingTop: 10,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 24,
            color: "#000",
            margin: 10,
          }}
        >
          {level.toUpperCase()} Courses
        </Text>
      </View>
      <FlatList
        data={courseList}
        key={courseList?.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "(routes)/course-details",
                params: { item: JSON.stringify(item) },
              });
            }}
          >
            <CourseItem item={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
