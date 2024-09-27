import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = () => {
    const videoUrl ='https://krishanacademylms.s3.ca-central-1.amazonaws.com/courses/07f44e9e-0953-4c38-8c9b-224a82cc0965/index.m3u8?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGNhLWNlbnRyYWwtMSJGMEQCIEzOwN700DXZ51mdqXabXJFQmI%2F0fWyTPjpMt%2FY%2BAgPZAiAJAdbE3kyBjuMmUaCbDUe9J0E07mH2xTwZahrZo695lyrkAggmEAAaDDcxMzg4MTc5MzYwNiIMKziiLhjdhqnCYNkjKsECKJgKy4VUrx2cUCOB6rng0%2BUjnh87aTZ9dm4aYPV1J87tD%2FeZQc1u8dxTjKV45FTZalsiPP1E6o9r3uF3F6UpvmlHOn2u8oRLb3ujVAyVEu8C8WlWKKtr9ZbTYcA4sCzuw90QRFteGz5O0PcB6XXYeyO4jQNMI8a89hOtjCwYSsETmyXxrqkzWmNwcW9AoqO4mYprVDPxERbDdkAK%2FVZ0L1JnlR8SdD0A7ai0U11UBOr1VSmrHjhFgTz6dsphLWA%2FwyGhZ5cnzcsf6JZKrQq8fD5GDL1HYk%2Brhu8YVCnE%2FzHyoWY2MrfmOOjopHr64aT8qAxNC1IqVeimpoxj%2FgbBp9SH7TxfrjpnkhS9mcYxY6rxlGjJzHQRn72fX%2FPgxAjRqfkWP9jDkGbQKGQm5Xp%2F4OU9Z7t5tP%2F7LV%2BT4jN8iecZMJTH2LcGOrQCLPer%2B7uMpjxohxZvZA3Dn8ARLl5lf8Thl6fHddV97fngvvz2UahnoVSTRiGjKW7HlyhQcltOSB%2FkmKRAs8qzU8r6S7DjUae9Ddps1PZHxMNKeVhDelXI3ftIhczYgDxfTCmy%2BiGg4QHuM6Vd0%2B1JaoBBqkyXUAHwx6F0FqYHO7L07%2FYZrX9ZXBrVtHf3jaTccuJuPVUcZOy8qWD%2Fzsx6tzwPjKw2EmQ%2B%2BCONrH9vXZFuhHWKBFMCg%2BM%2FrjoZhBBnB0NgJopGlnO3HE68dH2UPtAhBB3Pw4A6LGCM8vcsGQl7vsSyCqht4bMGToV1yohIisK2kV3IUUNFzypAQ2TLxg%2FajpXUAPAdrWA0w7PwuRnDbmO1byn02jQA%2B4XjZfqKbhDBfgXLkkEnx4Rv4k2WeFQiaBU%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240927T050518Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Credential=ASIA2MNVLWRDKGEXYEJL%2F20240927%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Signature=79a7ca03d924c24e7ee50c185a9f7b5f0cc3d9e7de6c9c91c0d71684a4b6e788'
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