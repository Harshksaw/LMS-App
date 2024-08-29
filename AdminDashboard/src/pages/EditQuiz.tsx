import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../services/apis";
import toast from "react-hot-toast";
import TimeInput from "../components/core/Quiz/timer";

const EditQuiz = () => {
  const { id } = useParams();
  const [openIndex, setOpenIndex] = useState(null);
  const [deleted, setDeleted] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const [refresh , setrefresh] = useState(false)  

  const [quiz, setQuiz] = useState({
    name: "",
    shortDescription: "",

    image: null,




    isPartOfBundle: true,
    timer: 0,
    questions: [
      {
        _id: '',
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

  const addQuestion = () => {
    const newQuestion = {
      question: { en: "", hin: "" },
      options: {
        optionA: { en: "", hin: "" },
        optionC: { en: "", hin: "" },
        optionB: { en: "", hin: "" },
        optionD: { en: "", hin: "" },
      },
      correctAnswer: { en: "", hin: "" },
    };

    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, newQuestion],
    }));

    // console.log("Quiz:", quiz);
  };

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
        toast.dismiss()
      } catch (error) {
        toast.error("Failed to load quiz");
        console.error(error);
        toast.dismiss()
      }
    };

    fetchQuiz();
  }, [id, refresh,deleted]);

  const handleChange = (e, field, index, option, lang) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field][option][lang] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSaveQuestion = async (question) => {

    console.log("🚀 ~ handleSaveQuestion ~ question:", question);
    // setDisabled(true)
    toast.loading("Saving question...");
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
      toast.dismiss()
      return;
    }
    
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/quiz/createQuestion`,
        { quizId: id, questionData: question }
      );
      toast.dismiss()
      toast.success("Question created successfully.");
      
      if (response.data) {
        
        // toast.dismiss();
        setOpenIndex(null);
      }
      console.log("Question updated:", response.data);
      setDisabled(false)
      setrefresh((prev) => !prev)
    } catch (error) {
      toast.dismiss();
      setDisabled(false)
      toast.error("Error updating question");
      console.error("Error updating question:", error);
    }
    // toast.dismiss();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setQuiz({
        ...quiz,
        [name]: files[0], // assuming only one file is uploaded
      });
    } else {
      setQuiz({
        ...quiz,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleChangeQues = (e, field, index, lang) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field][lang] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };



  const handleSaveQuiz = async () => {
    try {
      
      toast.loading("Saving quiz...");
      const response = await axios.put(
        `${BASE_URL}/api/v1/quiz/updateQuiz/${id}`,
        quiz
      );
      if(response.status == 200){

        toast.success("Quiz saved successfully.");
      }else{
        toast.error("Error saving quiz");
      }
      toast.dismiss();
      addQuestion();
      setDisabled(false)
      console.log("Quiz saved:", response.data);
    } catch (error) {
      setDisabled(false)
      toast.error("Error saving quiz");
      console.error("Error saving quiz:", error);
    }
  };
  const deleteQuestion = async(qid) => {
    console.log(qid)
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/v1/quiz/deleteQuestion/${qid}`,
      );

      if (response.data) {
        toast.success("Question deleted successfully");
        setDeleted((prev) => !prev)
      }

    } catch (error) {
      console.log(error)
    }
  }
  const handleUpdateQuestion = async(questionData) => {
    
    
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/quiz/updateQuestions/${questionData._id}`,{

          questionData
        }
      );
      if (response.data) {
      console.log("resonpose .data",response.data)
        setrefresh((prev)=> !prev)
        toast.success("Question deleted successfully");
        // setDeleted((prev) => !prev)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // console.log("Quiz:", quiz.questions);
  const handleUpdateQuizDetails = async()=>{
 
    try {
      // toast.loading("updateing quiz details...");
      // toast.dismiss()

      const formData = new FormData();
      formData.append("name", quiz.name);
      formData.append("shortDescription", quiz.shortDescription);
      formData.append("image", quiz.image);
      formData.append("isPartOfBundle", quiz.isPartOfBundle);
      formData.append("timer", quiz.timer);
      const response = await axios.post(
        `${BASE_URL}/api/v1/quiz/editQuizDetails/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(response.data.data){
        toast.success("quiz details updated successfully")
      }
      console.log(response.data.data);
   
  // console.log(obj)
    } catch (error) {
      console.log(error)
      toast.dismiss()
    }
   
  }

  const handleTimeChange = (totalSeconds) => {
    // console.log("🚀 ~ handleTimeChange ~ totalSeconds:", totalSeconds)
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      timer: totalSeconds,
    }));
  };
console.log(disabled, 'disabled')
const handleOptionChange = (questionIndex, optionKey) => {
  // console.log("🚀 ~ handleOptionChange ~ questionIndex:", questionIndex, optionKey)
  
  setQuiz((prevQuiz) => {
    const updatedQuestions = [...prevQuiz.questions];
    updatedQuestions[questionIndex].correctAnswer = {
      en: updatedQuestions[questionIndex].options[optionKey].en,
      hin: updatedQuestions[questionIndex].options[optionKey].hin,
    };
    // console.log("🚀 ~ setQuiz ~  updatedQuestions:",  updatedQuestions)
    return { ...prevQuiz, questions: updatedQuestions };
  });
};

  return (

      <div className="flex flex-col overflow-auto justify-center">
        <div className="flex flex-row w-full  justify-start items-start bg-richblack-800  gap-10 rounded-md ">
          <div className="w-full">
            <div className="flex   flex-col  items-start  mt-5 space-y-2">
              <label className="text-richblack-5">Enter the quiz name</label>
              <input
              name="name"
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
                  onChange={(e) => handleInputChange(e, "image")}
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
              name="shortDescription"
                placeholder="Short Description"
                value={quiz.shortDescription}
                onChange={handleInputChange}
                className="p-10 border  w-full border-yellow-25 rounded-md"
              />
            </div>

            <div className="p-4  mt-10 bg-richblack-100 rounded-md flex items-center justify-center self-center w-full">
            {/* Add the TimeInput component here */}
            <TimeInput onTimeChange={handleTimeChange} />
          </div>
            <button onClick={()=> handleUpdateQuizDetails()} className={'bg-white border-yellow-25 px-8 py-2 rounded-md my-4 hover:bg-richblack-50'}>Edit quiz details</button>
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
                      <label className="text-richblack-5">Question (Hindi)</label>
                      <textarea
                        placeholder="Question (Hindi)"
                        value={question.question.hin}
                        rows={5}
  
                        onChange={(e) =>
                          handleChangeQues(e, "question", index, "hin")
                        }
                        className="p-2 border border-yellow-25 rounded-md resize-y"
                      />
                    </div>
  
                  
                     {["A", "B", "C", "D"].map((option) => (
            <div
              key={option}
              className="flex flex-row space-y-2 gap-10 justify-around items-center border-2 border-blue-5"
            >
              <div className="flex flex-col gap-5">
                <label className="text-richblack-5">
                  Option {option} (English)
                </label>
                <input
                  type="text"
                  placeholder={`Option ${option} (English)`}
                  value={question.options[`option${option}`].en}
                  onChange={(e) =>
                    handleChange(e, "options", index, `option${option}`, "en")
                  }
                  className="p-2 border border-yellow-25 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-5">
                <label className="text-richblack-5">
                  Option {option} (Hindi)
                </label>
                <input
                  type="text"
                  placeholder={`Option ${option} (Hindi)`}
                  value={question.options[`option${option}`].hin}
                  onChange={(e) =>
                    handleChange(e, "options", index, `option${option}`, "hin")
                  }
                  className="p-2 border border-yellow-25 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name={`correctAnswer-${index}`}
                  checked={
                    question.correctAnswer.en === question.options[`option${option}`].en &&
                    question.correctAnswer.hin === question.options[`option${option}`].hin
                  }
                  onChange={() => handleOptionChange(index, `option${option}`)}
                />
                <label className="ml-2">Correct Answer</label>
              </div>
            </div>
          ))}
                  

                    <div className={'w-full flex gap-4'}>
                    {
                      question._id ? (
                        <button
                        disabled={disabled}
                        className="p-2 disabled:bg-blue-25 bg-blue-400 w-full text-white rounded-md"
                        onClick={() => handleUpdateQuestion(question)}
                      >
                        Update
                      </button>
                      ) : (
                        <button
                        disabled={disabled}
                        className="p-2 disabled:bg-blue-25 bg-blue-400 w-full text-white rounded-md"
                        onClick={() => handleSaveQuestion(question)}
                      >
                        Save
                      </button>
                      )
                    }
                  
                    <button
                      className="p-2 w-full bg-[#da3232] text-white rounded-md"
                      onClick={() => deleteQuestion(question._id)}
                    >
                      Delete
                    </button>
                    </div>
                   
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No questions available</p>
          )}
        </div>
        {/* <button   
        color="primary"
        onClick={handleSaveQuiz}>Save Quiz</button> */}
          
        <div className="flex flex-row justify-between items-center">
          <button
            className="text-2xl text-white text-bold bg-blue-400 p-2 rounded-md"
            onClick={addQuestion}
            // disabled={savingQuestion}
          >
            Add Question
          </button>
          {/* <button
            className="text-2xl text-white text-bold bg-caribbeangreen-500 p-2 rounded-md"
            onClick={handleSaveQuiz}
            disabled={savingQxuiz}
          >
           Update Quiz
          </button> */}

          </div>
          </div>


  );
};

export default EditQuiz;
