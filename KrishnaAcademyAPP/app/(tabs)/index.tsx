import HomeScreen from "@/screens/home/home.screen";

import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,

  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

import { StyleSheet, Text, View } from "react-native";

import React from "react";
import { Image } from "expo-image";
import useUser from "@/hooks/auth/useUser";

import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";


const UserInfoContent = () => {
  const { user, loading, setRefetch } = useUser();

  return (
    <TouchableOpacity style={styles.userInfoWrapper}
    onPress={() => router.navigate("/(routes)/my-account/my-profile")}
    >
      <Image
        source={{
          uri: `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}`,
        }}
        width={60}
        height={60}
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

  const navigation = useNavigation();
  return (
<DrawerContentScrollView {...props}


>
      {/* User Info Section */}
      <UserInfoContent />
      {/* <DrawerItemList {...props} /> */}

     
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
          onPress={() => router.navigate("/(routes)/enrolled-courses")}
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
          onPress={() => {
            /* Add your my courses logic here */
          }}
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
            /* Add your my courses logic here */
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
      <View style={styles.section}>
        <Text style={styles.heading}>Others</Text>
        <DrawerItem
          label="Share this App"
          onPress={() => {
            /* Add your share app logic here */
          }}
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
          onPress={() => {
            /* Add your rate others logic here */
          }}
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
          onPress={() => {
            /* Add your share app logic here */
          }}
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
            name="logo-facebook"
            size={24}
            color="blue"
            style={styles.icon}
          />
          <Ionicons
            name="logo-twitter"
            size={24}
            color="skyblue"
            style={styles.icon}
          />
          <Ionicons
            name="logo-instagram"
            size={24}
            color="purple"
            style={styles.icon}
          />
          <Ionicons
            name="logo-linkedin"
            size={24}
            color="blue"
            style={styles.icon}
          />
        </View>
      </View>
      <View style={[styles.section,{
        marginBottom: 20,
      }] }>
        {/* <Text style={styles.heading}>Account</Text> */}
        <DrawerItem
          label="Logout"
          onPress={() => {
             () => {
               AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("refresh_token");
              router.push("/(routes)/login",

                  
              );

            };
            /* Add your sign out logic here */
          }}
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
  const Drawer = createDrawerNavigator();

  return (
  
    <Drawer.Navigator
    
    initialRouteName="Home" // Start with UserInfo screen
    drawerContent={(props) => <CustomDrawerContent {...props} />}

  >
      <Drawer.Screen name="UserInfo" component={UserInfoContent}

        options={
          {
            headerShown: false,
          }
        }
       />

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
        </Drawer.Navigator>

);
}



const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,

    // borderBottomColor: "#000",
    // borderBottomWidth: 1,
    // marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
