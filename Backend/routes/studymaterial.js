// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { uploadStudyMaterials,getAllStudyMaterials, getStudyMaterialById, buyStudyMaterial, getAllBoughtStudyMaterials, getAllBundleMaterial } = require("../controllers/CourseMaterials")
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: './',
//   filename: function(req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// Configure Multer storage

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/uploadStudyMaterials",upload.single('file'),  uploadStudyMaterials)
router.get("/getAllStudyMaterials",  getAllStudyMaterials)
router.get("/getStudyMaterialbyId/:id",  getStudyMaterialById)
router.get("/getIsBundledMaterials",  getAllBundleMaterial)
router.post("/buyStudyMaterial", buyStudyMaterial);

router.post("/getAllBoughtStudyMaterials", getAllBoughtStudyMaterials);
router.get("/getIsBundledMaterials", getAllBundleMaterial)
// router.get("/getIsBundledMaterials", )
// router.post("/verifyPayment", verifyPayment)
// router.post("/sendPaymentSuccessEmail",  sendPaymentSuccessEmail);

module.exports = router