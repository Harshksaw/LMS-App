const mongoose = require("mongoose");

const socialMediaLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

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
    type: [socialMediaLinkSchema],
    default: [], // Default to an empty array
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