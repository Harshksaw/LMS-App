import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../services/apis";
import { useParams } from "react-router-dom";
const ViewBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState([
    {
      title: "",
      heading: "",
      description: "",
      content: "",
      image: "",
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${BASE_URL}/api/v1/DailyUpdate/getDailyUpdate/${id}`
      );
      console.log("individual blog data is", response.data);
      setBlogData(response.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <ViewBlogCard blogData={blogData} />
    </div>
  );
};

const ViewBlogCard = ({ blogData }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-300 bg-white rounded-lg">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mt-1">{blogData.title}</h1>
        <h2 className="text-xl font-semibold mt-2 p-2">{blogData.heading}</h2>
      </div>
      <img
        src={blogData.image}
        alt="blogImage"
        className="w-full h-auto mb-4"
      />
      <p className="text-lg mb-4">{blogData.description}</p>
      <div className="text-base leading-relaxed">{blogData.content}</div>
    </div>
  );
};
export default ViewBlog;
