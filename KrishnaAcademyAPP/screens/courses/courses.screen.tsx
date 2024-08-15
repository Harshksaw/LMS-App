import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import Loader from "@/components/loader/loader";
import { LinearGradient } from "expo-linear-gradient";
import CourseCard from "@/components/cards/course.card";
import Header from "@/components/header/header";
import React from "react";
import CourseList from "@/components/Course/CourseList";

export default function CoursesScreen() {
  const [courses, setCourses] = useState<CoursesType[]>([]);
  const [originalCourses, setOriginalCourses] = useState<CoursesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setcategories] = useState([]);
  const [activeCategory, setactiveCategory] = useState("All");
  const [forceHideLoader, setForceHideLoader] = useState(false);



  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleCategories = (e: string) => {
    setactiveCategory(e);
    if (e === "All") {
      setCourses(originalCourses);
    } else {
      const filterCourses = originalCourses.filter(
        (i: CoursesType) => i.categories === e
      );
      setCourses(filterCourses);
    }
  };

  return (
    <View>


      {loading ? (
        <Loader />
      ) : (
        // <LinearGradient
        //   colors={["#FFFF", "#FFFF"]}
        //   style={{ paddingTop: 40, height: "100%" }}
        // >

        
        <View>
           <View style={styles.overlay}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>
          <View style={{ padding: 0 }}>
            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor:
                activeCategory === "All" ? "#ED3137" : "#000",
                borderRadius: 20,
                paddingHorizontal: 20,
                marginRight: 5,
                }}
                onPress={() => handleCategories("All")}
                >
                <Text
                style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
                >
                All
                </Text>
                </TouchableOpacity>
                
              {categories?.map((i: any, index: number) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor:
                      activeCategory === i?.title ? "#ED3137" : "#000",
                    borderRadius: 50,
                    paddingHorizontal: 20,
                    marginHorizontal: 15,
                  }}
                  onPress={() => handleCategories(i?.title)}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
                  >
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView> */}
          </View>

          <ScrollView
            style={{
              marginHorizontal: 10,
              gap: 5,
              marginBottom: 150,
              marginTop: 10,
            }}
          >
            {/* {courses?.map((item: CoursesType, index: number) => (
                <CourseCard item={item} key={index} />
              ))} */}
            <CourseList level={"item"} />
            <CourseList level={"item"} />

            <CourseList level={"item"} />
            <CourseList level={"item"} />
          </ScrollView>
          {/* {courses?.length === 0 && (
              <Text
                style={{ textAlign: "center", paddingTop: 50, fontSize: 18 }}
              >
                No data available!
              </Text>
              
            )} */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 13,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent gray background
  },
  comingSoonText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontVariant: ['small-caps'],

    color: 'white',
  },
});