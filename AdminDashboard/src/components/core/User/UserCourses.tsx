import React, { useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../services/apis";
import axios from "axios";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const UserCourses = ({ id }) => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/bundle/getAllUserBundle/${id}`);
      console.log(response.data, "---response.data18888");
      setCourses(response.data.data.courses);
      toast.success('Courses fetched successfully');
    } catch (error) {
      toast.error('Error fetching courses');
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    getCourses();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleremoveCourse = async (courseId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this course?');
    if (isConfirmed) {
      try {
        await axios.post(`${BASE_URL}/api/v1/bundle/removeUserBundle`, {
          userId: id,
          courseId
        });
        setCourses(courses.filter(course => course._id !== courseId));
        toast.success('Course removed successfully');
        // window.location.reload();
      } catch (error) {
        toast.error('Error removing course');
        console.error('Error removing course:', error);
      }
    }
  };

  return (
    <div className="p-5 bg-blue-400 rounded-md">
      <div className="text-center text-2xl font-bold text-white cursor-pointer" onClick={handleOpenModal}>
        User Courses
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="fixed inset-0 flex items-center justify-center bg-pure-greys-200 bg-opacity-75 p-10">
          <Box className="bg-pure-greys-600 p-20 rounded-lg shadow-md max-h-full overflow-y-auto w-[60%]">
            <h2 className="text-4xl p-5">Course Details</h2>

            {isLoading ? (
              <div className="flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                {courses?.length == 0 ? (
                  <div className="text-center text-2xl py-10 text-richblack-5 mt-4">
                    No courses found ...........
                  </div>
                ) : (
                  courses?.map((course) => (
                    <div
                      key={course?._id}
                      className="bg-richblack-100 flex mx-auto p-6 bg-gray-400 rounded-lg shadow-md mb-4 w-full"
                    >
                      <div className="flex flex-col justify-center">
                        <h5>Course ID: {course?._id}</h5>
                        <p>Course Name: {course?.name}</p>
                      </div>
                      <Button
                        onClick={() => handleremoveCourse(course?._id)}
                        color="error"
                        className="cursor-pointer bg-pink-300"
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default UserCourses;