const express = require("express");
const {
  getAllDailyUpdates,
  getDailyUpdate,
  createDailyUpdate,
  updateDailyUpdate,
  deleteDailyUpdate,
} = require("../controllers/DailyUpdate");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const storage = multer.diskStorage({
//   destination: "./",
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });


const storage = multer.diskStorage({
  destination: './',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage: storage });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const upload = multer({ storage: storage });
router.get("/getAllUpdates", getAllDailyUpdates);
router.get("/getDailyUpdate/:id", getDailyUpdate);
router.post("/createDailyUpdate", upload.single("image"), createDailyUpdate);
router.post("/DailyUpdate/:id", upload.single("image"), updateDailyUpdate);
router.delete("/DeleteUpdate/:id", deleteDailyUpdate);

module.exports = router;
