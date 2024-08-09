import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../services/apis";
import { toast } from "react-hot-toast";

// const quizsample = {
//   questions: [
//     {
//       question: {
//         en: "What is the capital of France?",
//         hin: "फ्रांस की राजधानी क्या है?",
//       },
//       options: {
//         optionA: {
//           en: "Paris",
//           hin: "पेरिस",
//         },
//         optionB: {
//           en: "London",
//           hin: "लंदन",
//         },
//         optionC: {
//           en: "Berlin",
//           hin: "बर्लिन",
//         },
//         optionD: {
//           en: "Madrid",
//           hin: "मैड्रिड",
//         },
//       },
//       correctAnswer: {
//         en: "Paris",
//         hin: "पेरिस",
//       },
//     },
//     {
//       question: {
//         en: "What is the largest planet in our solar system?",
//         hin: "हमारे सौर मंडल का सबसे बड़ा ग्रह कौन सा है?",
//       },
//       options: {
//         optionA: {
//           en: "Earth",
//           hin: "पृथ्वी",
//         },
//         optionB: {
//           en: "Jupiter",
//           hin: "बृहस्पति",
//         },
//         optionC: {
//           en: "Saturn",
//           hin: "शनि",
//         },
//         optionD: {
//           en: "Mars",
//           hin: "मंगल",
//         },
//       },
//       correctAnswer: {
//         en: "Jupiter",
//         hin: "बृहस्पति",
//       },
//     },
//     {
//       question: {
//         en: "Who wrote 'To Kill a Mockingbird'?",
//         hin: "'टू किल अ मॉकिंगबर्ड' किसने लिखा?",
//       },
//       options: {
//         optionA: {
//           en: "Harper Lee",
//           hin: "हार्पर ली",
//         },
//         optionB: {
//           en: "Mark Twain",
//           hin: "मार्क ट्वेन",
//         },
//         optionC: {
//           en: "Ernest Hemingway",
//           hin: "अर्नेस्ट हेमिंग्वे",
//         },
//         optionD: {
//           en: "F. Scott Fitzgerald",
//           hin: "एफ. स्कॉट फिट्जगेराल्ड",
//         },
//       },
//       correctAnswer: {
//         en: "Harper Lee",
//         hin: "हार्पर ली",
//       },
//     },
//     {
//       question: {
//         en: "What is the chemical symbol for water?",
//         hin: "पानी का रासायनिक प्रतीक क्या है?",
//       },
//       options: {
//         optionA: {
//           en: "H2O",
//           hin: "एच2ओ",
//         },
//         optionB: {
//           en: "O2",
//           hin: "ओ2",
//         },
//         optionC: {
//           en: "CO2",
//           hin: "सीओ2",
//         },
//         optionD: {
//           en: "H2",
//           hin: "एच2",
//         },
//       },
//       correctAnswer: {
//         en: "H2O",
//         hin: "एच2ओ",
//       },
//     },
//     {
//       question: {
//         en: "What is the speed of light?",
//         hin: "प्रकाश की गति क्या है?",
//       },
//       options: {
//         optionA: {
//           en: "300,000 km/s",
//           hin: "300,000 किमी/से",
//         },
//         optionB: {
//           en: "150,000 km/s",
//           hin: "150,000 किमी/से",
//         },
//         optionC: {
//           en: "450,000 km/s",
//           hin: "450,000 किमी/से",
//         },
//         optionD: {
//           en: "600,000 km/s",
//           hin: "600,000 किमी/से",
//         },
//       },
//       correctAnswer: {
//         en: "300,000 km/s",
//         hin: "300,000 किमी/से",
//       },
//     },
//     {
//       question: {
//         en: "Who painted the Mona Lisa?",
//         hin: "मोना लिसा किसने चित्रित की?",
//       },
//       options: {
//         optionA: {
//           en: "Leonardo da Vinci",
//           hin: "लियोनार्डो दा विंची",
//         },
//         optionB: {
//           en: "Vincent van Gogh",
//           hin: "विंसेंट वैन गॉग",
//         },
//         optionC: {
//           en: "Pablo Picasso",
//           hin: "पाब्लो पिकासो",
//         },
//         optionD: {
//           en: "Claude Monet",
//           hin: "क्लाउड मोनेट",
//         },
//       },
//       correctAnswer: {
//         en: "Leonardo da Vinci",
//         hin: "लियोनार्डो दा विंची",
//       },
//     },
//     {
//       question: {
//         en: "What is the smallest prime number?",
//         hin: "सबसे छोटा अभाज्य संख्या कौन सी है?",
//       },
//       options: {
//         optionA: {
//           en: "1",
//           hin: "1",
//         },
//         optionB: {
//           en: "2",
//           hin: "2",
//         },
//         optionC: {
//           en: "3",
//           hin: "3",
//         },
//         optionD: {
//           en: "5",
//           hin: "5",
//         },
//       },
//       correctAnswer: {
//         en: "2",
//         hin: "2",
//       },
//     },
//     {
//       question: {
//         en: "What is the capital of Japan?",
//         hin: "जापान की राजधानी क्या है?",
//       },
//       options: {
//         optionA: {
//           en: "Tokyo",
//           hin: "टोक्यो",
//         },
//         optionB: {
//           en: "Kyoto",
//           hin: "क्योटो",
//         },
//         optionC: {
//           en: "Osaka",
//           hin: "ओसाका",
//         },
//         optionD: {
//           en: "Nagoya",
//           hin: "नागोया",
//         },
//       },
//       correctAnswer: {
//         en: "Tokyo",
//         hin: "टोक्यो",
//       },
//     },
//     {
//       question: {
//         en: "What is the powerhouse of the cell?",
//         hin: "कोशिका का पावरहाउस क्या है?",
//       },
//       options: {
//         optionA: {
//           en: "Nucleus",
//           hin: "नाभिक",
//         },
//         optionB: {
//           en: "Mitochondria",
//           hin: "माइटोकॉन्ड्रिया",
//         },
//         optionC: {
//           en: "Ribosome",
//           hin: "राइबोसोम",
//         },
//         optionD: {
//           en: "Golgi apparatus",
//           hin: "गोल्जी तंत्र",
//         },
//       },
//       correctAnswer: {
//         en: "Mitochondria",
//         hin: "माइटोकॉन्ड्रिया",
//       },
//     },
//     {
//       question: {
//         en: "What is the boiling point of water?",
//         hin: "पानी का क्वथनांक क्या है?",
//       },
//       options: {
//         optionA: {
//           en: "100°C",
//           hin: "100°C",
//         },
//         optionB: {
//           en: "0°C",
//           hin: "0°C",
//         },
//         optionC: {
//           en: "50°C",
//           hin: "50°C",
//         },
//         optionD: {
//           en: "150°C",
//           hin: "150°C",
//         },
//       },
//       correctAnswer: {
//         en: "100°C",
//         hin: "100°C",
//       },
//     },
//   ],
// };

type Props = {};

const AddQuiz = (props: Props) => {
  const [loading, setisLoading] = useState(false);

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

  const SubmitQuiz = async () => {
    setisLoading(true);
    const formData = new FormData();
    formData.append("name", quiz.name);
    formData.append("shortDescription", quiz.shortDescription);
    formData.append("category", quiz.category);
    formData.append("image", quiz.image);
    formData.append("isPaid", quiz.isPaid);
    formData.append("price", quiz.price);

    formData.append("quizData", JSON.stringify(quiz.questions));

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/quiz/createQuiz`,
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

          <div className="flex flex-col bg-white text-brown-50 h-2"></div>

          <div>
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

          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={() => SubmitQuiz()}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
