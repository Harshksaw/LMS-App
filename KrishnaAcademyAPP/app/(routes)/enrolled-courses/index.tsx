import CourseCard from "@/components/cards/course.card";
import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import Material from "@/screens/material";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const [courses, setcourses] = useState<CoursesType[]>([]);
  const [loader, setLoader] = useState(false);
  const { loading, user } = useUser();
 
  useEffect(() => {
    axios.get(`${SERVER_URI}/get-courses`).then((res: any) => {
      const courses: CoursesType[] = res.data.courses;
      const data = courses.filter((i: CoursesType) =>
        user?.courses?.some((d: any) => d._id === i._id)
      );
      setcourses(data);
    });
  }, [loader, user]);

  return (
    <SafeAreaView 
    style={{
      flex: 1,
paddingTop: 20,
    }}
    >

      {/* {loader || loading ? (
        // <ActivityIndicator color={"blue"}  />
      ) : (
      
        
      )} */}
     

    </SafeAreaView>
  );
}
