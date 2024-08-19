const express = require("express")
const router = express.Router()
const { contactUsController, socialMediaLinks, getCarouseImages, aboutUs, rateOthersLink, createOrUpdateConfig } = require("../controllers/AppConfig");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dkijovd6p",
    api_key: 351972686379935,
    api_secret: "Cgm2d5dHRR7NsBNcus9mL1fQlfk",
  });
  
  
  // Configure Multer storage using Cloudinary
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "carousel-images",
      resource_type: "auto",
    },
  })
    const upload = multer({ storage: storage });

//create _>> all configs
router.post("/config",upload.array('carousel', 5)  , createOrUpdateConfig);


router.post("/contact", contactUsController)
router.get("/carousel", getCarouseImages)
router.get("/socialMedia", socialMediaLinks)
router.get("/aboutUs", aboutUs)
router.get("/rateOthers", rateOthersLink)








module.exports = router