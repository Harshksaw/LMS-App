const mongoose = require("mongoose");

const cloudinary = require("cloudinary").v2;
const QuizSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  shortDescription: {
    type: String,
  },
  category: {
    type: String,
  },

  image: {
    type: String,
  },
  timer:{
    type: Number,
  },
 
  price: {
    type:Number,
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
module.exports = mongoose.model("Quiz", QuizSchema);
