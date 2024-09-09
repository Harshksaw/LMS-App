import { View, Text, Image } from "react-native";
import { styles } from "@/styles/home/banner.style";
import SwiperFlatList from "react-native-swiper-flatlist";

import { useEffect, useMemo, useState } from "react";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import React from "react";

export default function HomeBannerSlider() {
  const [bannerData, setBannerData] = useState<BannerDataTypes[]>([]);

  const fetchBannerData = async () => {
    const res = await axios.get(`${SERVER_URI}/api/v1/app/carousel`);
    setBannerData(res.data.data);
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
    <View style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={2}
        autoplayLoop
        showPagination
        paginationStyleItem={styles.dot}
        paginationActiveColor="red"
        paginationDefaultColor="#e9e9e9"
        data={bannerData}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{ uri: item } as any}
              style={{ width: 410, flex: 1 }}
            />
          </View>
        )}
      />
    </View>
  );
}
