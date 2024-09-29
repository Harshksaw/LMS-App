
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL   
 } from "../../../../../services/apis";
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";

export default function CourseInformationForm() {


  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    courseTitle: '',
    courseShortDesc: '',
    courseImage: null,
  });


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
      setStep(step + 1);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false); // Reset loading state on error
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (e) => {


    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("status",   
 "Draft");
    formData.append("courseImage", data.courseImage);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/course/createCourse`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Corrected: Only 'Content-Type' header needed
        },
      });
      toast.success("Course created successfully!");
      console.log(res);
      toast.dismiss(); // Dismiss toast after success
    } catch (error) {
      toast.dismiss(); // Dismiss toast on error
      throw error; // Re-throw error for handling in handleNextStep
    }
  };

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
            <div className="flex justify-between">
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                Previous
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    )}
  </div>
);
};