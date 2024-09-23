const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { logsCoupon, getLogs } = require("../controllers/coupon");


const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { stderr, stdout } = require("process");
const { uploadVideo } = require("../controllers/video-stream");

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir);
    },
    filename: function(req, file, cb){
      cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
  })

  // multer configuration
const upload = multer({storage: storage})



router.post("/upload", upload.single("video"), uploadVideo)

module.exports = router;