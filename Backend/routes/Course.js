// Import the required modules
const express = require("express");
const router = express.Router();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { deleteStudyMaterial } = require("../controllers/CourseMaterials");
const fs = require("fs");
cloudinary.config({
  cloud_name: "dzwvmqbv0",
  api_key: 572782272174972,
  api_secret: "Sx6t5hAG6ynwO6mr8GN-L55A7MI",
});

// Configure Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-images",
    resource_type: "auto",
  },
})
const upload = multer({ storage: storage });
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,

  getAllCoursesData,
} = require("../controllers/Course");

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

const { updateCourseProgress } = require("../controllers/courseProgress");

// Importing Middlewares
const { isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************


router.post("/createCourse", upload.single("file"), createCourse);
//Add a Section to a Course 2
router.post("/addSection", createSection);
// Update a Section 3
router.post("/updateSection", updateSection);
// Delete a Section
router.post("/deleteSection", deleteSection);
// Edit Sub Section
router.post("/updateSubSection", updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", deleteSubSection);
// Add a Sub Section to a Section  4
router.post("/addSubSection", upload.single("file"), createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", getFullCourseDetails);
// Edit Course routes
router.post("/editCourse", editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", getInstructorCourses);
// Delete a Course
router.delete("/deleteCourse", deleteCourse);

router.post("/updateCourseProgress", isStudent, updateCourseProgress);

router.get("/get-all-courses", getAllCoursesData);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);




router.post("/deleteStudyMaterial/:id", deleteStudyMaterial); 

const {
  S3Client,
  PutObjectCommand,

} = require("@aws-sdk/client-s3");


const uploadVideo = async (filename, contentType, file) => {
  const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  const uniqueFilename = `user-uploads/${Date.now()}-${filename}`;

  const params = {
    Bucket: "harshexpolms",
    Key: uniqueFilename,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw new Error("Error uploading file");
  }

  const publicUrl = `https://harshexpolms.s3.amazonaws.com/${uniqueFilename}`;
  console.log(publicUrl);
  return publicUrl;
};

const mergeChunks = async (fileName, totalChunks) => {
  const chunkDir = __dirname + "/chunks";
  const mergedFilePath = __dirname + "/merged_files";

  if (!fs.existsSync(mergedFilePath)) {
    fs.mkdirSync(mergedFilePath);
  }

  const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
    const chunkBuffer = await fs.promises.readFile(chunkFilePath);
    writeStream.write(chunkBuffer);
    fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
  }

  writeStream.end();
  console.log("Chunks merged successfully");
};


router.post("/testupload", upload.single("video"), async (req, res) => {
  if (req.file) {
    const { originalname, mimetype, buffer } = req.file;
    const chunk = buffer;
    const chunkNumber = Number(req.body.chunkNumber); // Sent from the client
    const totalChunks = Number(req.body.totalChunks); // Sent from the client
    const fileName = req.body.originalname;

    const chunkDir = __dirname + "/chunks"; // Directory to save chunks

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

    try {
      await fs.promises.writeFile(chunkFilePath, chunk);
      console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

      if (chunkNumber === totalChunks - 1) {
        // If this is the last chunk, merge all chunks into a single file
        await mergeChunks(fileName, totalChunks);
        console.log("File merged successfully");

        // Upload the merged file to S3
        const mergedFilePath = `${__dirname}/merged_files/${fileName}`;
        const mergedFileBuffer = await fs.promises.readFile(mergedFilePath);
        const resp = await uploadVideo(fileName, mimetype, mergedFileBuffer);
        res.status(200).json({ message: "File uploaded successfully", url: resp });
      } else {
        res.status(200).json({ message: "Chunk uploaded successfully" });
      }
    } catch (error) {
      console.error("Error saving chunk:", error);
      res.status(500).json({ error: "Error saving chunk" });
    }
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
});


module.exports = router;
