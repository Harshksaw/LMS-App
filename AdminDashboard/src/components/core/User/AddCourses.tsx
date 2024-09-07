import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../services/apis";
import axios from "axios";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

export default function AddCourses({ id }: { id: string }) {
  const [courses, setCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseBundle, setCourseBundle] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${BASE_URL}/api/v1/auth/getAllUserCourses/${id}`
      );
      if (!response.data) {
        toast.error("Something went wrong");
        return;
      }
      console.log("🚀 ~ fetchData ~ response:", response.data.courses);

      setCourses(response.data.courses);
    };

    const fetchCourses = async () => {
      const response = await axios.get(
        `${BASE_URL}/api/v1/bundle/get-all-course-bundle`
      );

      if (!response.data) {
        toast.error("Something went wrong");
        return;
      }
      setCourseBundle(response.data.data);
      console.log("🚀 ~ fetchCourses ~ response:", response.data.data);
    };

    fetchData();
    fetchCourses();
  }, []);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addCourse = () => {
    handleOpenModal();
    const newCourse = {
      id: courses.length + 1,
      name: `Course ${courses.length + 1}`,
    };
    setCourses([...courses, newCourse]);
  };

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const handleCourseSelect = (id: number) => {
    setSelectedCourseId(id);
  };

  const handleConfirmSelection = () => {
    console.log(`Confirmed course ID: ${selectedCourseId}`);

    toast.loading("Adding course to user");
    const addCourseToUser = async () => {
      const res = await axios.post(
        `${BASE_URL}/api/v1/bundle/assignCourseBundle`,
        {
          userId: id,
          courseId: selectedCourseId,
        }
      );
      if (res.status == 200) {
        toast.success("Course added to user");
      }
    };

    toast.dismiss();
    addCourseToUser();
    setRefresh(!refresh);
    toast.success("Course added to user");
    handleCloseModal();
  };

  return (
    <div className="flex justify-center items-center">
      <Tabs value={selectedTab} onChange={handleTabChange}>
        {/* {courses.map((course) => (
          <Tab key={course.id} label={course.BundleName} />
        ))} */}
      </Tabs>
      <Button variant="contained" color="primary" onClick={addCourse}>
        Add Course
      </Button>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        className="flex justify-center items-center"
      >
        <Box
          sx={{ p: 4, bgcolor: "gray", margin: "auto", width: 800, gap: 30 }}
        >
          <Typography variant="h6" component="h2">
            Courses You wan too add
          </Typography>

          <ul className="bg-richblack-25 w-full self-center gap-5 my-5">
            {courseBundle.map((course) => (
              <li
                key={course._id}
                className={`p-2 border-b-2 border-gray-200 text-center cursor-pointer ${
                  selectedCourseId === course._id
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => handleCourseSelect(course._id)}
              >
                {course.bundleName}
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              Close
            </Button>
            <div className="bg-white rounded-md flex justify-center items-center  shadow-md">
              {selectedCourseId && (
                <button
                  className="mt-2 p-2 bg-green-500 text-xl font-bold text-black rounded-md hover:bg-green-600 transition duration-300"
                  onClick={handleConfirmSelection}
                >
                  Confirm Selection
                </button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
