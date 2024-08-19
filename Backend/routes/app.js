const express = require("express")
const router = express.Router()
const { contactUsController, socialMediaLinks, getCarouseImages, aboutUs, rateOthersLink } = require("../controllers/AppConfig")

//create _>> all configs
router.post("/config", createOrUpdateConfig);


router.post("/contact", contactUsController)
router.get("/carousel", getCarouseImages)
router.get("/socialMedia", socialMediaLinks)
router.get("/aboutUs", aboutUs)
router.get("/rateOthers", rateOthersLink)








module.exports = router