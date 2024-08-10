const Quiz = require("../models/Quiz");
const Questions = require("../models/Questions");
const User = require("../models/User");

exports.intialize = async (req, res) => {
  const {
    name,
    shortDescription,
    category,
    isPaid,
    price,

    testSeries,
    isListed,
    isPartOfBundle,
    time,
  } = req.body;
  const Quizimage = req.file ? req.file.path : "https://picsum.photos/200";
  try {

    if (!name || !shortDescription || !time) {
      return res.status(400).json({
        success: false,
        message: "All fields are required !!",
      });
    }


    // Create the quiz with references to created questions
    const newQuiz = new Quiz({
      name: name,
      shortDescription: shortDescription,
      category,
      isPaid,
      price,
      image: Quizimage,

      testSeries,
      isListed,
      timer: time,
      isPartOfBundle,
    });

    const savedQuiz = await newQuiz.save();

    return res.status(200).json({
      success: true,
      message: "worked",
      data: savedQuiz,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(401).json({
      success: false,
      message: "Canno create Quiz in, try again ",
    });
  }
};
exports.UpdateQuiz = async (req, res) => {
  const {
    name,
    shortDescription,
    category,
    isPaid,
    price,
    quizData,
    testSeries,
    isListed,
    isPartOfBundle,
    time,
  } = req.body;
  const Quizimage = req.file ? req.file.path : "https://picsum.photos/200";

  // console.log("first :", Quizimage);
  // console.log("first :", name, category, shortDescription);
  if (!name || !shortDescription || !quizData || !time) {
    return res.status(400).json({
      success: false,
      message: "All fields are required !!",
    });
  }

  let parsedQuizData;
  try {
    parsedQuizData =
      typeof quizData === "string" ? JSON.parse(quizData) : quizData;
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz data format",
    });
  }

  if (!Array.isArray(parsedQuizData)) {
    return res.status(400).json({
      success: false,
      message: "quizData should be an array",
    });
  }
  try {
    const questionData = parsedQuizData?.map((question) => ({
      question: {
        en: question.question.en,
        hin: question.question.hin,
      },
      options: {
        optionA: {
          en: question.options.optionA.en,
          hin: question.options.optionA.hin,
        },
        optionB: {
          en: question.options.optionB.en,
          hin: question.options.optionB.hin,
        },
        optionC: {
          en: question.options.optionC.en,
          hin: question.options.optionC.hin,
        },
        optionD: {
          en: question.options.optionD.en,
          hin: question.options.optionD.hin,
        },
      },
      correctAnswer: {
        en: question.correctAnswer.en,
        hin: question.correctAnswer.hin,
      },
    }));
    console.log("second :", questionData);

    var createdQuestions = await Questions.insertMany(questionData);
    console.log("third :", createdQuestions);

    // Extract question IDs for efficient quiz creation
    var questionIds = createdQuestions.map((question) => question._id);

    // Return or process createdQuestions or questionIds as needed
  } catch (error) {
    console.error("Error creating questions:", error);
    return res.status(500).json({
      success: false,
      message: "Cannot create questions, try again!",
    });
  }
  console.log("Forth :", questionIds);
  // Create the quiz with references to created questions
  const newQuiz = new Quiz({
    name: name,
    shortDescription: shortDescription,
    category,
    isPaid,
    price,
    image: Quizimage,
    questions: questionIds,
    testSeries,
    isListed,
    timer: time,
    isPartOfBundle,
  });

  try {
    const savedQuiz = await newQuiz.save();
    //   return savedQuiz;
    return res.status(200).json({
      success: true,
      message: "worked",
      data: savedQuiz,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(401).json({
      success: false,
      message: "Canno create Quiz in, try again ",
    });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { quizId, questionData } = req.body;

    // Create a new question

    const newQuestion = new Questions(questionData);
    await newQuestion.save();

    // Find the quiz and update its questions array
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res
      .status(201)
      .json({ message: "Question added successfully", question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.updateQuestion = async (req, res) => {
//   try {
//     const { questionId, questionData } = req.body;

//     // Find the question by ID and update it
//     const updatedQuestion = await Questions.findByIdAndUpdate(
//       questionId,
//       questionData,
//       { new: true }
//     );
//     if (!updatedQuestion) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res
//       .status(200)
//       .json({
//         message: "Question updated successfully",
//         question: updatedQuestion,
//       });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

exports.getQuizbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById({ _id: id }).populate("questions");

    console.log("Quiz data:", quiz);
    return res.status(201).json({
      success: true,
      data: quiz,
      message: "Quiz is here",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again ",
    });
  }
};
exports.getAllQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.find();
    return res.status(200).json({
      success: true,
      message: "All quizz are here!!",
      data: quiz,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again ",
    });
  }
};
exports.getAllBundleQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.find({ isPartOfBundle: true }).sort({
      createdAt: -1,
    });
    return res.status(201).json({
      success: true,
      message: "All quizz are here!!",

      data: quiz,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again ",
    });
  }
};
exports.editQuizbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const Quiz = await Quiz.findById({ _id: id });

    if (Quiz) {
      return res.status(201).json({
        success: true,
        message: "Quiz is here!!",
        data: Quiz,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Not found Quiz !!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again ",
    });
  }
};

//totest
exports.buyQuizbyId = async (req, res) => {
  try {
    const { userId, quizId } = req.body;
    if (!userId && !id) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $addToSet: { quizes: quizId } },
      { new: true }
    );

    if (user) {
      return res.status(201).json({
        success: true,
        message: "Quiz added in user ",
        data: user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Not found Quiz !!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again ",
    });
  }
};

//to test
exports.getAllBoughtQuiz = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    const user = await User.findById({ _id: userId }).populate("quizes");
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All quizz are here!!",

      data: user.quizes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again ",
    });
  }
};

exports.ping = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Ping is working",
  });
};

exports.updateQuestionOptions = async (req, res) => {
  try {
    // Fetch all quizzes
    const quizzes = await Quiz.find().populate("questions"); // Ensure you have a Questions model referenced in Quiz

    for (let quiz of quizzes) {
      for (let question of quiz.questions) {
        // Update the question document directly in the database
        await Questions.findByIdAndUpdate(question._id, {
          $set: {
            options: {
              optionA: question.optionA,
              optionB: question.optionB,
              optionC: question.optionC,
              optionD: question.optionD,
            },
          },
          $unset: {
            optionA: "",
            optionB: "",
            optionC: "",
            optionD: "",
          },
        });
      }
    }

    console.log("All questions within quizzes have been updated.");
  } catch (error) {
    console.error("Failed to update questions:", error);
  }
};

// const req = {
//   body: {
//     name: "Sample Quiz",
//     shortDescription: "This is a sample quiz description.",
//     category: "General Knowledge",
//     isPaid: false,
//     price: 0,
//     quizData: [
//       {
//         question: {
//           en: "What is the capital of France?",
//           hin: "फ्रांस की राजधानी क्या है?",
//         },
//         options: {
//           optionA: {
//             en: "Paris",
//             hin: "पेरिस",
//           },
//           optionB: {
//             en: "London",
//             hin: "लंदन",
//           },
//           optionC: {
//             en: "Berlin",
//             hin: "बर्लिन",
//           },
//           optionD: {
//             en: "Madrid",
//             hin: "मैड्रिड",
//           },
//         },
//         correctAnswer: {
//           en: "Paris",
//           hin: "पेरिस",
//         },
//       },
//       {
//         question: {
//           en: "What is the largest planet in our solar system?",
//           hin: "हमारे सौर मंडल का सबसे बड़ा ग्रह कौन सा है?",
//         },
//         options: {
//           optionA: {
//             en: "Earth",
//             hin: "पृथ्वी",
//           },
//           optionB: {
//             en: "Jupiter",
//             hin: "बृहस्पति",
//           },
//           optionC: {
//             en: "Saturn",
//             hin: "शनि",
//           },
//           optionD: {
//             en: "Mars",
//             hin: "मंगल",
//           },
//         },
//         correctAnswer: {
//           en: "Jupiter",
//           hin: "बृहस्पति",
//         },
//       },
//       {
//         question: {
//           en: "Who wrote 'To Kill a Mockingbird'?",
//           hin: "'टू किल अ मॉकिंगबर्ड' किसने लिखा?",
//         },
//         options: {
//           optionA: {
//             en: "Harper Lee",
//             hin: "हार्पर ली",
//           },
//           optionB: {
//             en: "Mark Twain",
//             hin: "मार्क ट्वेन",
//           },
//           optionC: {
//             en: "Ernest Hemingway",
//             hin: "अर्नेस्ट हेमिंग्वे",
//           },
//           optionD: {
//             en: "F. Scott Fitzgerald",
//             hin: "एफ. स्कॉट फिट्जगेराल्ड",
//           },
//         },
//         correctAnswer: {
//           en: "Harper Lee",
//           hin: "हार्पर ली",
//         },
//       },
//       {
//         question: {
//           en: "What is the chemical symbol for water?",
//           hin: "पानी का रासायनिक प्रतीक क्या है?",
//         },
//         options: {
//           optionA: {
//             en: "H2O",
//             hin: "एच2ओ",
//           },
//           optionB: {
//             en: "O2",
//             hin: "ओ2",
//           },
//           optionC: {
//             en: "CO2",
//             hin: "सीओ2",
//           },
//           optionD: {
//             en: "H2",
//             hin: "एच2",
//           },
//         },
//         correctAnswer: {
//           en: "H2O",
//           hin: "एच2ओ",
//         },
//       },
//       {
//         question: {
//           en: "What is the speed of light?",
//           hin: "प्रकाश की गति क्या है?",
//         },
//         options: {
//           optionA: {
//             en: "300,000 km/s",
//             hin: "300,000 किमी/से",
//           },
//           optionB: {
//             en: "150,000 km/s",
//             hin: "150,000 किमी/से",
//           },
//           optionC: {
//             en: "450,000 km/s",
//             hin: "450,000 किमी/से",
//           },
//           optionD: {
//             en: "600,000 km/s",
//             hin: "600,000 किमी/से",
//           },
//         },
//         correctAnswer: {
//           en: "300,000 km/s",
//           hin: "300,000 किमी/से",
//         },
//       },
//       {
//         question: {
//           en: "Who painted the Mona Lisa?",
//           hin: "मोना लिसा किसने चित्रित की?",
//         },
//         options: {
//           optionA: {
//             en: "Leonardo da Vinci",
//             hin: "लियोनार्डो दा विंची",
//           },
//           optionB: {
//             en: "Vincent van Gogh",
//             hin: "विंसेंट वैन गॉग",
//           },
//           optionC: {
//             en: "Pablo Picasso",
//             hin: "पाब्लो पिकासो",
//           },
//           optionD: {
//             en: "Claude Monet",
//             hin: "क्लाउड मोनेट",
//           },
//         },
//         correctAnswer: {
//           en: "Leonardo da Vinci",
//           hin: "लियोनार्डो दा विंची",
//         },
//       },
//       {
//         question: {
//           en: "What is the smallest prime number?",
//           hin: "सबसे छोटा अभाज्य संख्या कौन सी है?",
//         },
//         options: {
//           optionA: {
//             en: "1",
//             hin: "1",
//           },
//           optionB: {
//             en: "2",
//             hin: "2",
//           },
//           optionC: {
//             en: "3",
//             hin: "3",
//           },
//           optionD: {
//             en: "5",
//             hin: "5",
//           },
//         },
//         correctAnswer: {
//           en: "2",
//           hin: "2",
//         },
//       },
//       {
//         question: {
//           en: "What is the capital of Japan?",
//           hin: "जापान की राजधानी क्या है?",
//         },
//         options: {
//           optionA: {
//             en: "Tokyo",
//             hin: "टोक्यो",
//           },
//           optionB: {
//             en: "Kyoto",
//             hin: "क्योटो",
//           },
//           optionC: {
//             en: "Osaka",
//             hin: "ओसाका",
//           },
//           optionD: {
//             en: "Nagoya",
//             hin: "नागोया",
//           },
//         },
//         correctAnswer: {
//           en: "Tokyo",
//           hin: "टोक्यो",
//         },
//       },
//       {
//         question: {
//           en: "What is the powerhouse of the cell?",
//           hin: "कोशिका का पावरहाउस क्या है?",
//         },
//         options: {
//           optionA: {
//             en: "Nucleus",
//             hin: "नाभिक",
//           },
//           optionB: {
//             en: "Mitochondria",
//             hin: "माइटोकॉन्ड्रिया",
//           },
//           optionC: {
//             en: "Ribosome",
//             hin: "राइबोसोम",
//           },
//           optionD: {
//             en: "Golgi apparatus",
//             hin: "गोल्जी तंत्र",
//           },
//         },
//         correctAnswer: {
//           en: "Mitochondria",
//           hin: "माइटोकॉन्ड्रिया",
//         },
//       },
//       {
//         question: {
//           en: "What is the boiling point of water?",
//           hin: "पानी का क्वथनांक क्या है?",
//         },
//         options: {
//           optionA: {
//             en: "100°C",
//             hin: "100°C",
//           },
//           optionB: {
//             en: "0°C",
//             hin: "0°C",
//           },
//           optionC: {
//             en: "50°C",
//             hin: "50°C",
//           },
//           optionD: {
//             en: "150°C",
//             hin: "150°C",
//           },
//         },
//         correctAnswer: {
//           en: "100°C",
//           hin: "100°C",
//         },
//       },
//     ],
//   },
//   file: {
//     path: 'path/to/uploaded/image.jpg',
//   },
// };
