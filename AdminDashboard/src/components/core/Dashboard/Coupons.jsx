import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import moment from "moment/moment";
import { FaPen, FaTrashAlt, FaList, FaPlus } from "react-icons/fa";
import { BASE_URL } from "../../../services/apis";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const courseUrl = `${BASE_URL}/api/v1/bundle/course-bundle`;
// const url = `${BASE_URL}/api/v1/coupon/`;
const url = `http://localhost:4000/api/v1/coupon/`;

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [course, setCourse] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState({});
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [courseModel, setCourseModel] = useState(false);

  const [inputData, setInputData] = useState({
    code: "",
    discountPercentage: "",
    expiryDate: "",
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInputData({
      code: "",
      discountPercentage: "",
      expiryDate: "",
    });
    setEditMode(false);
    setSelected({});
  };

  const showModalCourse = (item) => {
    setCourseModel(true);
    setSelected(item);
  };
  const hideModalCourse = () => {
    setCourseModel(false);
    setSelected({});
  };

  const getCoupons = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setCoupons(data?.data);
    } catch (error) {}
  };
  const getCourse = async () => {
    try {
      const res = await fetch(courseUrl);
      const data = await res.json();
      setCourse(data.data.map((i) => ({ label: i.bundleName, value: i._id })));
    } catch (error) {}
  };

  const addCoupon = async () => {
    const courses = selectedCourse.map((i) => i.value);

    if (coupons.some((i) => i.code === inputData.code) && !editMode) {
      toast.error("coupon created already with this code");
      return;
    }
    try {
      if (editMode) {
      }
      const res = await fetch(url + (editMode ? selected._id : ""), {
        method: editMode ? "put" : "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...inputData, courses }),
      });
      const data = await res.json();
      if (data.status) {
        toast.success(
          `coupon details ${editMode ? "updated" : "saved"} successfully`
        );
        handleCloseModal();
        getCoupons();
        setSelectedCourse([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        `error while coupon   ${editMode ? "updating" : "creating"}...`
      );
    }
  };
  const editCoupon = async (item) => {
    const { code, discountPercentage, expiryDate } = item;
    setInputData({
      code,
      discountPercentage,
      expiryDate: moment(expiryDate).format("YYYY-MM-DD"),
    });

    setSelectedCourse(course.filter((i) => item.courses.includes(i.value)));
    setSelected(item);
    setEditMode(true);
    setIsModalOpen(true);
  };
  const deleteCoupon = async (id) => {
    try {
      const res = await fetch(url + id, {
        method: "delete",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      toast.success("coupon details removed successfully");
      getCoupons();
    } catch (error) {
      toast.error("error while coupon removing...");
    }
  };

  const onChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getCoupons();
    getCourse();
  }, []);
  return (
    <main>
      <div className="mb-14 flex justify-between items-center">
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Coupons
        </h1>
        <div className="flex gap-5">
          <button
            // onClick={showLogs}
            onClick={() => navigate("/dashboard/logs")}
            className="bg-white flex px-3 py-1 gap-2 justify-center items-center"
          >
            <FaList /> Logs
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white flex px-3 py-1 gap-2 justify-center items-center"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>
      {coupons.length ? (
        <div className="flex items-center flex-wrap gap-[4rem]">
          {coupons.map((item) => {
            return (
              <div
                key={item._id}
                className="bg-black border from-purple-600 to-indigo-600 text-white text-center py-10 px-16 rounded-lg shadow-md relative"
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {item.discountPercentage}% flat off
                </h3>
                <div className="flex items-center space-x-2 mb-6">
                  <span
                    id="cpnCode"
                    className="border-dashed border text-white px-4 py-2 rounded-l"
                  >
                    {item.code}
                  </span>
                  <button
                    onClick={() => {
                      toast.success("code copied to clipboard");
                      navigator.clipboard.writeText(item.code);
                    }}
                    id="cpnBtn"
                    className="border border-white bg-white text-black px-4 py-2 rounded-r cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
                <p className="text-sm">
                  Valid Till: {moment(item.expiryDate).format("DD MMM, YYYY")}
                </p>
                <p className="text-xs text-pink-400">
                  Status:{" "}
                  {moment(item.expiryDate).isBefore(new Date())
                    ? "Expired"
                    : "Active"}
                </p>

                {!!item.courses.length ? (
                  <a
                    className="text-xs text-white underline cursor-pointer"
                    onClick={() => showModalCourse(item)}
                  >
                    Show Assigned Course
                  </a>
                ) : (
                  <p className="text-xs text-pink-400">Not Assigned Course</p>
                )}

                <button
                  onClick={() => editCoupon(item)}
                  className="flex justify-center items-center w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"
                >
                  <FaPen className="text-pink-500 font-bold text-xl" />
                </button>
                <button
                  onClick={() => deleteCoupon(item._id)}
                  className="flex justify-center items-center w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"
                >
                  <FaTrashAlt className="text-pink-500 font-bold text-xl" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-white text-center">No coupon Found...</p>
      )}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        className="flex justify-center items-center"
      >
        <Box
          sx={{ p: 2, bgcolor: "white", margin: "auto", width: 800, gap: 30 }}
        >
          <Typography variant="h6" component="h2">
            {editMode ? "Edit" : "Add"} Coupon
          </Typography>

          <div className="w-full my-5 flex flex-wrap gap-5">
            <div className="flex flex-col gap-3 items-start w-1/3">
              <label htmlFor="code" className="bg-transparent ">
                Coupon Code
              </label>
              <input
                onChange={onChange}
                value={inputData.code}
                type="text"
                id="code"
                name="code"
                className="border outline-none w-full px-3 py-2 rounded-md uppercase"
                placeholder="coupon code"
              />
            </div>
            <div className="flex flex-col gap-3 items-start w-1/3">
              <label htmlFor="code" className="bg-transparent ">
                Percentage
              </label>
              <input
                onChange={onChange}
                type="number"
                value={inputData.discountPercentage}
                id="discountPercentage"
                name="discountPercentage"
                className="border outline-none w-full px-3 py-2 rounded-md"
                placeholder="coupon percentage %"
              />
            </div>
            <div className="flex flex-col gap-3 items-start w-1/3">
              <label htmlFor="code" className="bg-transparent ">
                Expiry Date
              </label>
              <input
                onChange={onChange}
                type="date"
                id="expiryDate"
                value={inputData.expiryDate}
                name="expiryDate"
                className="border outline-none w-full px-3 py-2 rounded-md"
                min={new Date()}
              />
            </div>
            <div className="flex flex-col gap-3 items-start w-1/3">
              <label htmlFor="course" className="bg-transparent ">
                Select Course
              </label>
              <Select
                options={course}
                className="w-full"
                isMulti
                placeholder="All course allowed"
                onChange={setSelectedCourse}
                value={selectedCourse}
              />
            </div>
          </div>
          <div className="flex justify-end gap-5 items-center">
            <button
              className="btn bg-pink-300 text-white rounded-md px-3 py-1"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              onClick={addCoupon}
              className="btn bg-gradient-to-tr border border-black rounded-md px-3 py-1"
            >
              Submit
            </button>
          </div>
        </Box>
      </Modal>
      {courseModel && (
        <Modal
          open={courseModel}
          // onClick={hideModalCourse}
          className="flex justify-center items-center"
        >
          <Box
            sx={{ p: 2, bgcolor: "white", margin: "auto", width: 800, gap: 30 }}
          >
            <Typography variant="h6" component="h2">
              Assigned Course
            </Typography>

            <h5 className="text-md font-semibold">Code: {selected.code}</h5>
            <div className="w-full space-y-3 mt-5">
              {selected.courses?.map((i, index) => (
                <p>
                  {index + 1}. {course.find((item) => item.value == i)?.label}
                </p>
              ))}
            </div>
            <div className="flex justify-end gap-5 items-center">
              <button
                className="btn bg-pink-300 text-white rounded-md px-3 py-1"
                onClick={hideModalCourse}
              >
                close
              </button>
            </div>
          </Box>
        </Modal>
      )}
    </main>
  );
};

export default Coupons;
