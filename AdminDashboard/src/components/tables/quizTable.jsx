import { useDispatch, useSelector } from "react-redux";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useState } from "react";
import { FaCheck, FaEye, FaStreetView, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

import { formatDate } from "../../services/formatDate";
// import { deleteCourse, fetchInstructorCourses, } from "../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../utils/constants";
import ConfirmationModal from "../common/ConfirmationModal";
import Img from "../common/Img";
import toast, { LoaderIcon } from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../services/apis";

export default function QuizTable({
  courses,
  setCourses,
  loading,
  setLoading,
}) {
  console.log("🚀 ~ courses:", courses);

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 25;

  // delete course
  const handleCourseDelete = async (courseId) => {
    // setLoading(true)
    // const toastId = toast.loading('Deleting...');
    // await deleteCourse({ courseId: courseId }, token)
    // const result = await fetchInstructorCourses(token)
    // if (result) {
    //   setCourses(result)
    // }
    // setConfirmationModal(null)
    // setLoading(false)
    // toast.dismiss(toastId)
    // console.log("All Course ", courses)
  };

  // Loading Skeleton
  const skItem = () => {
    return (
      <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className="h-[148px] min-w-[300px] rounded-xl skeleton "></div>

          <div className="flex flex-col w-[40%]">
            <p className="h-5 w-[50%] rounded-xl skeleton"></p>
            <p className="h-20 w-[60%] rounded-xl mt-3 skeleton"></p>

            <p className="h-2 w-[20%] rounded-xl skeleton mt-3"></p>
            <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          </div>
        </div>
      </div>
    );
  };
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const deleteQuiz = async (quizId) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/v1/quiz/deleteQuiz/${quizId}`);
      // Handle successful deletion, e.g., refresh the list or remove the item from state

      toast.success("Quiz deleted successfully");
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     {loading && <LoaderIcon/>} {/* Loader */}

      <Table className="rounded-2xl border border-richblack-800 ">


        {/* heading */}
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-3xl border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Quiz Name
            </Th>
            {/* <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Short Description
            </Th> */}
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Timer (seconds)
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Questions Count
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Created At
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Status
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
Actions
            </Th>
       
          </Tr>
        </Thead>

        {/* loading Skeleton */}
        {loading && (
          <div>
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}

        <Tbody>
          {!loading && courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >

                <Td className="flex-1 text-left text-sm font-medium text-richblack-100">
                  <p className="text-lg font-semibold text-richblack-5 capitalize">
                    {course.name}
                  </p>
                </Td>

                {/* <Td className="text-left text-sm font-medium text-richblack-100">
                      <p className="text-sm text-richblack-300 ">
                        {course.shortDescription.length >= 32
                          ? `${course.shortDescription.slice(0, 30)}...`
                          : `${course.shortDescription.slice(0, 30)}...`}
                      </p>


                    </Td> */}
                <Td className="flex flex-1 gap-x-4 relative">
                  <p className="text-lg font-semibold text-richblack-5 capitalize">
                  {formatTime(course.timer)}
                  </p>
                </Td>

                <Td className="flex flex-1 gap-x-4 relative">
                  <p className="text-lg font-semibold text-richblack-5 capitalize">
                    {course.questions.length}
                  </p>
                </Td>

                <Td className="text-left text-sm font-medium text-richblack-100">
                  {new Date(course.createdAt).toLocaleDateString()}
                </Td>

                <Td>
                  {course.status === COURSE_STATUS.DRAFT ? (
                    <p className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                      <HiClock size={14} />
                      Drafted
                    </p>
                  ) : (
                    <div className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                      <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                        <FaCheck size={8} />
                      </p>
                      Published
                    </div>
                  )}
                </Td>
                
                {/* <Td className="text-left text-sm text-richblack-100">
               
                </Td> */}

                <Link to={`/dashboard/quiz/${course._id}`} className="flex-1">
                <Td className="text-left text-sm text-richblack-100 flex justify-center items-center gap-5">
                
                  <p className="text-xl text-white cursor-pointer
                  ">View</p>
                </Td>
                  </Link>

           
              </Tr>

            ))
          )}
        </Tbody>
      </Table>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

// <Td className="text-sm font-medium text-richblack-100 ">
// {/* Edit button */}
// <button
//   disabled={loading}
//   onClick={() => { navigate(`/dashboard/edit-course/${course._id}`) }}
//   title="Edit"
//   className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
// >
//   <FiEdit2 size={20} />
// </button>

// {/* Delete button */}
// <button
//   disabled={loading}
//   onClick={() => {
//     setConfirmationModal({
//       text1: "Do you want to delete this course?",
//       text2:
//         "All the data related to this course will be deleted",
//       btn1Text: !loading ? "Delete" : "Loading...  ",
//       btn2Text: "Cancel",
//       btn1Handler: !loading
//         ? () => handleCourseDelete(course._id)
//         : () => { },
//       btn2Handler: !loading
//         ? () => setConfirmationModal(null)
//         : () => { },

//     })
//   }}
//   title="Delete"
//   className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
// >
//   <RiDeleteBin6Line size={20} />
// </button>
// </Td>
