import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";

import { createDrawerNavigator, DrawerContent } from "@react-navigation/drawer";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();

export default function RootLayout() {

  const [data, setData] = useState([]);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <NavigationContainer> */}
      <RootLayoutNav />

      {/* </NavigationContainer> */}
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  return (
    <ToastProvider>
      <Stack screenOptions={{
            // header: (props) => <Header {...props}  />,
            headerShown: false
          }}>
       
          <Stack.Screen name="index" 
          
          />
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />


        <Stack.Screen name="(routes)/welcome-intro/index" />
        <Stack.Screen name="(routes)/login/index" />
        <Stack.Screen name="(routes)/sign-up/index" />
        <Stack.Screen name="(routes)/forgot-password/index" />
        <Stack.Screen
          name="(routes)/course-details/index"
          options={{
            headerShown: true,
            title: "Course Details",
            headerBackTitle: "Back",
          }}
        />

        <Stack.Screen
          name="(routes)/profile-details/index"
          options={{
            headerShown: true,
            title: "Profile Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/course-access/index"
          options={{
            headerShown: true,
            title: "Course Lessons",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/enrolled-courses/index"
          options={{
            headerShown: true,
            title: "Enrolled Courses",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/quiz/quiz.details"
          options={{
            headerShown: false,
            title: "Enrolled Courses",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/studymaterials/index"
          options={{
            headerShown: false,
            title: "Enrolled Courses",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/pdfviewer"
          options={{
            headerShown: false,

            headerBackTitle: "Back",
          }}
        />
        {/* <Stack.Screen name="course-detail" component={CourseDetailScreen}/> */}
        <Stack.Screen
          name="(routes)/blogs/blogscreen"
          options={{
            headerShown: true,
            title: "Daily Updates",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/my-account/daily.updates"
          options={{
            headerShown: true,

            title: "Daily Updates",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/quiz/savedQuestions"
          options={{
            headerShown: true,
            title: "Saved Questions",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/my-account/my-profile"

          options={{

            headerShown: false,
            title: "My Profile",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/my-account/OrderScreen"

          options={{

            headerShown: true,
            title: "My Purchases",
            headerBackTitle: "Back",
          }}
        />

        /// Quiz 
        <Stack.Screen 
          name="(routes)/quiz/quiz.result"
          options={{
            headerShown: true,
            title: "Quiz result Dashboard",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen 
          name="(routes)/my-account/ChangePassword"
          options={{
            headerShown: true,
            title: "Change Password",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/blogs/quiz.solutions"
          options={{
            // headerShown: false,
            title: "Quiz solution",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/payment/index"
          options={{
            // headerShown: false,
            title: "Quiz solution",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/quiz/quiz.attempts"
          options={{
            headerShown: true,
            title: "Quiz Attempts",
            headerBackTitle: "Back",
          }}
        />
     
        <Stack.Screen
          name="(routes)/quiz-bundle/VideoPlayer"
          options={{
            headerShown: true,
            title: "Video Player",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/quiz-bundle/VideoScreen"
          options={{
            headerShown: true,
            title: "Video Screen",
            headerBackTitle: "Back",
          }}
        />
        
      </Stack>
    </ToastProvider>
  );
}
