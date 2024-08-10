// Import the required modules
const express = require("express")
const {  getQuizbyId, getAllQuiz, editQuizbyId, ping, updateQuestionOptions, getAllBundleQuiz,  createQuestion,  UpdateQuiz, intialize, deleteQuizById } = require("../controllers/Quiz")
const router = express.Router()
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { getIsBundledMaterials } = require("../controllers/CourseMaterials");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
  console.log("🚀 ~ API_SECRET:",process.env.API_SECRET)
  console.log("🚀 ~ API_KEY:", process.env.API_KEY)
  console.log("🚀 ~ CLOUD_NAME:", process.env.CLOUD_NAME)

// // Configure Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "quiz",
    resource_type: "auto",
  },
})
const upload = multer({ storage: multer.memoryStorage() });

// Define the routes with the upload middleware and controllers
router.post("/initializeQuiz",upload.single('image'), intialize);
router.post("/updateQuiz",upload.single('image'), UpdateQuiz);

router.get("/getAllQuiz", getAllQuiz)
// router.post("/getAllQuiz", saveQuestion)

router.post("/createQuestion", createQuestion)
// router.post("/updateQuestion", updateQuestion)


router.get("/getAllisBundleQuizes", getAllBundleQuiz)


router.get("/getQuizById/:id",getQuizbyId )


router.post("/editQuiz/:id",editQuizbyId )
router.get("/ping", ping)
router.get("/update", updateQuestionOptions)

router.delete("/deleteQuiz/:id", deleteQuizById)

router.get("/getAllisBundleMaterials", getIsBundledMaterials)




module.exports = router 