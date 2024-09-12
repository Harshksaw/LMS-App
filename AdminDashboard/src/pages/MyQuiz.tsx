import React, { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../components/common/IconBtn";
import axios from "axios";
import { BASE_URL } from "../services/apis";
import toast from "react-hot-toast";
import QuizTable from "../components/tables/quizTable";

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/quiz/getAllQuiz`);

      if (!res.data) {
        toast.dismiss();
        toast.error("something went wront");
        return;
      }
      setCourses(res?.data?.data);
      setAllCourses(res?.data?.data);

      setLoading(false);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const search = (text: string) => {
    if (!text) return setCourses(allCourses);
    const resultsData = allCourses.filter((user: any) => {
      return (user?.name + user?.timer + user?.shortDescription)
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
          My quizes
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
        <QuizTable
          courses={courses}
          setCourses={setCourses}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}
