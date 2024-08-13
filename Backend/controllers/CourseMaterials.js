const User = require("../models/User");

const StudyMaterial = require("../models/material"); // Import the StudyMaterial model

require("dotenv").config();

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { adminId } = require("../utils/env");
const Attempt = require("../models/Attempt");


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
  const { title, description, course, isPaid, price, isListed, isPartOfBundle } = req.body;
  const file = req.file; // Assuming you're using multer for file uploads

  try {

    const fileUrl = await uploadFile(file);

    // Upload file to S3 and get the CloudFront URL
    const fileType = file.mimetype;

    // Create a new StudyMaterial document
    const newMaterial = new StudyMaterial({
      title,
      description,
      fileType,
      fileUrl,
      course,
      isPaid, price,
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

exports.getAllStudyMaterials = async (req, res) => {
  try {
    const studyMaterials = await StudyMaterial.find({ isPartOfBundle: false });
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
    const studyMaterials = await StudyMaterial.find({ isPartOfBundle: true }).sort({ createdAt: -1 });
    if (studyMaterials.length === 0) {
      return res.json({
        success: false,
        message: 'No study materials found',
        data: []
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

    const user = await User.findById({ _id: userId }).populate("studyMaterials");

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
      message: "user cannot LOGGED in, try again"

    })



  }
}

exports.getIsBundledMaterials = async (req, res) => {

  try {
    const studyMaterials = await StudyMaterial.find({ isPartOfBundle: true }).sort({ createdAt: -1 });
    console.log("🚀 ~ exports.getIsBundledMaterials= ~ studyMaterials:", studyMaterials)


    if (studyMaterials.length === 0) {
      return res.json({
        success: false,
        message: 'No study materials found',
        data: []
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

}



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
}

exports.getAttemptById = async (req, res) => {
  try {
    const { id} = req.params
    console.log("🚀 ~ exports.getAttemptById= ~ id:", id)

    // Find the attempt by user and quiz
    const attempt = await Attempt.findById(id).populate('questions.question');
    console.log("🚀 ~ exports.getAttemptById= ~ attempt:", attempt)

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//TODO be reviewed
exports.getQuizAndMarkAttempt = async (req, res) => {
  try {
    const { quizId, attemptId } = req.params;
    console.log("🚀 ~ exports.getQuizAndMarkAttempt= ~ quizId:", quizId, "attemptId:", attemptId);

    // Fetch the quiz details
    const quiz = await Quiz.findById(quizId);
    console.log("🚀 ~ exports.getQuizAndMarkAttempt= ~ quiz:", quiz);

    // Fetch the attempt details and populate the questions.question field
    const attempt = await Attempt.findById(attemptId).populate('questions.question');
    console.log("🚀 ~ exports.getQuizAndMarkAttempt= ~ attempt:", attempt);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Match the questions in the quiz with the questions in the attempt
    const markedQuestions = quiz.questions.map(quizQuestion => {
      const attemptQuestion = attempt.questions.find(aq => aq.question._id.toString() === quizQuestion._id.toString());
      return {
        question: quizQuestion,
        answer: attemptQuestion ? attemptQuestion.answer : null
      };
    });

    // Return the updated attempt details
    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        user: attempt.user,
        quiz: quiz,
        questions: markedQuestions
      }
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
    console.log("🚀 ~ exports.getAllAttempById= ~ id:", id)

    const attempts = await Attempt.find({ user: id }).populate('quiz');

    if (!attempts) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    res.status(200).json({
      success: true,
      data: attempts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}