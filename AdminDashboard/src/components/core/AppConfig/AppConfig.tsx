import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/apis";

const AppConfig = () => {
  const [formData, setFormData] = useState({
    message: "",
    carouselImages: "",
    socialMediaLinks: "",
    aboutUs: "",
    rateOthersLink: "",
    shareAppLink: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/v1`, formData);
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage("Failed to update information. Please try again.");
      console.error("Error updating information:", error);
    }
  };
  return (
    <div className="max-w-full mx-auto mt-10 p-6 bg-gray-600 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Update Information
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-white"
          >
            Under Maintaince Message:
          </label>
          <div className="mt-1">
            <label className="inline-flex">
              <input
                type="radio"
                id="message-true"
                name="message"
                value="true"
                checked={formData.message === "true"}
                defaultChecked={false}
                className="mt-1 block w-full px-3 py-2 text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <span className="ml-2 text-white">True</span>
            </label>
            <label className="inline-flex ml-4">
              <input
                type="radio"
                id="message-false"
                name="message"
                value="false"
                checked={formData.message === "false"}
                // defaultChecked={false}
                className="mt-1 block w-full px-3 py-2 border text-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <span className="ml-2 text-white">False</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="carouselImages"
            className="block text-sm font-medium text-white"
          >
            Carousel Images (multiple images can be selected):
          </label>
          <input
            type="file"
            id="carouselImages"
            name="carouselImages"
            value={formData.carouselImages}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="socialMediaLinks"
            className="block text-sm font-medium text-white"
          >
            Social Media Links (JSON format):
          </label>
          <textarea
            id="socialMediaLinks"
            name="socialMediaLinks"
            value={formData.socialMediaLinks}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="aboutUs"
            className="block text-sm font-medium text-white"
          >
            About Us:
          </label>
          <textarea
            id="aboutUs"
            name="aboutUs"
            value={formData.aboutUs}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="rateOthersLink"
            className="block text-sm font-medium text-white"
          >
            Rate Others Link:
          </label>
          <input
            type="text"
            id="rateOthersLink"
            name="rateOthersLink"
            value={formData.rateOthersLink}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="shareAppLink"
            className="block text-sm font-medium text-white"
          >
            Share App Link:
          </label>
          <input
            type="text"
            id="shareAppLink"
            name="shareAppLink"
            value={formData.shareAppLink}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white border-black py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-center text-sm text-gray-600">
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default AppConfig;
