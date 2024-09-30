
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL   
 } from "../../../../../services/apis";
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { setStep } from '../../../../../slices/courseSlice';

export default function CourseInformationForm() {


  const [step, setStep2] = useState(1);
  const [data, setData] = useState({
    courseTitle: '',
    courseShortDesc: '',
    courseImage: null,
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);


  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };
  const [courseId , setCourseId] = useState("")


  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setData({
      ...data,
      [name]: files ? files[0] : value,
    });
  };

  const [loading, setLoading] = useState(false);

  const handleNextStep = async () => {
    setLoading(true);
    try {
      await onSubmit(); // Submit data using handleSubmit
      setLoading(false);
      setStep2(step + 1);
      dispatch(setStep(2))
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false); // Reset loading state on error
    }
  };

  const handlePrevStep = () => {
    setStep2(step - 1);
  };

  const onSubmit = async (e) => {


    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("status",   
 "Draft")
    formData.append("courseImage", data.courseImage);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/videocourse/createVideo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Corrected: Only 'Content-Type' header needed
        },
      });
      if(res.status === 201) {
        toast.success("Course created successfully!");

        setCourseId(res._id)

      }


      toast.dismiss(); // Dismiss toast after success
    } catch (error) {
      toast.dismiss(); // Dismiss toast on error
      throw error; // Re-throw error for handling in handleNextStep
    }
  };

  const VideoUpload = async (e) => {

    try {
      
      e.preventDefault();
      setLoading(true);
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("lessonId", courseId);

      const res = await axios.post(`${BASE_URL}/api/v1/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Corrected: Only 'Content-Type' header needed
        },
      });
      if(res.status === 201) {
        toast.success("Video Uploaded successfully!");
        setLoading(false);
      }

    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false); // Reset loading state on error
      
    }
  }

  return (
    <div>
    {loading ? (
      <div className='flex justify-center items-center h-screen'>
        <div className='spinner'></div>
      </div>
    ) : (
      <div>
        {/* Conditional rendering based on step */}
        {step === 1 && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
              className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
            >
              {/* Step 1: Course Title and Description */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                  Course Title <sup className="text-pink-200">*</sup>
                </label>
                <input
                  id="courseTitle"
                  name="courseTitle"
                  placeholder="Enter Course Title"
                  value={data.courseTitle}
                  onChange={handleInputChange}
                  className="form-style w-full"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
                  Course Short Description <sup className="text-pink-200">*</sup>
                </label>
                <textarea
                  id="courseShortDesc"
                  name="courseShortDesc"
                  placeholder="Enter Description"
                  value={data.courseShortDesc}
                  onChange={handleInputChange}
                  className="form-style resize-x-none min-h-[130px] w-full"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseImage">
                  Course Image <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type="file"
                  id="courseImage"
                  name="courseImage"
                  onChange={handleInputChange}
                  className="form-style w-full"
                />
              </div>
              <button type="submit" className="btn btn-primary px-4 py-2 rounded-lg text-2xl bg-yellow-5">
                Next
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            {/* Step 2: Course Image and Index File */}

<form onSubmit={VideoUpload}>

            <div className="flex flex-col space-y-2">
              <label className="text-sm text-richblack-5" htmlFor="courseVideo">
                Course Video <sup className="text-pink-200">*</sup>
              </label>
              <input
                type="file"
                id="courseVideo"
                name="courseVideo"
                accept="video/*"
                onChange={handleVideoChange}
                className="form-style w-full"
                />
              {videoPreview && (
                <video controls className="mt-2 w-full">
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div>

              

              <button type="submit"  disabled={loading} className="btn btn-primary px-4 py-2 rounded-lg text-2xl bg-yellow-5">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
    </form>
          </>
        )}
      </div>
    )}
  </div>
);
};