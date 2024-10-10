const User = require("../models/User");

const StudyMaterial = require("../models/material"); // Import the StudyMaterial model

require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const { adminId } = require("../utils/env");
const Attempt = require("../models/Attempt");
const AWS = require("aws-sdk");
const Quiz = require("../models/Quiz");

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1",
});

const s3 = new AWS.S3();
const cloudFrontUrl = process.env.CLOUDFRONT_URL;

const uploadFile = async (file) => {
  const fileKey = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  console.log(fileKey);

  await s3.upload(params).promise();
  return `${cloudFrontUrl}/${fileKey}`;
};

exports.uploadStudyMaterials = async (req, res) => {
  const { title, description, isListed, isPartOfBundle } = req.body;
  const file = req.file; // Assuming you're using multer for file uploads
  console.log(file);
  try {
    const fileUrl = await uploadFile(file);
    console.log("🚀 ~ exports.uploadStudyMaterials= ~ fileUrl:", fileUrl);

    // Upload file to S3 and get the CloudFront URL
    const fileType = file.mimetype;

    // Create a new StudyMaterial document
    const newMaterial = new StudyMaterial({
      title,
      description,
      fileType,
      fileUrl,

      isListed,
      isPartOfBundle,
    });

    await newMaterial.save();

    // user.studyMaterials.push(newMaterial._id);
    // await user.save();

    return res.json({
      success: true,
      message: "Study material uploaded successfully",
      data: newMaterial,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the study material from the database
    const studyMaterial = await StudyMaterial.findById(id);
    if (!studyMaterial) {
      return res.status(404).send({ message: "Study material not found" });
    }

    // Delete the file from S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: studyMaterial.fileUrl.split("/").pop(), // Extract the S3 key from the file URL
    };

    await s3.deleteObject(params).promise();

    // Delete the study material from the database
    await StudyMaterial.findByIdAndDelete(id);

    res.status(200).send({ message: "Study material deleted successfully" });
  } catch (error) {
    console.error("Error deleting study material:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
exports.getAllStudyMaterials = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find({ isListed: true }).sort({ createdAt: -1 });  
    if (studyMaterials.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "No study materials found",
      });
    }
    return res.json({
      success: true,
      data: studyMaterials,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getAllAdminStudyMaterials = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find().sort({ createdAt: -1 });
    if (studyMaterials.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "No study materials found",
      });
    }
    return res.json({
      success: true,
      data: studyMaterials,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllBundleMaterial = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find({
      isPartOfBundle: true,
    }).sort({ createdAt: -1 });
    if (studyMaterials.length === 0) {
      return res.json({
        success: false,
        message: "No study materials found",
        data: [],
      });
    }
    return res.json({
      success: true,
      data: studyMaterials,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getStudyMaterialById = async (req, res) => {
  const { id } = req.params;

  try {
    const studyMaterial = await StudyMaterial.findById(id);

    if (!studyMaterial) {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    return res.json({
      success: true,
      data: studyMaterial,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//to test
exports.buyStudyMaterial = async (req, res) => {
  const { userId, materialId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the course exists
    const course = await StudyMaterial.findById(materialId);

    if (!course) {
      throw new Error("Course not found");
    }

    // Add the course ID to the studyMaterials array
    user.studyMaterials.push(materialId);
    await user.save();
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//to test
exports.getAllBoughtStudyMaterials = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById({ _id: userId }).populate(
      "studyMaterials"
    ).sort({ createdAt: -1 });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All studyMaterials are here!!",
      data: user.studyMaterials,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot LOGGED in, try again",
    });
  }
};

exports.getIsBundledMaterials = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find({
      isPartOfBundle: true,
    }).sort({ createdAt: -1 });
    console.log(
      "🚀 ~ exports.getIsBundledMaterials= ~ studyMaterials:",
      studyMaterials
    );

    if (studyMaterials.length === 0) {
      return res.json({
        success: false,
        message: "No study materials found",
        data: [],
      });
    }
    return res.json({
      success: true,
      data: studyMaterials,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.attemptQuiz = async (req, res) => {
  try {
    // console.log("🚀 ~ file: CourseMaterials.js ~ line 202 ~ exports.attemptQuiz= ~ req.body",  questions )
    const { user, quiz, score, questions } = req.body;

    // Create a new attempt
    const newAttempt = new Attempt({
      user,
      quiz,
      score,
      questions,
    });

    // Save the attempt to the database
    await newAttempt.save();

    // Optionally, add the attempt to the user's attempts array
    await User.findByIdAndUpdate(user, { $push: { attempts: newAttempt._id } });

    res.status(201).json(newAttempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ exports.getAttemptById= ~ id:", id);

    // Find the attempt by user and quiz
    const attempt = await Attempt.findById(id).populate("questions.question");
    console.log("🚀 ~ exports.getAttemptById= ~ attempt:", attempt);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//TODO be reviewed
exports.getQuizAndMarkAttempt = async (req, res) => {
  try {
    const { quizId, attemptId } = req.params;
    // console.log(
    //   "🚀 ~ exports.getQuizAndMarkAttempt= ~ quizId:",
    //   quizId,
    //   "attemptId:",
    //   attemptId
    // );

    // Fetch the quiz details
    const quiz = await Quiz.findById(quizId);
    console.log("🚀 ~ exports.getQuizAndMarkAttempt= ~ quiz:", quiz);

    // Fetch the attempt details and populate the questions.question field
    const attempt = await Attempt.findById(attemptId).populate(
      "questions.question"
    );
    console.log("🚀 ~ exports.getQuizAndMarkAttempt= ~ attempt:", attempt);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Match the questions in the quiz with the questions in the attempt
    const markedQuestions = quiz.questions.map((quizQuestion) => {
      const attemptQuestion = attempt.questions.find(
        (aq) => aq.question._id.toString() === quizQuestion._id.toString()
      );
      return {
        question: quizQuestion,
        answer: attemptQuestion ? attemptQuestion.answer : null,
      };
    });

    // Return the updated attempt details
    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        user: attempt.user,
        quiz: quiz,
        questions: markedQuestions,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.getAttemptById = async (req, res) => {
//   try {
//     const { userId, quizId } = req.body;

//     // Find the attempt by user and quiz
//     const attempt = await Attempt.findOne({ user: userId, quiz: quizId }).populate('questions.question');

//     if (!attempt) {
//       return res.status(404).json({ message: 'Attempt not found' });
//     }

//     res.status(200).json(attempt);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

exports.getAllAttempById = async (req, res) => {
  try {
    const { id } = req.params;

    const attempts = await Attempt.find({ user: id }).populate("quiz").sort({ createdAt: -1 });

    if (!attempts) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    let filterAttemps = [];
    [...attempts].reverse().forEach((item) => {
      if (!filterAttemps.some((i) => i.quiz?._id == item?.quiz._id)) {
        filterAttemps.push(item);
      }
    });

    res.status(200).json({
      success: true,
      data: filterAttemps,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeaderboard = async (req, res) => {
  try {
    const { userId, quizId, newScore } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Find the quiz result for the given quizId
    let quizResult = user.quizResults.find(
      (result) => result.quiz.toString() === quizId
    );

    if (quizResult) {
      // If the new score is higher, update the score
      if (newScore > quizResult.score) {
        quizResult.score = newScore;
        await user.save();

        // Update the leaderboard
        await Leaderboard.findOneAndUpdate(
          { quiz: quizId, user: userId },
          { score: newScore },
          { upsert: true }
        );
      }
    } else {
      // If no quiz result exists, add a new quiz result
      user.quizResults.push({ quiz: quizId, score: newScore });
      await user.save();

      // Create a new leaderboard entry
      await Leaderboard.create({ quiz: quizId, user: userId, score: newScore });
    }

    res.status(200).send({ message: "Leaderboard updated successfully" });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;

    const leaderboard = await Leaderboard.find({ quiz: id })
      .sort({ score: -1 })
      .limit(10);

    res.status(200).send({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
