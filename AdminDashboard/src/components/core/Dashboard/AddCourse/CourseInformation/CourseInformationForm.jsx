import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from "../../../../../services/apis";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

export default function CourseInformationForm({ step, handleNextStep, handlePrevStep }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    courseTitle: '',
    courseShortDesc: '',
    courseImage: null,
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setData({
      ...data,
      [name]: files ? files[0] : value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("status", "Draft");
    formData.append("courseImage", data.courseImage);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/videocourse/createVideo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      if (res.status === 201) {
        toast.success("Course created successfully!");
          // console.log("____",res.data.data._id)
        setCourseId(res.data.data._id);
        handleNextStep();
      }
      toast.dismiss(); 
    } catch (error) {
      toast.dismiss(); // Dismiss toast on error
      // toast.error("An error occurred. Please try again.");
      setLoading(false); // Reset loading state on error
    }
  };

  const VideoUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0); // Reset upload progress for video

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("lessonId", courseId);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => { // Track upload progress for video
          const totalUploadSize = progressEvent.loaded;
          const totalFileSize = progressEvent.total;
          const progress = Math.round((totalUploadSize / totalFileSize) * 100);
          setUploadProgress(progress);
        },
      });
      if (res.status === 201) {
        toast.success("Video Uploaded successfully!");
        setLoading(false);
        navigate('/dashboard/all-course-video'); // Replace with your desired path
        toast.success("Redirecting to the course page...");
      }
    } catch (error) {
      console.error(error);
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div>
     {loading ? (
        <div className='flex justify-center  h-screen'>
          {step === 1 ? (
            <div className="flex flex-col items-center ">
              <div className="spinner"></div>
              <p className="text-lg text-richblack-5 mt-4">Creating Course...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-5">
              <div className="spinner"></div>
              <p className="text-lg text-richblack-5 mt-4">Uploading Video...</p>
              <div className="w-full bg-gray-200 rounded-full h-5 mt-2">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-center text-2xl m-0 text-blue-500 font-bold">
                  {uploadProgress}%
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
      <div>
        {/* Conditional rendering based on step */}
        {step === 1 && (
          <form
            onSubmit={onSubmit}
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
        )}
        {step === 2 && (
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
              <button type="submit" disabled={loading} className="btn btn-primary px-4 py-2 rounded-lg text-2xl bg-yellow-5">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary px-4 py-2 rounded-lg text-2xl bg-gray-500 ml-4">
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    )}
  </div>
);
}