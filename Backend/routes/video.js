const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { createVideo, getVideo } = require("../controllers/video-stream");

const cloudinary = require("cloudinary").v2;




cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "videocourse",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

console.log("Expected field name: thumbnail");

router.post('/createVideo', upload.single("courseImage"),  createVideo);
router.post('/getVideo', getVideo);


module.exports = router;