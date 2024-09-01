import { View, Text } from 'react-native'
import CoursesScreen from "@/screens/courses/courses.screen";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header/header';

export default function Courses() {
  return (
    <SafeAreaView 
    style={{
      flex:1,
    }}
    >


    <CoursesScreen />
    </SafeAreaView>
  )
}