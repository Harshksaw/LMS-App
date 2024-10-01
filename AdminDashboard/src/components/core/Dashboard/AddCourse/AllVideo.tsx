import React, { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import toast from "react-hot-toast";
import { BASE_URL } from "../../../../services/apis";
import IconBtn from "../../../common/IconBtn";

export default function AllVideo() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/videocourse/getAllVideo`);
          if (res.data) {
            setCourses(res.data);
            setAllCourses(res.data);
          } else {
            toast.error("Something went wrong");
          }
        } catch (error) {
          toast.error("Failed to fetch video courses");
        }
        setLoading(false);
      };
      fetchCourses();
    }, []);
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    const search = (text: string) => {
      if (!text) return setCourses(allCourses);
      const resultsData = allCourses.filter((course: any) => {
        return (course?.courseName + course?.courseDescription)
          ?.toString()
          .toLowerCase()
          ?.includes(text?.toLowerCase());
      });
  
      setCourses(resultsData);
    };
  
    return (
      <div>
        <div className="mb-14 flex justify-between items-center">
          <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
            My Courses
          </h1>
          {/* <input
            type="search"
            placeholder="Search here..."
            onChange={(e) => search(e.target.value)}
            className="px-2 rounded text-black outline-none"
          /> */}
          {/* <IconBtn
            text="Add Course"
            onclick={() => navigate("/dashboard/add-course")}
          > */}
            {/* <VscAdd /> */}
          {/* </IconBtn> */}
        </div>
  
        {/* Course Table */}
        {courses && (
          <VideoCoursesTable
            courses={courses}
            setCourses={setCourses}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    );
  }

const VideoCoursesTable = ({ courses, loading }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-100 text-left">Course Thumbnail</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-left">Course Name</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-left">Description</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-left">Duration</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-left">Status</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-left">Created At</th>
            </tr>
          </thead>
          <tbody className="gap-5">
            {courses.map((course) => (
              <tr key={course._id} className="even:bg-gray-50 mt-5 py-5">
                <td className="py-2 px-4 border-b">{course.courseName}</td>
                <td className="py-2 px-4 border-b">{course.courseDescription}</td>
                <td className="py-2 px-4 border-b">{course.duration}</td>
                <td className="py-2 px-4 border-b">{course.status}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };