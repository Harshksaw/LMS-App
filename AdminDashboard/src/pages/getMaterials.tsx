import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/apis';

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

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/study/getAllAdminStudyMaterials`);
        console.log("🚀 ~ fetchMaterials ~ response:", response.data)
        setMaterials(response.data.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="flex flex-row justify-center text-richblack-50 text-xl mb-20">
        Study Materials
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full rounded-md bg-white">
        {Array.isArray(materials) && materials.map((material) => (
          <div key={material._id} className="  border flex flex-row  p-10  gap-10 justify-center items-center  border-yellow-25 rounded-md shadow-md w-full">
            <h3 className="text-2xl font-bold">{material.title}</h3>
            <p className="text-sm text-gray-600">{material.description}</p>
            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {material.fileType}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetMaterials;