import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import CourseInformationForm from './CourseInformation/CourseInformationForm';


const RenderSteps = ({ steps = [], editCourse }) => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  const handleNextStep = () => {
    setStep(step + 1);
    dispatch(setStep(step + 1));
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    dispatch(setStep(step - 1));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center">
              <div
                className={`grid aspect-square w-[34px] place-items-center rounded-full border-[1px] 
                  ${step === item.id ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                  : "border-richblack-700 bg-richblack-800 text-richblack-300"}
                  ${step > item.id && "bg-yellow-50 text-yellow-50"}`}
              >
                {step > item.id ?
                  (<FaCheck className="font-bold text-richblack-900" />)
                  : (item.id)
                }
              </div>
            </div>

            {/* dashes */}
            {item.id !== steps.length && (
              <div
                className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${step > item.id ? "border-yellow-50" : "border-richblack-500"}`}
              >
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div className={`sm:min-w-[130px] flex flex-col items-center gap-y-2 ${editCourse && 'sm:min-w-[270px]'}`} key={item.id}>
            <p className={`text-sm ${step >= item.id ? "text-richblack-5" : "text-richblack-500"}`}>
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Render specific component based on current step */}
      <CourseInformationForm step={step} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
    </>
  );
};

export default RenderSteps;