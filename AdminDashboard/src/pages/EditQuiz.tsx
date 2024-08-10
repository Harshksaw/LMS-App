import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../services/apis";
import toast from "react-hot-toast";

const EditQuiz = () => {
  const { id } = useParams();
  const [openIndex, setOpenIndex] = useState(null);
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

  useEffect(() => {
    // Fetch the quiz data from the server using the quiz ID
    const fetchQuiz = async () => {
      try {
        toast.loading("Loading quiz...");
        const response = await axios.get(
          `${BASE_URL}/api/v1/quiz/getQuizById/${id}`
        );
        console.log("🚀 ~ fetchQuiz ~ response:", response);
        setQuiz(response.data.data);
      } catch (error) {
        toast.error("Failed to load quiz");
        console.error(error);
      } finally {
        toast.dismiss();
      }
    };

    fetchQuiz();
  }, [id]);

  const handleChange = (e, field, index, option, lang) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field][option][lang] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSaveQuestion = async (question) => {
    // Check if all fields are entered
    const isQuestionValid =
      question.question.en &&
      question.question.hin &&
      question.options.optionA.en &&
      question.options.optionA.hin &&
      question.options.optionB.en &&
      question.options.optionB.hin &&
      question.options.optionC.en &&
      question.options.optionC.hin &&
      question.options.optionD.en &&
      question.options.optionD.hin &&
      question.correctAnswer.en &&
      question.correctAnswer.hin;

    if (!isQuestionValid) {
      alert("Please fill in all fields before saving.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/question/${question.id}`,
        question
      );
      console.log("Question updated:", response.data);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };




  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuiz({
      ...quiz,
      [name]: type === "checkbox" ? checked : value,
    });
  };




  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleChangeQues = (e, field, index, lang) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field][lang] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };


  const handleOptionChange = (qIndex, option, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[option] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSaveQuiz = async () => {
    try {
      toast.loading("Saving quiz...");
      const response = await axios.put(
        `${BASE_URL}/api/v1/quiz/updateQuiz/${id}`,
        quiz
      );
      toast.dismiss();
      toast.success("Quiz saved successfully.");
      console.log("Quiz saved:", response.data);
    } catch (error) {
      toast.error("Error saving quiz");
      console.error("Error saving quiz:", error);
    }
  };


  console.log("Quiz:", quiz.questions);

  return (
    <div className="flex flex-col overflow-auto justify-center">
      <div className="flex flex-row w-full  justify-start items-start bg-richblack-800  gap-10 rounded-md ">
        <div className="w-full">
          <div className="flex   flex-col  items-start  mt-5 space-y-2">
            <label className="text-richblack-5">Enter the quiz name</label>
            <input
              type="text"
              placeholder="Quiz Name"
              value={quiz.name}
              onChange={handleInputChange}
              className="p-2 w-full border border-yellow-25 rounded-md"
            />
          </div>
          <div className="flex  justify-between items-center">
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

            <div className="flex  flex-row items-start mt-5 space-y-2 bg-richblack-50 ">
              <label>Is Part of Bundle:</label>

              <input
                type="checkbox"
                name="isPartOfBundle"
                checked={quiz.isPartOfBundle}
                onChange={handleInputChange}
                className="p-2 border  w-full border-yellow-25 rounded-md"
              />
            </div>

          </div>

          <div className="flex  flex-col items-start  mt-5 space-y-2">
            <label className="text-richblack-5">Add short Description</label>
            <textarea
              placeholder="Short Description"
              value={quiz.shortDescription}
              onChange={handleInputChange}
              className="p-10 border  w-full border-yellow-25 rounded-md"
            />
          </div>
        </div>
        <div>

        </div>
      </div>

      <div className="flex flex-col bg-brown-25 mt-10 text-brown-100 h-2"></div>
      <div>
        {quiz.questions && Array.isArray(quiz.questions) ? (
          
          quiz.questions.map((question, index) => (
            <div key={index} className="mb-4 flex flex-col gap-5">
              <div
                className="flex justify-between items-center p-4 bg-richblack-400 rounded-md shadow-sm cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-richblack-5">Quiz {index + 1}</h3>
                <span>{openIndex === index ? "-" : "+"}</span>
              </div>
              {openIndex === index && (
                <div className="flex flex-col space-y-4 p-4 bg-richblack-400 rounded-md shadow-sm w-[100%]">
                  <div className="flex flex-col space-y-2">
                    <label className="text-richblack-5">Question (English)</label>
                    <textarea
                      placeholder="Question (English)"
                      value={question.question.en}
                      onChange={(e) => handleChangeQues(e, "question", index, "en")}
                      className="p-2 border border-yellow-25 rounded-md resize-y"
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-richblack-5">Question (Hindi)</label>
                    <textarea
                      placeholder="Question (Hindi)"
                      value={question.question.hin}
                      onChange={(e) => handleChangeQues(e, "question", index, "hin")}
                      className="p-2 border border-yellow-25 rounded-md resize-y"
                    />
                  </div>

                  {["A", "B", "C", "D"].map((option) => (
                    <div
                      key={option}
                      className="flex flex-row space-y-2 gap-10 justify-around items-center border-2 border-blue-5"
                    >
                      <div className="flex flex-col gap-5">
                        <label className="text-richblack-5">Option {option} (English)</label>
                        <input
                          type="text"
                          placeholder={`Option ${option} (English)`}
                          value={question.options[`option${option}`].en}
                          onChange={(e) => handleChange(e, "options", index, `option${option}`, "en")}
                          className="p-2 border border-yellow-25 rounded-md"
                        />
                      </div>
                      <div className="flex flex-col gap-5">
                        <label className="text-richblack-5">Option {option} (Hindi)</label>
                        <input
                          type="text"
                          placeholder={`Option ${option} (Hindi)`}
                          value={question.options[`option${option}`].hin}
                          onChange={(e) => handleChange(e, "options", index, `option${option}`, "hin")}
                          className="p-2 border border-yellow-25 rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col space-y-2">
                    <label className="text-richblack-5">Correct Answer (English)</label>
                    <input
                      type="text"
                      placeholder="Correct Answer (English)"
                      value={question.correctAnswer.en}
                      onChange={(e) => handleChangeQues(e, "correctAnswer", index, "en")}
                      className="p-2 border border-yellow-25 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-richblack-5">Correct Answer (Hindi)</label>
                    <input
                      type="text"
                      placeholder="Correct Answer (Hindi)"
                      value={question.correctAnswer.hin}
                      onChange={(e) => handleChangeQues(e, "correctAnswer", index, "hin")}
                      className="p-2 border border-yellow-25 rounded-md"
                    />
                  </div>
                  <button
                    className="p-2 bg-blue-400 text-white rounded-md"
                    onClick={() => handleSaveQuestion(question)}
                  >
                    Save
                  </button>
                </div>
              )}

            </div>
          ))

        ) : (
          <p>No questions available</p>
        )}
      </div>
      <button onClick={handleSaveQuiz}>Save Quiz</button>

      {/* {quiz.questions && Array.isArray(quiz.questions) && (
           <button
          //  onClick={addQuestion}
           className="mt-4 p-2 bg-caribbeangreen-400 text-richblack-5 rounded-md"
         >
           Add Question
         </button>
      )} */}
    </div>
  );
};

export default EditQuiz;
