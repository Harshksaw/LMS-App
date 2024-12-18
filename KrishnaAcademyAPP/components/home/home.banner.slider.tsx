import { View, Image, Dimensions } from "react-native";
import { styles } from "@/styles/home/banner.style";
import SwiperFlatList from "react-native-swiper-flatlist";

import { useEffect, useState } from "react";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import React from "react";

export default function HomeBannerSlider() {
  const [bannerData, setBannerData] = useState<BannerDataTypes[]>([]);

  const fetchBannerData = async () => {
    try {
      const res = await axios.get(`${SERVER_URI}/api/v1/app/carousel`);
      setBannerData([...res.data.data]);
      // setBannerData(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  return (
    <View style={{ ...styles.container }}>
      <SwiperFlatList
        autoplay
        autoplayDelay={3}
        autoplayLoop
        automaticallyAdjustContentInsets
        autoplayLoopKeepAnimation
        showPagination
        disableGesture
        paginationStyleItem={styles.dot}
        paginationActiveColor="red"
        paginationDefaultColor="#e9e9e9"
        data={bannerData}
        removeClippedSubviews
        renderItem={({ item, index }) => (
          <View
          style={{
            width: Dimensions.get("window").width,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            // paddingRight: 10,
          }}
        >
          <Image
            resizeMode="contain"
            key={index}
            source={{ uri: item } as any}
            style={{

              width: '100%',
              height: Dimensions.get("window").width , // 16:9 aspect ratio
              borderRadius: 7,
            }}
          />
        </View>
      )}
    />
  </View>
  );
}
