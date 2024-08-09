import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../../services/apis";


const Step2 = ({ register, errors,setValue  ,getValues, courseBundleId,...props }: any) => {
    // const { setValue,getValues} = useForm();

    console.log(courseBundleId, 'step-2')
    const [courses, setCourses] = useState([]);
    const [studyMaterials, setstudyMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                toast.loading("fetching data...")
                // const coursesRes = await axios.get(`${BASE_URL}/api/v1/courses`);
                const studyRes = await axios.get(`${BASE_URL}/api/v1/study/getIsBundledMaterials`);
                const quizzesRes = await axios.get(`${BASE_URL}/api/v1/quiz/getAllisBundleQuizes`);

                // setCourses(coursesRes.data);
                setQuizzes(quizzesRes.data.data);
                setstudyMaterials(studyRes.data.data);


                //TODO only which as isBundle

                toast.dismiss();

                console.log("🚀 ~ fetchData ~ studyRes:", studyRes)
                console.log("🚀 ~ fetchData ~ quizzesRes:", quizzesRes)
                
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
          setValue("quizzes", existingQuizzes ? [...existingQuizzes, quizId] : [quizId]);
        } else {
          // Remove quiz ID from form data
          setValue("quizzes", existingQuizzes.filter((id) => id !== quizId));
        }
      };



//yeh wali
    return (
        <div className="flex-1 h-full">
            <h2 className="text-richblack-25">Select Courses and Quizzes</h2>
        <div className="flex flex-col gap-20 justify-center items-center">
            <div>
                <h3 className="text-richblack-25">StudyMaterial </h3>
                <i>coming soon</i>


                {/* {studyMaterials.length > 0  && studyMaterials?.map(material => (
                    <div key={material._id}>
                        <input
                            type="checkbox"
                            id={`course-${material._id}`}
                            onChange={(e) => handleCheckboxChange(e, course)}
                        />
                        <label htmlFor={`course-${material.id}?`}>{material.title}</label>
                    </div>
                ))} */}
            </div>

            <div>
                {/* <h3>Courses</h3> */}

                {/* {courses.map(course => (
                    <div key={course.id}>
                        <input
                            type="checkbox"
                            id={`course-${course.id}`}
                            onChange={(e) => handleCheckboxChange(e, course)}
                        />
                        <label htmlFor={`course-${course.id}`}>{course.name}</label>
                    </div>
                ))} */}
            </div>

            <div className="border-1 border-white w-full flex  flex-col  items-center justify-center gap-5">
                <h3 className="text-white font-semibold text-4xl">Quizzes</h3>
                    <div
                    className="flex flex-col gap-2 w-full "
                    >
                        
                {quizzes.length > 0  && quizzes?.map(quiz => (
                    <div key={quiz?._id} className="flex gap-5 text-xl">
                        <input
                            type="checkbox"
                            id={`quiz-${quiz._id}`}
                            onChange={(e) => handleCheckboxChange(e, quiz)}
                            />
                        <label className="text-richblack-25" htmlFor={`quiz-${quiz._id}`}>{quiz.name}</label>
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
        </div>
    );
};

export default Step2;