const express = require("express");
const router = express.Router();
const {
  contactUsController,
  socialMediaLinks,
  getCarouseImages,
  aboutUs,
  rateOthersLink,
  createOrUpdateConfig,
} = require("../controllers/AppConfig");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { logsCoupon, getLogs } = require("../controllers/coupon");

const cloudinary = require("cloudinary").v2;

// Configure Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "carousel",

    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

const logRequest = (req, res, next) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);
  next();
};
// Create or update config with file upload and logging middleware
router.post("/config", upload.array("carousel", 5), createOrUpdateConfig);

router.post("/contact", contactUsController);
router.get("/carousel", getCarouseImages);
router.get("/socialMedia", socialMediaLinks);
router.get("/aboutUs", aboutUs);
router.get("/rateOthers", rateOthersLink);
router.post("/create-log", logsCoupon);
router.post("/logs", getLogs);

module.exports = router;
