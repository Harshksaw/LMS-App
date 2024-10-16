import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/apis";

const AppConfig = () => {
  const [formData, setFormData] = useState({
    maintenanceMode: false,
    message: "",
    carouselImages: [],

  });

  const [responseMessage, setResponseMessage] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      carouselImages: files,
    });
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "carouselImages") {
        formData[key].forEach((file) => {
          formDataToSend.append("carousel", file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/app/config`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage("Failed to update information. Please try again.");
      console.error("Error updating information:", error);
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-gray-800 rounded-lg shadow-lg bg-richblack-400" >
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Update Information
      </h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-6 flex items-center">
          <label
            htmlFor="maintenanceMode"
            className="block text-sm font-medium text-gray-300 mr-4"
          >
            Maintenance Mode:
          </label>
          <input
            type="checkbox"
            id="maintenanceMode"
            name="maintenanceMode"
            checked={formData.maintenanceMode}
            onChange={handleSwitchChange}
            className="toggle-checkbox h-6 w-6 rounded-full bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300"
          >
            Under Maintenance Message:
          </label>
          <input
            type="text"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-2 p-3 block w-full rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="carouselImages"
            className="block text-sm font-medium text-gray-300"
          >
            Carousel Images:
          </label>
          <input
            type="file"
            id="carouselImages"
            name="carouselImages"
            accept="image/*"
            max={5}
            multiple
            onChange={handleFileChange}
            className="mt-2 p-3 block w-full rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
       <div className="mt-4 grid grid-cols-2 gap-4">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Selected ${index}`}
                className="h-48 w-full object-cover rounded-md"
              />
            ))}
          </div>
        </div>
       
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update Information
        </button>
      </form>
      {responseMessage && (
        <p className="mt-6 text-center text-white">{responseMessage}</p>
      )}
    </div>
  );
};


export default AppConfig;