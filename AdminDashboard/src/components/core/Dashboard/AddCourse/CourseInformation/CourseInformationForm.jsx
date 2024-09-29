import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from "../../../../../services/apis";
import { useForm } from 'react-hook-form';

import toast from "react-hot-toast";

export default function CourseInformationForm() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    courseTitle: "",
    courseShortDesc: "",
    courseImage: null,
    indexFile: null,
  });
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setData({
      ...data,
      [name]: files ? files[0] : value,
    });
  };
  const [loading, setLoading] = useState(false);
  const [editCourse, setEditCourse] = useState(false);

  const handleNextStep = () => {
    setLoading(true);

    onSubmit();
    setLoading(false);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("status", "Draft");
    formData.append("image", data.courseImage);
    formData.append("indexFile", data.indexFile);

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/course/createCourse`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Course created successfully!");
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if(loading){
    return <div className='flex justify-center items-center '>
      <h1>Loading...</h1>
    </div>
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {step === 1 && (
        <>
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
              {...register("courseTitle", { required: true })}
            />
            {errors.courseTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course title is required
              </span>
            )}
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
    {...register("courseShortDesc", { required: true })}
  />
  {errors.courseShortDesc && (
    <span className="ml-2 text-xs tracking-wide text-pink-200">
      Course Description is required
    </span>
  )}
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
              {...register("courseImage", { required: true })}
            />
            {errors.courseImage && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course image is required
              </span>
            )}
          </div>

          <button type="button" onClick={handleNextStep} className="btn btn-primary px-4   py-2 rounded-lg text-2xl bg-yellow-5 ">
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {/* Step 2: Course Image and Index File */}
      

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="indexFile">
              Index File <sup className="text-pink-200">*</sup>
            </label>
            <input
              type="file"
              id="indexFile"
              name="indexFile"
              onChange={handleInputChange}
              className="form-style w-full"
              {...register("indexFile", { required: true })}
            />
            {errors.indexFile && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Index file is required
              </span>
            )}
          </div>

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
    </form>
  );
}