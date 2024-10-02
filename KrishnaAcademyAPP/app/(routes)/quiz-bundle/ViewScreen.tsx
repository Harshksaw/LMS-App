import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const VideoScreen = ({ data }) => {
  console.log("🚀 ~ VideoScreen ~ data:", data._id)
  const [videodata, setvideoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setvideoData(data?.Videos);
    setLoading(false);
  }, [data]);

  const navigation = useNavigation();

  const handlePress = (video) => {
    // navigation.navigate("VideoDetail", { video });
    router.push({
        pathname: "/(routes)/quiz-bundle/VideoPlayer",
        params: { video: JSON.stringify(video), id: data._id },
      });
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ justifyContent: "center" }}>
        {videodata?.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              backgroundColor: "#f4f4f4",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#333",
                textAlign: "center",
              }}
            >
              No video available
            </Text>
          </View>
        ) : (
          videodata?.map((video, index) => (
            <TouchableOpacity key={index} onPress={() => handlePress(video)}
            style={{ width: "100%" }}
            >
              <VideoCard video={video} />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default VideoScreen;

const VideoCard = ({ video }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.courseName}</Text>
        <Text style={styles.description}>{video.courseDescription.slice(0, 50)}</Text>
        <Text style={styles.title}>{video.createdAt.slice(0, 10)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",

    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgb(143, 137, 137)",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 150,
    height: 120,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-around",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});