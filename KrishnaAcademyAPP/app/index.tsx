import useUser from "@/hooks/auth/useUser";
import { Redirect } from "expo-router";
import Loader from "@/components/loader/loader";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedLoader from "react-native-animated-loader";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";

export default function TabsIndex() {
  const { loading, user } = useUser();
  const [serverHealth, setServerHealth] = useState<"loading" | "healthy" | "down">("loading");
  const checkServerHealth = async () => {
    setServerHealth("loading");
    try {
      const response = await axios.get(`${SERVER_URI}/health`);
      if (response.status === 200) {
        setServerHealth("healthy");
      } else {
        setServerHealth("down");
      }
    } catch (error) {
      setServerHealth("down");
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  if (serverHealth === "down") {
    return (
      <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: "red",
          textAlign: "center",
          padding: 20,
        }}
      >
        Server is down. Please try again later.
      </Text>
      <TouchableOpacity
        onPress={checkServerHealth}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "blue",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>Refresh</Text>
      </TouchableOpacity>
    </View>
    );
  }
  if (serverHealth === "loading" || loading) {
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
  )}
}
