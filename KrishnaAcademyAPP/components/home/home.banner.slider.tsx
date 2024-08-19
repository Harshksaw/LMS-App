import { View, Text, Image } from "react-native";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { styles } from "@/styles/home/banner.style";
import Swiper from "react-native-swiper";

import { useEffect, useState } from "react";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import React from "react";

export default function HomeBannerSlider() {
  const [bannerData, setBannerData] = useState<BannerDataTypes[]>([]);

  useEffect(() => {
    const fetchBannerData = async () => 
      {
        const res = await axios.get(`${SERVER_URI}/api/v1/app/carousel`);
        console.log(res.data.data, "---response.data");
        setBannerData(res.data.data);
      }
      fetchBannerData();

  }, []);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Swiper
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplay={true}
        autoplayTimeout={5}
      >
        {bannerData.map((item: BannerDataTypes, index: number) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{uri : item }}
              style={{ width: 400, height: 250 }}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
}


