import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { styles } from "./styles";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";

const VideoScreen = ({ data }) => {
  console.log("🚀 ~ VideoScreen ~ data:", data)
  const [videodata, setvideoData] = React.useState([]);


//   const getVideoData = async () => {
//     try {
//       const response = await axios.get(
//         `${SERVER_URI}/api/v1/bundle/${data.id}/videos`
//       );
//       if (response.data && response.data.Videos && response.data.Videos.length > 0) {
//         setvideoData(response.data.Videos);
//       } else {
//         setvideoData([]);
//       }
//     } catch (error) {
//       console.error(error);
//       setvideoData([]);
//     }
//   };



//   useEffect(() => {
//     getVideoData();
//   }, [data.id]);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {videodata.length === 0 ? (
          <View style={styles.noVideoContainer}>
            {/* <Image
              source={{
                uri: "https://unbridledwealth.com/wp-content/uploads/2017/08/video-placeholder.jpg",
              }} // Replace with your image URL
              style={styles.noVideoImage}
            /> */}
            <Text style={styles.noVideoText}>No video available</Text>
          </View>
        ) : (
          // Render your video content here
          <View>
            {/* Replace this with your actual video rendering logic */}
            <Text>Video Content</Text>
          </View>
        )}
      </View>

      <View style={styles.tabContent}>
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

      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingVertical: 20,
        }}
      >
        <Text style={styles.sectionTitle}>{data?.bundleName}</Text>

        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 100,
          }}
        >
          {data?.quizes?.map((quiz, index) => (
            <View key={index} style={styles.itemContainer}>
              <Ionicons name="extension-puzzle" size={24} color="black" />
              <Text style={styles.itemText}>{quiz.name}</Text>
            </View>
          ))}

          {data?.studyMaterials?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Study Materials</Text>
              {data.studyMaterials.map((material, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Ionicons name="book-outline" size={24} color="black" />
                  <Text style={styles.itemText}>{material.name}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default VideoScreen;