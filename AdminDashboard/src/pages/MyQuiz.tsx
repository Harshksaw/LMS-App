
import React,{ useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../components/common/IconBtn"
import axios from "axios"
import { BASE_URL } from "../services/apis"
import toast from "react-hot-toast"
import QuizTable from "../components/tables/quizTable"



export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/quiz/getAllQuiz`);
      
      if (!res.data){
        toast.dismiss();
        toast.error("something went wront");
        return;
      }
      console.log(res?.data)
      setCourses(res?.data?.data)
    
      // console.log('Instructors all courses  ', result);
      setLoading(false);
    }
    fetchCourses()
  }, [])

  console.log(courses);
  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div>
      <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {/* course Table */}
      {courses && <QuizTable courses={courses} setCourses={setCourses} loading={loading} setLoading={setLoading} />}
    </div>
  )
}