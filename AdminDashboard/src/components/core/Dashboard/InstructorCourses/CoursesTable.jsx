import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useState } from "react";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import { HiClock } from "react-icons/hi";
import { formatDate } from "../../../../services/formatDate";
import ConfirmationModal from "../../../common/ConfirmationModal";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../../../services/apis";

export default function CoursesTable({ courses, setCourses, loading }) {
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  //bundle COurses

  const deleteCourse = (id) => {
    setSelected(id);
    setConfirmationModal(true);
  };

  const deleteCourseSuccess = async () => {
    setLoadingDelete(true);
    try {
      toast.loading("deleting course.........");
      const res = await axios.post(
        `${BASE_URL}/api/v1/bundle/delete-bundle/${selected}`
      );
      setCourses(res);
      setSelected(null);
      setConfirmationModal(false);
      toast.success("Course deleted successfully");
      window.location.reload();
      setLoadingDelete(false);
      toast.dismiss();
    } catch (error) {
      toast.error(
        error?.response?.data?.error ?? "error while deleting course*"
      );
      setLoadingDelete(false);
      toast.dismiss();
    }
  };

  return (
    <>
      <Table className="rounded-2xl border border-richblack-800 ">
        {/* heading */}
        {/* heading */}
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-3xl border-b bg-transparent border-b-richblack-800 px-6 py-2">
            <Td className="flex-1 text-left text-sm font-medium text-richblack-100">
              Bundle Courses
            </Td>
            <Td className="text-left text-sm font-medium text-richblack-100">
              Price
            </Td>
            <Td className="text-left text-sm font-medium text-richblack-100">
              Actions
            </Td>
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
                <Td className="flex flex-1 gap-x-4 relative">
                  {/* course Thumbnail */}

                  <img
                    src={course?.image}
                    alt={course?.bundleName}
                    className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover"
                  />

                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-richblack-5 capitalize">
                      {course.bundleName}
                    </p>
                    <p className="text-xl text-richblack-300">
                      {course.bundleName}
                    </p>

                    {/* created At */}
                    <p className="text-[12px] text-richblack-100 mt-4">
                      Created: {formatDate(course?.createdAt)}
                    </p>

                    {/* updated At */}
                    <p className="text-[12px] text-richblack-100">
                      Updated: {formatDate(course?.updatedAt)}
                    </p>

                    {/* course status */}
                    {course.status === "Draft" ? (
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
                  </div>
                </Td>

                {/* course price */}
                <Td className="text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </Td>

                <Td className="text-left text-sm text-richblack-100">
                  <FaTrashAlt
                    className="cursor-pointer text-red-500"
                    onClick={() => deleteCourse(course._id)}
                  />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal
          modalData={{
            text1: "Are you sure?",
            text2: "do you want to delete?",
            btn1Text: "Cancel",
            btn2Text: "Yes",
            btn1Handler: () => setConfirmationModal(false),
            btn2Handler: deleteCourseSuccess,
            loadingDelete,
          }}
        />
      )}
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
