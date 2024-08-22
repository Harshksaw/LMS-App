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

  console.log(courseBundleId, "step-2");
  const [courses, setCourses] = useState([]);

  const [quizzes, setQuizzes] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);

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

        // setCourses(coursesRes.data);
        setQuizzes(quizzesRes.data.data);
        setStudyMaterials(studyRes.data.data);

        // console.log("🚀 ~ fetchData ~ studyRes.data.data:", studyRes.data.data);

        //TODO only which as isBundle

        toast.dismiss();

        console.log("🚀 ~ fetchData ~ studyRes:", studyRes);
        console.log("🚀 ~ fetchData ~ quizzesRes:", quizzesRes);
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to fetch data");
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (e, item) => {
    const quizId = item._id;
    const existingQuizzes = getValues("quizzes");

    if (e.target.checked) {
      // Add quiz ID to form data
      setValue(
        "quizzes",
        existingQuizzes ? [...existingQuizzes, quizId] : [quizId]
      );
    } else {
      // Remove quiz ID from form data
      setValue(
        "quizzes",
        existingQuizzes.filter((id) => id !== quizId)
      );
    }
  };
  

  const handleMaterialCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, materialId: string) => {
    if (e.target.checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    }
  };

  return (
    // <div className="flex-1 overflow-y-hidden max-h-full gap-5">

    <div className=" flex-1 grid grid-cols-2 justify-between gap-20 h-full    items-center ">
      <div className="h-full pb-10">
        <h3 className="text-white font-semibold text-4xl">StudyMaterial </h3>

        <div
          className="flex flex-col items-start    gap-5 p-5 border-sm bg-richblack-700 rounded-md h-full
                    overflow-y-auto w-full "
        >
          {studyMaterials.length > 0 &&
            studyMaterials?.map((material) => (
              <div
                key={material._id}
                className="bg-richblack-100 rounded-md p-2 flex gap-4 w-full  "
              >
                <input
                  type="checkbox"
                  id={`course-${material._id}`}
                  onChange={(e) => handleMaterialCheckboxChange(e, material._id)}
                />
                <label htmlFor={`course-${material.id}?`}>
                  {material.title}
                </label>
              </div>
            ))}
        </div>
      </div>

      <div className="">
        <h3 className="text-white font-semibold text-4xl">Quizzes </h3>
        <div
          className="flex flex-col items-start  gap-5 p-5 border-sm bg-richblack-700 rounded-md h-full
  overflow-y-auto w-full"
        >
          {quizzes.length > 0 &&
            quizzes?.map((quiz) => (
              <div
                key={quiz?._id}
                className="bg-richblack-100 rounded-md p-2 flex gap-4   w-full text-xl"
              >
                <input
                  type="checkbox"
                  id={`quiz-${quiz._id}`}
                  onChange={(e) => handleCheckboxChange(e, quiz)}
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
