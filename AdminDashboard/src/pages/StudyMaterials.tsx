import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../services/apis";

import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";


const StudyMaterials = () => {


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [isListed, setIsListed] = useState(false);
  const [isPartOfBundle, setIsPartOfBundle] = useState(false);

  const uploadStudyMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Uploading study material..."); 



    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);




      formData.append("isListed", isListed);
      formData.append("isPartOfBundle", isPartOfBundle);



      // if (file) {
        formData.append("file", file);
      // }

      // console.log("formData", formData);

      const response = await axios.post(
        `${BASE_URL}/api/v1/study/uploadStudyMaterials`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.dismiss()
    toast.success("Study material uploaded successfully", {
      duration: 4000,
      icon: "🚀",

    });
    setTitle("");
    setDescription("");
    setIsListed(false);
    setIsPartOfBundle(false);
    setFile(null);

      // console.log("Upload successful", response.data);
    } catch (error) {
      toast.dismiss()

      toast.error("Error uploading study material");
      console.error("Error uploading study material", error);
      // toast.error("Error uploading study material");
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
      }
    }
   finally{
    
   }

  };


  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="flex flex-row justify-center text-richblack-50 text-xl mb-20">
        Upload your study material 
      </h1>
      <div>
        <form onSubmit={uploadStudyMaterial}>
          <div className="flex flex-col space-y-2">
            <label className="text-richblack-5">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border border-yellow-25 rounded-md"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-richblack-5">Description</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border border-yellow-25 rounded-md"
            />
          </div>
          {/* <div className="flex flex-col space-y-2">
            <label className="text-richblack-5">Course ID</label>
            <input
              type="text"
              placeholder="Course ID"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="p-2 border border-yellow-25 rounded-md"
            />
          </div> */}
          <div className="flex flex-col space-y-2">
            <label className="text-richblack-5">File</label>
            <input
              title="Upload File"
              type="file"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              className="p-2 border border-yellow-25 rounded-md"
              required
            />
          </div>
          {/* <div className='flex flex-row-reverse gap-10 m-10 items-center justify-center space-y-2'>
            <label className='text-richblack-5'>Is Paid</label>
            <input
              type='checkbox'
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className='p-2 border border-yellow-25 rounded-md'
            />
          </div> */}
          <div className='flex flex-row-reverse gap-10 m-10 items-center justify-center space-y-2'>
            <label htmlFor='isListed' className='text-richblack-5'>Is Listed</label>
            <input
              id='isListed'
              type='checkbox'
              checked={isListed}
              onChange={(e) => setIsListed(e.target.checked)}
              className='p-2 border border-yellow-25 rounded-md'
            />
          </div>
          <div className='flex flex-row-reverse gap-10 m-10 items-center justify-center space-y-2'>
            <label htmlFor='isPartOfBundle' className='text-richblack-5'>Is Part of Bundle</label>

            <input
              id='isPartOfBundle'
              type='checkbox'
              checked={isPartOfBundle}
              onChange={(e) => setIsPartOfBundle(e.target.checked)}
              className='p-2 border border-yellow-25 rounded-md'
            />
          </div>
          {/* {isPaid && (
            <div className="flex flex-col space-y-2">
              <label className="text-richblack-5">Price</label>
              <input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-2 border border-yellow-25 rounded-md"
              />
            </div>
          )} */}

          <button
            type="submit"
            className="mt-4 p-2 bg-yellow-25 text-pure-greys-700 rounded-md"
          >
            Upload Study Material
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudyMaterials;
