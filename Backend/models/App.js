const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  isUnderMaintenance: {
    type: Boolean,
    default: false,
  },
  needsUpdate: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
  carouselImages: {
    type: [String],
    default: [],
  },
  socialMediaLinks: {
    type: [String],
    default: ["", "", "", ""], // Default array with four empty strings
  },
  aboutUs: {
    type: String,
    default: "",
  },
  rateOthersLink: {
    type: String,
    default: "",
  },
  shareAppLink: {
    type: String,
    default: "",
  },
  
  
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;