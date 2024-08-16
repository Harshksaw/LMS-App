import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../services/apis";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
const DailyUpdateForm = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    description: "",
    content: "",
    image: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${BASE_URL}/api/v1/DailyUpdate/getDailyUpdate/${id}`
      );
      console.log("individual blog data in edit blog is", response.data);
      setFormData(response.data);
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // setFormData({
    //   ...formData,
    //   [name]: value,
    // });
    if (name === "image" && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0], // Store the file directly in the state
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Saving daily update...");
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("heading", formData.heading);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("content", formData.content);
      formDataToSubmit.append("image", formData.image);
      // const response = await axios.post(
      //   `${BASE_URL}/api/v1/DailyUpdate/updateDailyUpdate/${id}`,
      //   formDataToSubmit
      // );
      const response = await axios.post(
        `${BASE_URL}/api/v1/DailyUpdate/DailyUpdate/${id}`,
        formDataToSubmit,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Response path:", response.data.path);
      toast.dismiss();
      toast.success("Daily update updated successfully");
      navigate("/dashboard/daily-update");
      console.log("Daily update update:", response.data);
    } catch (error) {
      console.error("Error updating daily update:", error);
      toast.dismiss();
      toast.error("Error updating daily update");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto p-4 bg-pure-greys-300  rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2  " htmlFor="title">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2 "
          htmlFor="heading"
        >
          Heading:
        </label>
        <input
          type="text"
          id="heading"
          name="heading"
          value={formData.heading}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2 "
          htmlFor="description"
        >
          Description:
        </label>
        <textarea
          name="description"
          value={formData.description}
          id="description"
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2 "
          htmlFor="content"
        >
          Content:
        </label>
        <textarea
          name="content"
          id="content"
          value={formData.content}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2 " htmlFor="image">
          Image URL:
        </label>
        <input
          type="file"
          name="image"
          id="image"
          // value={formData.image}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update
      </button>
    </form>
  );
};

export default DailyUpdateForm;
