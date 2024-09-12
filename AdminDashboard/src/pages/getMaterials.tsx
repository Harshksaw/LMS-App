import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../services/apis";

import toast from "react-hot-toast";
import { Button } from "@mui/material";

interface Material {
  _id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  isListed: boolean;
  isPartOfBundle: boolean;
  createdAt: string;
  updatedAt: string;
}

const GetMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/study/getAllAdminStudyMaterials`
        );
        setAllData(response?.data?.data);
        setMaterials(response.data.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, []);

  const handleDelete = (id) => async () => {
    try {
      await axios.post(`${BASE_URL}/api/v1/course/deleteStudyMaterial/${id}`);
      toast.success("Material deleted successfully");
      setMaterials((prev) => prev.filter((material) => material._id !== id));
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const search = (text: string) => {
    if (!text) return setMaterials(allData);
    const resultsData = allData.filter((user: any) => {
      return (user?.title + user?.description + user?.status)
        ?.toString()
        .toLowerCase()
        ?.includes(text?.toLowerCase());
    });

    setMaterials(resultsData);
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center w-full">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Study Materials
        </h1>
        <input
          type="search"
          placeholder="search here..."
          onChange={(e) => search(e.target.value)}
          className="px-2 rounded text-black outline-none"
        />
      </div>
      <div className="flex flex-col gap-4 w-full rounded-md  px-10 py-16">
        {Array.isArray(materials) &&
          materials.map((material) => (
            <div
              key={material._id}
              className="  border flex flex-row bg-white  p-10  gap-10 
          justify-between items-center  border-yellow-25 rounded-md shadow-md w-full"
            >
              <div
                className="flex flex-row bg-white   gap-10 
          justify-center items-center"
              >
                <h3 className="text-2xl font-bold">{material.title}</h3>
                <p className="text-sm text-gray-600">{material.description}</p>
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {material.fileType}
                </a>
              </div>
              <div>
                <Button
                  variant="primary"
                  className="text-pink-300 text-2xl "
                  onClick={handleDelete(material._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GetMaterials;
