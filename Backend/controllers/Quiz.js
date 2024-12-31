const Quiz = require("../models/Quiz");
const Questions = require("../models/Questions");
const User = require("../models/User");

exports.intialize = async (req, res) => {
  const {
    name,
    shortDescription,

    isPaid,
    price,
    timer,

    isPartOfBundle,
  } = req.body;
  const Quizimage = req.file ? req.file.path : "https://picsum.photos/200";
  try {
    if (!name || !shortDescription || !timer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required !!",
      });
    }

    // Create the quiz with references to created questions
    const newQuiz = new Quiz({
      name: name,
      shortDescription: shortDescription,

      isPaid,
      price,
      image: Quizimage,

      timer,
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
  const { id } = req.params;
  const {
    name,
    shortDescription,

    price,
    quizData,

    isPartOfBundle,
    timer,
  } = req.body;

  console.log("🚀 ~ file", quizData, typeof quizData);
  const Quizimage = req.file ? req.file.path : "https://picsum.photos/200";

  if (!name || !shortDescription || !quizData || !timer) {
    return res.status(400).json({
      success: false,
      message: "All fields are required !!",
    });
  }

  let parsedQuizData;

  if (typeof parsedQuizData === "object" && !Array.isArray(parsedQuizData)) {
    parsedQuizData = Object.values(parsedQuizData);
  }
  // try {
  //   parsedQuizData =
  //     typeof quizData === "string" ? JSON.parse(quizData) : quizData;
  // } catch (error) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Invalid quiz data format",
  //   });
  // }
  // Convert parsedQuizData to an array if it is an object

  // if (!Array.isArray(parsedQuizData)) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "quizData should be an array",
  //   });
  // }

  try {
    const questionData = parsedQuizData.map((question) => ({
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
      //  adding description of each question that will shown only after submitting the answer
      description: {
        en: question.description.en,
        hin: question.description.hin,
      },
    }));

    const createdQuestions = await Questions.insertMany(questionData);
    const questionIds = createdQuestions.map((question) => question._id);

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        name,
        shortDescription,
        category,
        isPaid,
        price,
        image: Quizimage,
        questions: questionIds,
        testSeries,
        isListed,
        timer: time,
        isPartOfBundle,
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Cannot update quiz, try again!",
    });
  }
};

exports.UpdateQuizDetails = async (req, res) => {
  const { id } = req.params;
  const { name, shortDescription, isPartOfBundle, timer } = req.body;

  const Quizimage = req.file ? req.file.path : "https://picsum.photos/200";
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        name,
        shortDescription,
        image: Quizimage,
        isPartOfBundle: Boolean(isPartOfBundle),
        timer: timer,
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz details updated successfully",
      data: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz details:", error);
    return res.status(500).json({
      success: false,
      message: "Cannot update quiz details, try again!",
    });
  }
};
exports.createQuestion = async (req, res) => {
  try {
    const { quizId, questionData } = req.body;

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
    const quiz = await Quiz.find().sort({ createdAt: -1 });
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

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionData } = req.body;
    console.log(questionData);
    const updatedQuestion = await Questions.findByIdAndUpdate(
      id,
      {
        $set: {
          "question.en": questionData.question.en,
          "question.hin": questionData.question.hin,
          "options.optionA.en": questionData.options.optionA.en,
          "options.optionA.hin": questionData.options.optionA.hin,
          "options.optionB.en": questionData.options.optionB.en,
          "options.optionB.hin": questionData.options.optionB.hin,
          "options.optionC.en": questionData.options.optionC.en,
          "options.optionC.hin": questionData.options.optionC.hin,
          "options.optionD.en": questionData.options.optionD.en,
          "options.optionD.hin": questionData.options.optionD.hin,
          "correctAnswer.en": questionData.correctAnswer.en,
          "correctAnswer.hin": questionData.correctAnswer.hin,
        },
      },
      { new: true }
    );

    // if (!updatedQuestion) {
    //   return res.status(404).json({ message: "Question not found" });
    // }
    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Delete associated questions
    await Questions.deleteMany({ _id: { $in: quiz.questions } });

    // Delete the quiz
    await Quiz.findByIdAndDelete(quizId);

    res.status(200).json({
      success: true,
      message: "Quiz and associated questions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;

    // Find the question by ID
    const question = await Questions.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Find quizzes that have this question
    const quizzes = await Quiz.find({ questions: questionId });

    // Remove the question from the quizzes' questions array
    quizzes.forEach((quiz) => {
      const index = quiz.questions.indexOf(questionId);
      if (index !== -1) {
        quiz.questions.splice(index, 1);
        quiz.save();
      }
    });

    // Delete the question
    await Questions.findByIdAndDelete(questionId);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addQuestionToUser = async (req, res) => {
  try {
    const { userId, questionId } = req.body;

    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ error: "User ID and question ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.questions.includes(questionId)) {
      user.questions.push(questionId);
      await user.save();
    }

    res
      .status(201)
      .json({ message: "Question bookmarked successfully", data: user });
  } catch (error) {
    console.error("Error bookmarking question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a question reference from the user's questions array
exports.removeQuestionFromUser = async (req, res) => {
  try {
    const { userId, questionId } = req.body;

    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ error: "User ID and question ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.questions = user.questions.filter((q) => q.toString() !== questionId);
    await user.save();

    res.status(200).json({
      message: "Question removed from bookmarks successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error removing bookmarked question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllSavedQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const savedQuestions = await User.findById(id).populate("questions");
    console.log(
      "🚀 ~ exports.getAllSavedQuestions= ~ savedQuestions:",
      savedQuestions
    );

    res.status(200).json({
      message: "Saved questions fetched successfully",
      data: savedQuestions,
    });
  } catch (error) {
    console.error("Error fetching saved questions:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// function to update the question description
exports.updateQuestionDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatedQuestion = await Questions.findByIdAndUpdate(
      id,
      {
        $set: {
          "description.en": description.en,
          "description.hin": description.hin,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Question description updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};
