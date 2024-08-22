import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/apis';

import toast from 'react-hot-toast';
import { Button } from '@mui/material';

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

  const handleDelete = (id) => async () => {
    try {
      await axios.post(`${BASE_URL}/api/v1/course/deleteStudyMaterial/${id}`);
      toast.success('Material deleted successfully');
      setMaterials((prev) => prev.filter((material) => material._id !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="flex flex-row justify-center text-richblack-50 text-4xl mb-20">
        Study Materials
      </h1>
      <div className="flex flex-col gap-4 w-full rounded-md  px-10 py-20">
        {Array.isArray(materials) && materials.map((material) => (
          <div key={material._id} className="  border flex flex-row bg-white  p-10  gap-10 
          justify-between items-center  border-yellow-25 rounded-md shadow-md w-full">

            <div className='flex flex-row bg-white   gap-10 
          justify-center items-center'>

            <h3 className="text-2xl font-bold">{material.title}</h3>
            <p className="text-sm text-gray-600">{material.description}</p>
            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {material.fileType}
            </a>
            </div>
            <div>
              <Button variant="primary" className='text-pink-300 text-2xl '
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