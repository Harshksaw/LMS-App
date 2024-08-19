const { contactUsEmail } = require("../mail/templates/contactFormRes")
const { getFeedback } = require("../mail/templates/feedback");
const Config = require("../models/App");
const mailSender = require("../utils/mailSender")
const dotenv = require("dotenv");
dotenv.config();

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )

    const emailRes2 = await mailSender(
      process.env.MAIL_USER,
      "You Got Some Feddback Regarding Kirshna Academy !!",
      getFeedback(email, firstname, lastname, message, phoneNo, countrycode)
    )

    console.log("Email Res ", emailRes)
    console.log("feedback email  Res ", emailRes2);
    return res.json({
      success: true,
      message: "Email sended successfully !!",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong... while sending email",
    })
  }
}

exports.getCarouseImages = async (req, res) => {
  try {
    const config = await Config.findOne();
    res.status(200).json({ success: true, data: config.carouselImages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch carousel images" });
  }


}

exports.socialMediaLinks = async (req, res) => {
  try {
    const config = await Config.findOne();
    res.status(200).json({ success: true, data: config.socialMediaLinks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch social media links" });
  }
}

exports.aboutUs = async (req, res) => { 
  try {
    const config = await Config.findOne();
    res.status(200).json({ success: true, data: config.aboutUs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch about us" });
  }
}

exports.rateOthersLink = async (req, res) => {  
  try {
    const config = await Config.findOne();
    res.status(200).json({ success: true, data: config.rateOthersLink });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch rate others link" });
  }
}


exports.createOrUpdateConfig = async (req, res) => {
  try {
    const { carouselImages, socialMediaLinks, aboutUs, rateOthersLink, shareAppLink } = req.body;
    let config = await Config.findOne();

    if (!config) {
      config = new Config();
    }

    if (carouselImages) config.carouselImages = carouselImages;
    if (socialMediaLinks) config.socialMediaLinks = socialMediaLinks;
    if (aboutUs) config.aboutUs = aboutUs;
    if (rateOthersLink) config.rateOthersLink = rateOthersLink;
    if (shareAppLink) config.shareAppLink = shareAppLink;

    await config.save();
    res.status(200).json({ success: true, message: "Configuration updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update configuration" });
  }
};