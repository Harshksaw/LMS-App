import { View, Image } from "react-native";
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
      setBannerData(res.data.data);
    } catch (error) {}
  };

  // let [fontsLoaded, fontError] = useFonts({
  //   Raleway_700Bold,
  //   Nunito_400Regular,
  //   Nunito_700Bold,
  // });
  useEffect(() => {
    fetchBannerData();
  }, []);

  return (
    <View style={{ ...styles.container }}>
      <SwiperFlatList
        // autoplay
        // autoplayDelay={5}
        autoplayLoop
        showPagination
        paginationStyleItem={styles.dot}
        paginationActiveColor="red"
        paginationDefaultColor="#e9e9e9"
        data={bannerData}
        renderItem={({ item, index }) => (
          <Image
            resizeMode="stretch"
            key={index}
            source={{ uri: item } as any}
            style={{ width: 400, height: 250, borderRadius: 5, marginRight: 5 }}
          />
        )}
      />
    </View>
  );
}
