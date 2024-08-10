import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../services/apis";
import { toast } from "react-hot-toast";
import moment from 'moment';

import TimePicker from "react-time-picker";
import TimeInput from "../components/core/Quiz/timer";
type Props = {};

const AddQuiz = (props: Props) => {
  const [loading, setisLoading] = useState(false);
  const [time, setTime] = useState('10:00:00');


  const [isQuizId, setIsQuizId] = useState(null);
  console.log("🚀 ~ AddQuiz ~ isQuizId:", isQuizId)

  const [quiz, setQuiz] = useState({

    name: "",
    shortDescription: "",
    category: "",
    image: null,
    isPaid: false,
    price: 0,
    testSeries: "",
    isListed: false,
    isPartOfBundle: true,
    time: 0,
    questions: [
      {
        question: { en: "", hin: "" },
        options: {
          optionA: { en: "", hin: "" },
          optionB: { en: "", hin: "" },
          optionC: { en: "", hin: "" },
          optionD: { en: "", hin: "" },
        },
        correctAnswer: { en: "", hin: "" },
      },
    ],
  });

  const handleTimeChange = (totalSeconds) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      time: totalSeconds,
    }));
  };
  const handleChangeQues = (e, field, index, lang) => {
    const { value } = e.target;
    const newQuestions = [...quiz.questions];
    switch (field) {
      case "question":
        newQuestions[index].question[lang] = value;
        setQuiz({ ...quiz, questions: newQuestions });
        break;
      case "price":
        setQuiz({ ...quiz, price: value });
        break;

      case "correctAnswer":
        newQuestions[index].correctAnswer[lang] = value;
        setQuiz({ ...quiz, questions: newQuestions });
      default:
        break;
    }
  };
  const addQuestion = () => {
    const newQuestion = {
      question: { en: "", hin: "" },
      options: {
        optionA: { en: "", hin: "" },
        optionB: { en: "", hin: "" },
        optionC: { en: "", hin: "" },
        optionD: { en: "", hin: "" },
      },
      correctAnswer: { en: "", hin: "" },
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    index?: number,
    subField?: string,
    lang?: string
  ) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQuiz({ ...quiz, [field]: file });
      // Update state with file information
    } else {
      // Handle non-file inputs as before
      if (index !== undefined && subField && lang) {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[index][field][subField][lang] = e.target.value;
        setQuiz({ ...quiz, questions: updatedQuestions });
      } else {
        setQuiz({ ...quiz, [field]: e.target.value });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to the server
    console.log(quiz);
  };
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ quiz:", quiz);
  }, [quiz]);

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSaveQuestion = async (question) => {
  console.log("🚀 ~ handleSaveQuestion ~ question:", question)

    // Check if all fields are entered
    const isQuestionValid = question.question.en && question.question.hin &&
      question.options.optionA.en && question.options.optionA.hin &&
      question.options.optionB.en && question.options.optionB.hin &&
      question.options.optionC.en && question.options.optionC.hin &&
      question.options.optionD.en && question.options.optionD.hin &&
      question.correctAnswer.en && question.correctAnswer.hin;

    if (!isQuestionValid || !isQuizId) {
      toast.error('Please fill in all fields before saving.');
      // alert('Please fill in all fields before saving.');
      return;
    }

    try {
      toast.loading('Saving question...');

      const response = await axios.post(`${BASE_URL}/api/v1/quiz/createQuestion`, {questionData :question

        ,quizId : isQuizId
      });
      console.log("🚀 ~ handleSaveQuestion ~ response:", response)
      toast.dismiss();
      toast.success('Question saved successfully.');
      console.log('Question saved:', response.data);
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };


  const IntializeQuiz = async () => {
    setisLoading(true);
    const formData = new FormData();
    formData.append("name", quiz.name);
    formData.append("shortDescription", quiz.shortDescription);
    formData.append("category", quiz.category);
    formData.append("image", quiz.image);
    formData.append("isPaid", quiz.isPaid);
    formData.append("time", quiz.time);
    formData.append("price", quiz.price);




    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/quiz/initializeQuiz`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.data);

      setIsQuizId(response.data.data._id);
      console.log("🚀 ~ IntializeQuiz ~ data:", response.data.data._id)

      toast.success("Quiz Added ");
    } catch (error) {
      toast.error("Please  resbmit quiz and check the value");
    }
    setisLoading(false);
  };

  const UpdateQuiz = async()=>{
    toast.loading('Updating Quiz...');
    setisLoading(true);
    const formData = new FormData();
    formData.append("name", quiz.name);
    formData.append("shortDescription", quiz.shortDescription);
    formData.append("category", quiz.category);
    formData.append("image", quiz.image);
    formData.append("isPaid", quiz.isPaid);
    formData.append("time", quiz.time);
    formData.append("price", quiz.price);



    formData.append("quizData", JSON.stringify(quiz.questions));

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/quiz/updateQuiz`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      toast.success("Quiz Added ");
    } catch (error) {
      toast.error("Please  resbmit quiz and check the value");
    }
    setisLoading(false);



  }

  const handleClick = () => {
    if (isQuizId === null) {

      IntializeQuiz();
    }

  }

  return (
    <div className="flex flex-col overflow-auto justify-center">
      <div className="flex flex-row space-x-10 justify-center items-center">
        <h1 className="text-richblack-25 p-10">
          Add Quiz in both English and Hindi
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6 px-0 sm:px-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6 py-6 w-full bg-richblack-800 rounded-md shadow-md justify-center items-center  "
        >
          <div className="flex flex-row w-full  justify-start items-start bg-richblack-800  gap-10 rounded-md ">
            <div className="w-full">
              <div className="flex   flex-col  items-start  mt-5 space-y-2">
                <label className="text-richblack-5">Enter the quiz name</label>
                <input
                  type="text"
                  placeholder="Quiz Name"
                  value={quiz.name}
                  onChange={(e) => handleChange(e, "name")}
                  className="p-2 w-full border border-yellow-25 rounded-md"
                />
              </div>

              <div className="flex  flex-col items-start  mt-5 space-y-2">
                <label className="text-richblack-5">
                  Add short Description
                </label>
                <textarea
                  placeholder="Short Description"
                  value={quiz.shortDescription}
                  onChange={(e) => handleChange(e, "shortDescription")}
                  className="p-2 border  w-full border-yellow-25 rounded-md"
                />
              </div>
            </div>
            <div>
              {/* <div className="flex  flex-col items-start mt-5 space-y-2">
                <label className="text-richblack-5">Select the Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  value={quiz.category}
                  onChange={(e) => handleChange(e, "category")}
                  className="p-2 border  w-full border-yellow-25 rounded-md"
                />
              </div> */}

              <div className="flex  flex-col items-start mt-5 space-y-2">
                <label className="text-richblack-5">Image URL</label>
                <input
                  type="file"
                  name="image"
                  placeholder="Image URL"
                  onChange={(e) => handleChange(e, "image")}
                  className="p-2 border  w-full border-yellow-25 rounded-md"
                />
              </div>


              {/* <div className="flex  flex-row  items-start gap-10 mt-5 space-x-5 ">
                <label className="text-richblack-5 flex items-center">
                  Paid:
                  <input
                    type="checkbox"
                    checked={quiz.isPaid}
                    onChange={(e) =>
                      setQuiz({ ...quiz, isPaid: e.target.checked })
                    }
                    className="ml-2"
                  />
                </label>
              </div> */}
            </div>
          </div>

          {quiz.isPaid && (
            <div className="flex flex-col space-y-2 mt-5">
              <label className="text-richblack-5">Price</label>
              <input
                type="number"
                placeholder="Price"
                value={quiz.price}
                onChange={(e) => handleChange(e, "price")}
                className="p-2 border border-yellow-25 rounded-md"
              />
            </div>
          )}
          {/* adding test series
           */}
          {/* <div className="flex flex-row  items-start gap-10 mt-5 space-x-2">
            <label htmlFor="" className="text-richblack-5 flex items-center">
              TestSeries
            </label>
            <input
              type="text"
              placeholder="Test Series"
              value={quiz.testSeries}
              onChange={(e) => handleChange(e, "testSeries")}
              className="ml-2"
            />
          </div> */}
          {/* isListed */}
          <div className="flex flex-col space-y-5 mt-5">
            {/* <div className="flex flex-row items-center gap-5 p-4 bg-richblack-700 border border-yellow-25 rounded-md">
              <label
                htmlFor="isListed"
                className="text-richblack-5 flex items-center"
              >
                isListed
              </label>
              <input
                id="isListed"
                type="checkbox"
                placeholder="isListed"
                className="ml-2"
                checked={quiz.isListed}
                onChange={(e) =>
                  setQuiz({ ...quiz, isListed: e.target.checked })
                }
              />
            </div> */}

            <div className="flex flex-row items-center gap-5 p-4 bg-richblack-700 border border-yellow-25 rounded-md">
              <label
                htmlFor="isPartOfBundle"
                className="text-richblack-5 flex items-center"
              >
                isPartOfBundle
              </label>
              <input
                id="isPartOfBundle"
                type="checkbox"
                placeholder="isPartOfBundle"
                className="ml-2"
                checked={quiz.isPartOfBundle}
                onChange={(e) =>
                  setQuiz({ ...quiz, isPartOfBundle: e.target.checked })
                }
              />
            </div>
          </div>
          <div className="p-4 bg-richblack-100 rounded-md w-60 self-center">

{/* Add the TimeInput component here */}
<TimeInput onTimeChange={handleTimeChange} />

</div>

          <div className="flex flex-col bg-white text-brown-50 h-2"></div>


          {
            isQuizId !== null ? (

              <>
              <div className="flex flex-col  w-full ">
                {quiz.questions.map((question, index) => (
                  <div key={index} className="mb-4 flex flex-col gap-5 ">
                    <div
                      className="flex justify-between items-center p-4 bg-richblack-400    rounded-md shadow-sm cursor-pointer"
                      onClick={() => toggleAccordion(index)}
                    >
                      <h3 className="text-richblack-5">Quiz {index + 1}</h3>
                      <span>{openIndex === index ? "-" : "+"}</span>
                    </div>
                    {openIndex === index && (
                      <div className="flex flex-col space-y-4 p-4 bg-richblack-400 rounded-md shadow-sm w-[100%]">
                        <div className="flex flex-col space-y-2">
                          <label className="text-richblack-5">
                            Question (English)
                          </label>
                          <textarea
                            placeholder="Question (English)"
                            value={question.question.en}
                            onChange={(e) =>
                              handleChangeQues(e, "question", index, "en")
                            }
                            className="p-2 border border-yellow-25 rounded-md resize-y"
                            rows={4}
                          />
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-richblack-5">
                            Question (Hindi)
                          </label>
                          <textarea
                            placeholder="Question (Hindi)"
                            value={question.question.hin}
                            onChange={(e) =>
                              handleChangeQues(e, "question", index, "hin")
                            }
                            className="p-2 border border-yellow-25 rounded-md resize-y"
                          />
                        </div>

                        {["A", "B", "C", "D"].map((option) => (
                          <div
                            key={option}
                            className="flex flex-row space-y-2 gap-10 justify-around items-center  border-2 border-blue-5"
                          >
                            <div className="flex  flex-col gap-5">
                              <label className="text-richblack-5">
                                Option {option} (English)
                              </label>
                              <input
                                type="text"
                                placeholder={`Option ${option} (English)`}
                                value={question.options[`option${option}`].en}
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "options",
                                    index,
                                    `option${option}`,
                                    "en"
                                  )
                                }
                                className="p-2 border border-yellow-25 rounded-md"
                              />
                            </div>
                            <div className=" flex  flex-col gap-5">
                              <label className="text-richblack-5">
                                Option {option} (Hindi)
                              </label>
                              <input
                                type="text"
                                placeholder={`Option ${option} (Hindi)`}
                                value={question.options[`option${option}`].hin}
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "options",
                                    index,
                                    `option${option}`,
                                    "hin"
                                  )
                                }
                                className="p-2 border border-yellow-25 rounded-md"
                              />
                            </div>
                          </div>
                        ))}
                        <div className="flex flex-col space-y-2">
                          <label className="text-richblack-5">
                            Correct Answer (English)
                          </label>
                          <input
                            type="text"
                            placeholder="Correct Answer (English)"
                            value={question.correctAnswer.en}
                            onChange={(e) =>
                              handleChangeQues(e, "correctAnswer", index, "en")
                            }
                            className="p-2 border border-yellow-25 rounded-md"
                          />
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-richblack-5">
                            Correct Answer (Hindi)
                          </label>
                          <input
                            type="text"
                            placeholder="Correct Answer (Hindi)"
                            value={question.correctAnswer.hin}
                            onChange={(e) =>
                              handleChangeQues(e, "correctAnswer", index, "hin")
                            }
                            className="p-2 border border-yellow-25 rounded-md"
                          />
                        </div>
                        <button
                          className="p-2 bg-blue-400 text-white rounded-md"
                          onClick={() => handleSaveQuestion(question)}>Save</button>
                      </div>


                    )}

                  </div>
                ))}
               

              </div>
              <button
            onClick={addQuestion}
            className="mt-4 p-2 bg-caribbeangreen-400 text-richblack-5 rounded-md"
          >
            Add Question
          </button>
              </>

            ) : (
              <div className="flex flex-col  w-full ">
                <h2 className="
    text-richblack-5 text-3xl self-center
    ">Please initialze quiz first</h2>
              </div>
            )
          }
        

          <button
            type="submit"
            className= {`p-2 bg-blue-500 text-white rounded-md  ${isQuizId ? "hidden": "block"} `}
            

            onClick={handleClick}
            >
        Initializ  Quiz
          </button>


        </form>
      </div>

    </div>
  );
};

export default AddQuiz;


