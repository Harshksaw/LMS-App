// Import the required modules
const express = require("express");
const {
  getQuizbyId,
  getAllQuiz,
  editQuizbyId,
  ping,
  updateQuestionOptions,
  getAllBundleQuiz,
  createQuestion,
  UpdateQuiz,
  intialize,
  deleteQuizById,
  UpdateQuizDetails,
  deleteQuestionById,
  updateQuestion,
  addQuestionToUser,
  removeQuestionFromUser,
  getAllSavedQuestions,
} = require("../controllers/Quiz");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  getIsBundledMaterials,
  attemptQuiz,
  getAttemptById,
  getAllAttempById,
  updateLeaderboard,
  getLeaderboard,
} = require("../controllers/CourseMaterials");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// // Configure Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "quiz",
    resource_type: "auto",
  },
});
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ storage });

// Define the routes with the upload middleware and controllers
router.post("/initializeQuiz", upload.single("image"), intialize);
router.post("/updateQuiz/:id", UpdateQuiz);

router.get("/getAllQuiz", getAllQuiz);
// router.post("/getAllQuiz", saveQuestion)

router.post("/createQuestion", createQuestion);
// router.post("/updateQuestion", updateQuestion)

router.get("/getAllisBundleQuizes", getAllBundleQuiz);

router.get("/getQuizById/:id", getQuizbyId);

router.post("/editQuiz/:id", editQuizbyId);
router.post("/editQuizDetails/:id", upload.single("image"), UpdateQuizDetails);
router.get("/ping", ping);
router.get("/update", updateQuestionOptions);
router.post("/updateQuestions/:id", updateQuestion);

router.delete("/deleteQuiz/:id", deleteQuizById);
router.delete("/deleteQuestion/:id", deleteQuestionById);

router.get("/getAllisBundleMaterials", getIsBundledMaterials);

// router.get("/getUserQuizzes/:id",)

router.post("/saveUserQuestion", addQuestionToUser);
router.post("/removeUserQuestion", removeQuestionFromUser);
router.get("/getUserSavedQuestion/:id", getAllSavedQuestions);

router.post("/attempt-quiz", attemptQuiz);
router.get("/getAttemptQuiz/:id", getAttemptById);

router.get("/getAllAttempt/:id", getAllAttempById);

router.post("/updateLeaderboard", updateLeaderboard);
router.post("/getLeaderboard/:id", getLeaderboard);

module.exports = router;
