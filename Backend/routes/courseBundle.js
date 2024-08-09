// Import the required modules
const express = require("express");
const router = express.Router();

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const courseBundleController = require('../controllers/courseBundleController');



  

  const storage = multer.diskStorage({
    destination: './',
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });





// /api/v1/Bundle
router.post('/course-bundle', upload.single('image'), courseBundleController.createCourseBundle);

// // Route to update an existing course bundle
router.post('/course-bundle/update/:id', courseBundleController.addQuizzesToBundle);

// /step3
router.post('/course-bundle/updateTime/:id', courseBundleController.updateTimenListing);

// // Route to add quizzes to a course bundle
router.post('/course-bundle/:id', courseBundleController.addStudyMaterialsToBundle);
router.get('/course-bundle', courseBundleController.getCourseBundle);

router.get('/course-bundle/:id', courseBundleController.getCourseBundleById);
// // Route to add study materials to a course bundle
// router.post('/course-bundle/:id/study-materials', courseBundleController.addStudyMaterialsToBundle);

// // Route to list all course bundles
// router.get('/course-bundle', courseBundleController.listCourseBundles);



module.exports = router