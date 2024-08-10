import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { courseData } from "@/screens/search/quiz.screen";

import { Ionicons } from "@expo/vector-icons";
import QuizCard from "@/components/quiz/quiz.bundlecard";
import StudyMaterialCard from "@/components/quiz/studymaterial";
import { useRoute } from "@react-navigation/native";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";

const { height, width } = Dimensions.get("window");

const description = `
This course provides an in-depth understanding of the subject matter. It covers various topics including the Indian Penal Code (IPC), the Code of Criminal Procedure (CrPC), and the Indian Evidence Act. The course is designed to help students grasp the fundamental principles of Indian law, with a focus on practical applications and case studies.

The course is divided into several modules, each focusing on a specific area of law:
- The first module covers the basics of the Indian legal system, including the structure of the judiciary and the roles of various legal professionals.
- Subsequent modules delve into more specialized topics, such as criminal law, civil law, and constitutional law.
- The first module covers the basics of the Indian legal system, including the structure of the judiciary and the roles of various legal professionals.
- Subsequent modules delve into more specialized topics, such as criminal law, civil law, and constitutional law.
- Subsequent modules delve into more specialized topics, such as criminal law, civil law, and constitutional law.
- Subsequent modules delve into more specialized topics, such as criminal law, civil law, and constitutional law.
- Subsequent modules delve into more specialized topics, such as criminal law, civil law, and constitutional law.

The course is divided into several modules, each focusing on a specific area of law:
        - The first module covers the basics of the Indian legal system, including the structure of the judiciary and the roles of various legal professionals.
        - Subsequent modules delve into more specialized topics, such as criminal law, civil law, and constitutional law.

        Throughout the course, students will have the opportunity to engage in interactive activities, such as mock trials and legal debates, to enhance their understanding of the material. Additionally, the course includes guest lectures from prominent legal experts, providing students with insights into the real-world applications of the concepts they are learning.
Throughout the course, students will have the opportunity to engage in interactive activities, such as mock trials and legal debates, to enhance their understanding of the material. Additionally, the course includes guest lectures from prominent legal experts, providing students with insights into the real-world applications of the concepts they are learning.

By the end of the course, students will have a comprehensive understanding of Indian law and will be well-prepared to pursue further studies or careers in the legal field.
By the end of the course, students will have a comprehensive understanding of Indian law and will be well-prepared to pursue further studies or careers in the legal field.
By the end of the course, students will have a comprehensive understanding of Indian law and will be well-prepared to pursue further studies or careers in the legal field.
`;
const InfoScreen = ({data}:any) => (
  <ScrollView style={styles.tabContent}>
    <View
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",

        paddingVertical: 20,
      }}
    >

{console.log(data, "______")}
      <Text style={styles.sectionTitle}>{data?.bundleName}</Text>

      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.itemContainer}>
          <Ionicons name="extension-puzzle" size={24} color="black" />
          <Text style={styles.itemText}>Indian Legal Mastery Quiz</Text>
        </View>
        <View style={styles.itemContainer}>
          <Ionicons name="extension-puzzle" size={24} color="black" />
          <Text style={styles.itemText}>Indian Legal Mastery Quiz2</Text>
        </View>
        <View style={styles.itemContainer}>
          <Ionicons name="extension-puzzle" size={24} color="black" />
          <Text style={styles.itemText}>Indian Legal Mastery Quiz3</Text>
        </View>
        <View style={styles.itemContainer}>
          <Ionicons name="book-outline" size={24} color="black" />
          <Text style={styles.itemText}>IPS</Text>
        </View>
        <View style={styles.itemContainer}>
          <Ionicons name="book-outline" size={24} color="black" />
          <Text style={styles.itemText}>CRPC</Text>
        </View>
      </View>
    </View>

    <View>
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {data?.aboutDescription?.split("\n").map((paragraph, index) => {
            const isBulletPoint = paragraph.trim().startsWith("-");
            return (
              <Text
                key={index}
                style={isBulletPoint ? styles.bulletPoint : styles.paragraph}
              >
                {isBulletPoint
                  ? `• ${paragraph.trim().substring(1).trim()}`
                  : paragraph.trim()}
                {"\n"}
              </Text>
            );
          })}
        </Text>
      </View>
    </View>
  </ScrollView>
);

const ContentsScreen = () => (
  <ScrollView style={styles.tabContent}>

    <View>

      <QuizCard quizzes={courseData[0].quizzes} />
      <StudyMaterialCard studyMaterials={courseData[0].studyMaterials} />




    </View>

  </ScrollView>
);

const Tab = createMaterialTopTabNavigator();

export default function index() {

  const [BundleData, setBundleData] = React.useState(courseData[0]);
  const route = useRoute();
  const { BundleId } = route.params;

  console.log("🚀 ~ index ~ BundleId:", BundleId)


  const fetchBundleData = async () => {
    try {
      const response = await axios.get(`${SERVER_URI}/api/v1/Bundle/course-bundle/${BundleId}`);
      console.log("🚀 ~ file: index.tsx ~ line 136 ~ fetchBundleData ~ response", response.data.data);

      if (response.status === 200 && response.data.success) {
        setBundleData(response.data.data);
        
      } else {
        console.error("Failed to fetch bundle data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    fetchBundleData();


  }, [BundleId]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: "lightblue",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{
          height: height * 0.35,
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Image source={{ uri: BundleData?.image }} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>Quiz Bundle Name</Text>
        </View>
      </View>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName="Home"
          tabBarOptions={{
            activeTintColor: "red",

            labelStyle: {
              fontSize: 16,
            },

            style: {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,

              borderBottomRightRadius: 15,
              marginHorizontal: 20,
              overflow: "hidden",
            },
            indicatorStyle: {
              backgroundColor: "red",
              height: 2,
            },
          }}
        >
          <Tab.Screen name="About"  component={() => <InfoScreen data={BundleData} />}  />
          <Tab.Screen name="Content" component={() => <ContentsScreen  data={BundleData}/>} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightred",
  },
  drawerContainer: {
    flexDirection: "row",
    height: height * 0.4,
  },
  descriptionContainer: {
    backgroundColor: "#f9f9f9", // Very light gray background for the description section
    padding: 15,
    borderRadius: 5,
  },
  description: {
    fontSize: 16,
    color: "#444444", // Dark gray text color
  },
  drawerStyle: {
    width: width * 0.5,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paragraph: {
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "80%",
    // height: height * 0.3,
  },
  nameContainer: {
    height: height * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    // justifyContent: "flex-start",
    // alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginBottom: 50,
    // backgroundColor: "lightblue",

  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },

  bulletPoint: {
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 16,
    color: "#333333", // Dark gray text color
  },
  tabContainer: {
    flex: 1,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },

  slideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});


