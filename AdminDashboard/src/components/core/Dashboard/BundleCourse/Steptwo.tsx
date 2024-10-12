import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../../services/apis";

const Step2 = ({
  register,
  errors,
  setValue,
  getValues,
  courseBundleId,
  selectedMaterials,
  setSelectedMaterials,
  ...props
}: any) => {
  // const { setValue,getValues} = useForm();
  const [quizzes, setQuizzes] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  
  console.log("🚀 ~ selectedMaterials:", selectedMaterials)

  useEffect(() => {
    const fetchData = async () => {
      try {
        toast.loading("fetching data...");
        // const coursesRes = await axios.get(`${BASE_URL}/api/v1/courses`);
        const studyRes = await axios.get(
          `${BASE_URL}/api/v1/study/getIsBundledMaterials`
        );
        const quizzesRes = await axios.get(
          `${BASE_URL}/api/v1/quiz/getAllisBundleQuizes`
        );
        setQuizzes(quizzesRes.data.data);
        setStudyMaterials(studyRes.data.data);
        console.log("🚀 ~ fetchData ~ studyRes.data.data:", studyRes.data.data)
        toast.dismiss();
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);
  console.log(studyMaterials)
  const handleCheckboxChange = (e, item) => {
    const quizId = item._id;
    const existingQuizzes = getValues("quizzes");

    if (e.target.checked) {
      setValue(
        "quizzes",
        existingQuizzes ? [...existingQuizzes, quizId] : [quizId]
      );
      setSelectedQuizzes((prev) => [...prev, quizId]);
    } else {
      setValue(
        "quizzes",
        existingQuizzes.filter((id) => id !== quizId)
      );
      setSelectedQuizzes((prev) => prev.filter((id) => id !== quizId));
    }
  };

  const handleMaterialCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    materialId: string
  ) => {
    if (e.target.checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter((id) => id !== materialId));
    }
  };

  const handleMaterialChange = (e, materialId) => {
    handleMaterialCheckboxChange(e, materialId);
    setSelectedMaterials((prev) =>
      e.target.checked
        ? [...prev, materialId]
        : prev.filter((id) => id !== materialId)
    );
  };

  const handleQuizChange = (e, quiz) => {
    handleCheckboxChange(e, quiz);
    setSelectedQuizzes((prev) =>
      e.target.checked
        ? [...prev, quiz._id]
        : prev.filter((id) => id !== quiz._id)
    );
  };

  return (


    <div className=" flex-1 grid grid-cols-2 justify-between gap-20 h-full    items-center  max-h-screen">
      <div className="h-full pb-10">
        <h3 className="text-white font-semibold text-4xl">StudyMaterial </h3>

        <div
          className="flex flex-col items-start    gap-5 p-5 border-sm bg-richblack-700 rounded-md h-full
                    overflow-y-auto w-full  max-h-96 mt-2 border-blue-200 border-4"
        >
          {studyMaterials.length > 0 &&
            studyMaterials?.map((material) => (
              <div key={material._id} className="bg-richblack-100 rounded-md p-2 flex gap-4 w-full"
              
              >
              <input
                type="checkbox"
                id={`course-${material._id}`}
                checked={selectedMaterials.includes(material._id)}
                onChange={(e) => handleMaterialChange(e, material._id)}
              />
              <label htmlFor={`course-${material._id}`}>{material.title}</label>
            </div>
            ))}
        </div>
      </div>

      <div className="">
        <h3 className="text-white font-semibold text-4xl">Quizzes </h3>
        <div
          className="flex flex-col items-start  gap-5 p-5 border-sm bg-richblack-700 rounded-md h-full
  overflow-y-auto w-full max-h-96 border-blue-200 border-4 mt-4 "
        >
          {quizzes.length > 0 &&
            quizzes?.map((quiz) => (
              <div
                key={quiz?._id}
                className="bg-richblack-100 rounded-md p-2 flex gap-4   w-full text-xl"
              >
                <input
                  type="checkbox"
                  checked={getValues().quizzes?.some((i) => i == quiz._id)}
                  id={`quiz-${quiz._id}`}
                  onChange={(e) => handleQuizChange(e, quiz)}
                />
                <label className="text-black " htmlFor={`quiz-${quiz._id}`}>
                  {quiz?.name}
                </label>
              </div>
            ))}
        </div>
      </div>

      {errors.selectedItems && (
        <span className="ml-2 text-xs tracking-wide  text-white">
          Please select at least one item
        </span>
      )}
    </div>

    // </div>
  );
};

export default Step2;
