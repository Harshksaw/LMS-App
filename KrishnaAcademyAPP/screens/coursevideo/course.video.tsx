import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = () => {
    const videoUrl ='https://krishanacademylms.s3.ca-central-1.amazonaws.com/courses/66f88a390b7ba254239748d1/index.m3u8?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2MNVLWRDMO6IVXCD%2F20240929%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240929T045654Z&X-Amz-Expires=3600&X-Amz-Signature=9a15ddee54ac556ee675658103f2aadbc839cc780d0c9cbf4aac65bf157bacd2&X-Amz-SignedHeaders=host'
  const video = useRef(null);

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        useNativeControls
        resizeMode="contain"
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300,
  },
});

export default VideoPlayer;