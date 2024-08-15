import useUser from "@/hooks/auth/useUser";
import { Redirect } from "expo-router";
import Loader from "@/components/loader/loader";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedLoader from "react-native-animated-loader";

export default function TabsIndex() {
  const { loading, user } = useUser();
  return (
    <>
      {loading ? (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <LinearGradient
            colors={["rgb(191, 221, 116)", "rgb(160, 229, 145)"]}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "30%",
            }}
          >
            <AnimatedLoader
              visible={true}
              overlayColor="rgba(255,255,255,0.75)"
              source={require("@/assets/animation/Online data Manager.json")}
              animationStyle={{ width: 250, height: 250 }}
              speed={1.5}
            />
          </LinearGradient>
        </View>
      ) : (
        <Redirect href={!user ? "/(routes)/onboarding" : "/(tabs)"} />
        // <Redirect href={!user ? "/(routes)/onboarding" : "/(routes)/quiz/quiz.result"} />
      )}
    </>
  );
}
