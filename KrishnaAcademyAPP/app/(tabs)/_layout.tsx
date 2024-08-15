import useUser from "@/hooks/auth/useUser";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Image, View, Animated, StyleSheet, Text } from "react-native";

export default function TabsLayout() {
  const { user } = useUser();

  const AnimatedIcon = ({ focused, iconName, title }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const backgroundColor = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(translateY, {
        toValue: focused ? -20 : 0,
        useNativeDriver: false,
      }).start();

      Animated.timing(backgroundColor, {
        toValue: focused ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [focused]);

    const interpolatedBackgroundColor = backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["#fff", "#ED3137"],
    });

    return (
      <>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: interpolatedBackgroundColor,
              transform: [{ translateY }],
            },
          ]}
        >
          <Animated.View style={[styles.image]}>
            <Image
              source={iconName}
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? "#FFF" : "#000",
              }}
            />
          </Animated.View>
        </Animated.View>
        <Text
          style={{
            fontSize: 10,
            color: focused ? "#FFF" : "#000",
            // fontWeight: 'bold',
            textAlign: "center",
            marginBottom: 5,
            // marginTop: 10,
            // marginBottom: 10,
            // marginLeft: 10,
            // marginRight: 10,
          }}
        >
          {title}
        </Text>
      </>
    );
  };

  return (
    <Tabs
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused }) => {
            let iconName;
            let title;
            if (route.name === "index") {
              iconName = require("@/assets/icons/home.png");
              title = "Home";
            } else if (route.name === "studymaterials/index") {
              iconName = require("@/assets/icons/information2.png");
              title = "Study Materials";
            } else if (route.name === "quiz/index") {
              iconName = require("@/assets/icons/puzzle-piece.png");
              title = "Quiz";
            } else if (route.name === "courses/index") {
              iconName = require("@/assets/icons/more.png");
              title = "Courses";
            } else if (route.name === "profile/index") {
              iconName = require("@/assets/icons/User.png");
              title = "Profile";
            }
            return (
              <View
                style={{
                  backgroundColor: focused ? "#ED3137" : "#fff",
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AnimatedIcon
                  focused={focused}
                  iconName={iconName}
                  title={title}
                />
              </View>
            );
          },
          headerShown: false,
          tabBarShowLabel: false,
        };
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="studymaterials/index" />
      <Tabs.Screen name="courses/index" />
      <Tabs.Screen name="quiz/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    // width: 300,
    // height: "100%",
    // flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    // paddingBottom: 0,
  },
  container: {
    borderWidth: 3,
    borderRadius: 40,
    borderColor: "#fff",

    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    // width: 30,
    // height: 30,
    // zIndex: 21,
  },
});
