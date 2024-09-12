import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

import IconBtn from "../../common/IconBtn";
import CoursesTable from "./InstructorCourses/CoursesTable";
import axios from "axios";
import { BASE_URL } from "../../../services/apis";

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/bundle/course-bundle`);
      console.log(res.data);

      if (res.status != 200) {
        toast.dismiss();
        toast.error("something went wront");
        return;
      }
      setCourses(res?.data?.data);
      setAllData(res?.data?.data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const search = (text) => {
    if (!text) return setCourses(allData);
    const resultsData = allData.filter((user) => {
      return (user?.bundleName + user?.price + user?.status)
        ?.toString()
        .toLowerCase()
        ?.includes(text?.toLowerCase());
    });

    setCourses(resultsData);
  };
  return (
    <div>
      <div className="mb-14 flex justify-between items-center">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          My Courses
        </h1>
        <input
          type="search"
          placeholder="search here..."
          onChange={(e) => search(e.target.value)}
          className="px-2 rounded text-black outline-none"
        />
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {/* course Table */}
      {courses && (
        <CoursesTable
          courses={courses}
          setCourses={setCourses}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}
