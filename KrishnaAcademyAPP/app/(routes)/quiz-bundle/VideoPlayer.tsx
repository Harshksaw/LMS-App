import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const VideoPlayer = () => {
    const route = useRoute();
  const { video, id } = route.params;
  const videoData = JSON.parse(video);

  console.log("🚀 ~ file: VideoPlayer.tsx ~ line 10 ~ VideoPlayer ~ videoData", videoData._id, id)
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getVideoUrl = async () => {
    try {
      const res = await axios.post(`${SERVER_URI}/api/v1/videocourse/getVideo`, {
        courseId: videoData._id,
        segmentId: videoData.indexFile,
    });

      setVideoUrl(res.data.presignedUrl);
      //   setVideoUrl("https://d3794hgjnt5o1l.cloudfront.net/courses/66fb8faa9c05a15f580186a5/index.m3u8");
      console.log("🚀 ~ getVideoUrl ~ res.data.presignedUrl:", res.data)
      setLoading(false);
    } catch (err) {
      console.error(err);
    //   setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!videoData || !videoData.id) {
    // //   setError(true);
    //   setLoading(false);
    //   return;
    // }
    getVideoUrl();
  }, [videoData]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    // setError(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load video</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        // source={{ uri: videoUrl }}
        source={{ uri: videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
        onLoad={handleLoad}
        onError={handleError}
      />
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.title}>{videoData.courseName}</Text>
        <Text style={styles.description}>{videoData.courseDescription}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  video: {
    width: width,
    height: width * 0.56, // 16:9 aspect ratio
  },
  infoContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    textAlign:'center',
    fontSize: 16,
    marginTop: 10,
    color: "#666",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default VideoPlayer;