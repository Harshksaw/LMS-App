const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinaryConfig"); // Adjust the import path as needed

const Quiz = new mongoose.Schema({
  name: {
    type: String,
  },
  shortDescription: {
    type: String,
  },
  category: {
    type: String,
  },
  testSeries:{
    type:String
  },
  image: {
    type: String,
  },
  timer:{
    type: Number,
  },
  isPaid: {
    type: Boolean,
  },
  price: {
    type:Number,
  },
  isListed: {
    type: Boolean,
    default: false,
  },
  isPartOfBundle: {
    type: Boolean,
    default: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions",
    },
  ],
  
},{ timestamps: true });


QuizSchema.pre("remove", async function (next) {
  try {
    if (this.image) {
      // Extract the public ID from the image URL
      const publicId = this.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Quiz", Quiz);
