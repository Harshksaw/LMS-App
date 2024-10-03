import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { useRoute } from "@react-navigation/native";


const { width, height } = Dimensions.get('window');

const VideoPlayer = () => {
    const route = useRoute();
  const { video, id } = route.params;
  const videoData = JSON.parse(video);
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [status, setStatus] = useState({});

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
    const subscription = ScreenOrientation.addOrientationChangeListener(handleOrientationChange);
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const handleOrientationChange = ({ orientationInfo }) => {
    const { orientation } = orientationInfo;
    if (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
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
  const handlePlaybackStatusUpdate = (status) => {
    setStatus(() => status);
  };



  return (
    <View style={[styles.container, { paddingTop: isFullscreen ? 0 :40 }]}>
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={isFullscreen ? styles.fullscreenVideo : styles.video}
        onLoad={handleLoad}
        onError={handleError}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
        <Ionicons
        // name={isFullscreen ? "md-exit" : "md-expand"} size={24} color="blue" />
        
        name={!isFullscreen ? "phone-landscape-outline" : "phone-portrait-outline"} size={24} color="white" 
        
        />
      </TouchableOpacity>
    </View>
    {!isFullscreen && (
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.title}>{videoData.courseName}</Text>
        <Text style={styles.description}>{videoData.courseDescription}</Text>
      </ScrollView>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

      },
      videoContainer: {
        position: 'relative',
        paddingTop: 10,
        // paddingHorizontal: 20,

      },
      video: {
        width: width,
        height: width * 0.56, // 16:9 aspect ratio
      },
      fullscreenVideo: {
        width: height,
        height: width,
      },
      fullscreenButton: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 5,
      },
      infoContainer: {
        padding: 20,
        display: "flex",
      },
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      errorText: {
        color: 'red',
        fontSize: 18,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      description: {
        fontSize: 16,
        marginTop: 10,
      },
    });

export default VideoPlayer;