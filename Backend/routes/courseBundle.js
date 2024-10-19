// Import the required modules
const express = require("express");
const router = express.Router();

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const courseBundleController = require("../controllers/courseBundleController");

const storage = multer.diskStorage({
  destination: "./",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// /api/v1/bundle
router.post(
  "/course-bundle",
  upload.single("image"),
  courseBundleController.createCourseBundle
);

// // Route to update an existing course bundle
router.get("/course-bundle/:id", courseBundleController.getCourseBundleById);

router.post(
  "/course-bundle/update/:id",
  courseBundleController.addQuizzesToBundle
);
// router.put("/course-bundle/:id", courseBundleController.);

router.put(
  "/course-bundle/:id",
  upload.single("image"),
  courseBundleController.updateBundle
);

router.post("/course-bundle/:id", courseBundleController.addQuizzesToBundle);

router.post("/delete-bundle/:id", courseBundleController.deleteCourseBundle);

// /step3
router.post(
  "/course-bundle/updateTime/:id",
  courseBundleController.updateTimenListing
);

// // Route to add quizzes to a course bundle
router.post(
  "/course-bundle-materials/:id",
  courseBundleController.addStudyMaterialsToBundle
);

router.post("/getAllcourse-bundle", courseBundleController.getCourseBundle);
router.get("/courseAdmin-bundle", courseBundleController.getAdminCourseBundle);
router.get("/get-all-course-bundle", courseBundleController.getAllCourseBundle);
// // Route to add study materials to a course bundle
// router.post('/course-bundle/:id/study-materials', courseBundleController.addStudyMaterialsToBundle);

router.post("/assignCourseBundle", courseBundleController.assignCourseBundle);
// // Route to list all course bundles

router.get("/getUserBundleQuizzes/:id", courseBundleController.getUserQuizzes);
router.get("/getAllUserBundle/:id", courseBundleController.getAllUserBundles);

router.post("/removeUserBundle", courseBundleController.removeUserBundle);

router.post("/checkPurchase", courseBundleController.checkPurchase);

//for video update

router.post("/updateVideo/:id", courseBundleController.updateVideo);

module.exports = router;
