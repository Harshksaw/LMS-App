import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../services/apis';

const EditQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState({
    isPartOfBundle: false,
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
        const response = await axios.get(`${BASE_URL}/api/v1/quiz/getQuizById/${id}`);
        
        console.log("🚀 ~ fetchQuiz ~ response:", response)
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleChange = (field, e) => {
    if (field === 'isPartOfBundle') {
      setQuiz({ ...quiz, isPartOfBundle: e.target.checked });
    } else {
      setQuiz({ ...quiz, [field]: e.target.value });
    }
  };

  const handleSaveQuiz = async () => {
    try {
      const response = await axios.put(`/api/quiz/${id}`, quiz);
      console.log('Quiz updated:', response.data);
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleSaveQuestion = async (question) => {
    // Check if all fields are entered
    const isQuestionValid = question.question.en && question.question.hin &&
      question.options.optionA.en && question.options.optionA.hin &&
      question.options.optionB.en && question.options.optionB.hin &&
      question.options.optionC.en && question.options.optionC.hin &&
      question.options.optionD.en && question.options.optionD.hin &&
      question.correctAnswer.en && question.correctAnswer.hin;

    if (!isQuestionValid) {
      alert('Please fill in all fields before saving.');
      return;
    }

    try {
      const response = await axios.put(`/api/question/${question.id}`, question);
      console.log('Question updated:', response.data);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col overflow-auto justify-center">
      <div className="flex flex-row space-x-10 justify-center items-center">
        <label htmlFor="isPartOfBundle" className="text-richblack-5 flex items-center">
          isPartOfBundle
        </label>
        <input
          id="isPartOfBundle"
          type="checkbox"
          placeholder="isPartOfBundle"
          className="ml-2"
          checked={quiz.isPartOfBundle}
          onChange={(e) => handleChange('isPartOfBundle', e)}
        />
      </div>

      <div>
        {quiz.questions.map((question, index) => (
          <div key={index}>
            <div onClick={() => toggleAccordion(index)}>
              {`Question ${index + 1}`}
            </div>
            {openIndex === index && (
              <div>
                <div>
                  <label>Question (EN):</label>
                  <input
                    type="text"
                    value={question.question.en}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        questions: quiz.questions.map((q, i) =>
                          i === index ? { ...q, question: { ...q.question, en: e.target.value } } : q
                        ),
                      })
                    }
                  />
                  <button onClick={() => handleSaveQuestion(question)}>Edit</button>
                </div>
                <div>
                  <label>Question (HIN):</label>
                  <input
                    type="text"
                    value={question.question.hin}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        questions: quiz.questions.map((q, i) =>
                          i === index ? { ...q, question: { ...q.question, hin: e.target.value } } : q
                        ),
                      })
                    }
                  />
                  <button onClick={() => handleSaveQuestion(question)}>Edit</button>
                </div>
                {/* Repeat similar blocks for options and correctAnswer */}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSaveQuiz}>Save Quiz</button>
    </div>
  );
};

export default EditQuiz;