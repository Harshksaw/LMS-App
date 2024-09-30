import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';


import { IoAddCircleOutline } from 'react-icons/io5';
import { setStep } from '../../../../../slices/courseSlice';

const CourseBuilderForm = ({ loading, editSectionName, cancelEdit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    // Handle form submission logic here
    console.log(data);
    dispatch(setStep(3));
  };

  const goBack = () => {
    // Handle go back logic here
    dispatch(setStep(1));
  };

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        {/* Edit Section Name OR Create Section */}
        <div className="flex items-end gap-x-4">
          {/* <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn> */}
          {/* if editSectionName mode is on */}
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CourseBuilderForm;