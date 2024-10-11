import React, { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import toast from "react-hot-toast";
import { BASE_URL } from "../../../../services/apis";
import IconBtn from "../../../common/IconBtn";
import { IconButton } from "@mui/material";
import { FaImage } from "react-icons/fa";
import { deleteCourse } from '../../../../services/operations/courseDetailsAPI';

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
            My Videos
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
      return <div className="flex justify-center items-center h-full">
      <div className="loader"></div>
      </div>
    }

    const deleteCourse = async (id) => {

      try {
        const res = await axios.delete(`${BASE_URL}/api/v1/videocourse/deleteVideo/${id}`);
        if (res) {
          courses.filter((course) => course._id !== id)
          toast.success("Course deleted successfully");
          window.location.reload();
        } else {
          toast.error("Failed to delete course");
        }
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  
    return (
      <div className="overflow-y-auto h-1/2">
        <table className="min-w-full bg-richblue-700 border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-white text-left">Course Image</th>
              <th className="py-2 px-4 border-b text-white text-left">Course Name</th>
              <th className="py-2 px-4 border-b text-white text-left">Description</th>
              <th className="py-2 px-4 border-b text-white text-left">Duration</th>
              <th className="py-2 px-4 border-b text-white text-left">Status</th>
              <th className="py-2 px-4 border-b text-white text-left">Created At</th>
              <th className="py-2 px-4 border-b text-white text-left">Delete</th>
            </tr>
          </thead>
          <tbody className=" space-y-2 gap-5">
            {courses.map((course) => (
              <tr key={course._id} className="even:bg-richblack-400 odd:bg-richblack-300    mt-5 py-5">
                <td className="py-2 px-4 border-b">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-40 h-40 rounded-full"/>
                  </td>
                <td className="py-2 px-4 border-b">{course.courseName}</td>
                <td className="py-2 px-4 border-b">{course.courseDescription.slice(0,40)}</td>
                <td className="py-2 px-4 border-b">{course?.duration}</td>
                <td className="py-2 px-4 border-b">{course.status}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-red-500 text-white text-xl p-2 rounded-md"
                  onClick={() => {
                    deleteCourse(course._id);
                  }}
                  
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
