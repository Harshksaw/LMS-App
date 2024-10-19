import CoursesScreen from "@/screens/courses/courses.screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Courses() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <CoursesScreen />
    </SafeAreaView>
  );
}
