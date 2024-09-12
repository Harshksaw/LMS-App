import HomeScreen from "@/screens/home/home.screen";

import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";

import { BackHandler, Share, StyleSheet, Text, View } from "react-native";

import * as Linking from "expo-linking";

import React, { useEffect } from "react";
import { Image } from "expo-image";
import useUser from "@/hooks/auth/useUser";

import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigationState } from "@react-navigation/native";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";

const UserInfoContent = () => {
  const { user } = useUser();

  return (
    <TouchableOpacity
      style={styles.userInfoWrapper}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/profile",
        })
      }
    >
      <Image
        source={{
          uri: `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}`,
        }}
        width={50}
        height={50}
        style={{ borderRadius: 40 }}
      />
      <View style={styles.userDetailsWrapper}>
        <Text style={styles.userName}> {user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
    </TouchableOpacity>
  );
};
const CustomDrawerContent = (props) => {
  const { user, loading, setRefetch } = useUser();
  const [socialMedia, setSocialMedia] = React.useState([]);

  useEffect(() => {
    const fetchBannerData = async () => {
      const res = await axios.get(`${SERVER_URI}/api/v1/app/socialMedia`);
      console.log(res.data, "---response.datwa");
      // setBannerData(res.data.data);
      setSocialMedia(res.data);
    };
    fetchBannerData();
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Krishna Academy App: https://play.google.com/store/apps/details?id=com.krishna.jythu",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const logoutHandler = async () => {
    const token = await AsyncStorage.removeItem("token");
    await axios
      .post(
        `${SERVER_URI}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(async (res) => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refresh_token");
        router.dismissAll();
        router.replace("/(routes)/login");
      })
      .catch((error) => {
        Toast.show("Error While Logout!", {
          type: "danger",
        });
      });
  };

  const navigation = useNavigation();
  return (
    <DrawerContentScrollView {...props}>
      {/* User Info Section */}
      <UserInfoContent />

      <View style={styles.section}>
        <Text style={styles.heading}>My Accounts</Text>

        <DrawerItem
          label="Daily Updates"
          onPress={() => router.navigate("/(routes)/my-account/daily.updates")}
          icon={({ focused, size }) => (
            <Ionicons
              name="notifications"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />

        <DrawerItem
          label="Saved Questions"
          onPress={() => router.navigate("/(routes)/quiz/savedQuestions")}
          icon={({ focused, size }) => (
            <Ionicons
              name="bookmark"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />

        <DrawerItem
          label="My Results"
          onPress={() => router.navigate("/(routes)/quiz/quiz.attempts")}
          icon={({ focused, size }) => (
            <Ionicons
              name="book"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />
        <DrawerItem
          label="My Courses"
          onPress={() => router.navigate("/(routes)/enrolled-courses")}
          icon={({ focused, size }) => (
            <Ionicons
              name="school"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />
        <DrawerItem
          label="My Purchases"
          onPress={() => {
            router.navigate("/(routes)/my-account/OrderScreen");
          }}
          icon={({ focused, size }) => (
            <Ionicons
              name="cash"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />
      </View>
      <View
        style={{
          marginTop: 10,
          borderTopWidth: 1,
          borderTopColor: "#ccc",
          paddingTop: 5,
        }}
      >
        <Text style={styles.heading}>Others</Text>
        <DrawerItem
          label="Share this App"
          onPress={onShare}
          icon={({ focused, size }) => (
            <Ionicons
              name="share-social"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />

        <DrawerItem
          label="Rate Others"
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.krishna.jythu"
            )
          }
          icon={({ focused, size }) => (
            <Ionicons
              name="star"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />
        <DrawerItem
          label="About Us"
          onPress={() => Linking.openURL("https://krishnaacademy.in/about-us")}
          icon={({ focused, size }) => (
            <Ionicons
              name="people"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Connect</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginHorizontal: 16,
          }}
        >
          <Ionicons
            onPress={() =>
              Linking.openURL(
                "https://www.facebook.com/profile.php?id=61564100115978&mibextid=ZbWKwL"
              )
            }
            name="logo-facebook"
            size={24}
            color="blue"
            style={styles.icon}
          />
          <Ionicons
            onPress={() => Linking.openURL("https://t.me/+02hwcfZFdPE3MDVl")}
            name="paper-plane-outline"
            size={24}
            color="skyblue"
            style={styles.icon}
          />
          <Ionicons
            onPress={() =>
              Linking.openURL("https://www.instagram.com/krishnaacademy_/")
            }
            name="logo-instagram"
            size={24}
            color="purple"
            style={styles.icon}
          />
          <Ionicons
            onPress={() =>
              Linking.openURL("https://twitter.com/krishnaacademy_")
            }
            name="logo-twitter"
            size={24}
            color="blue"
            style={styles.icon}
          />
        </View>
      </View>
      <View
        style={[
          styles.section,
          {
            marginBottom: 20,
          },
        ]}
      >
        <DrawerItem
          label="Logout"
          onPress={logoutHandler}
          icon={({ focused, size }) => (
            <Ionicons
              name="log-out"
              size={size}
              color={focused ? "blue" : "black"}
            />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default function index() {
  const navigationState = useNavigationState((state) => state);

  useEffect(() => {
    const backAction = () => {
      const currentRoute = navigationState.routes[navigationState.index].name;

      if (currentRoute == "Home") {
        BackHandler.exitApp();
        return true;
      } else {
        // Navigate to the previous screen
        router.back();
        // BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigationState]);

  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Home" // Start with UserInfo screen
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen} // Assuming you still want the Home screen
        options={{
          headerShown: false,
          title: "Home",

          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="home" // Use appropriate icon for Home
              size={size}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="UserInfo"
        component={UserInfoContent}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 10,
  },
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 20,

    // borderBottomColor: "#000",
    // borderBottomWidth: 1,
    // marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    // marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  userEmail: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
