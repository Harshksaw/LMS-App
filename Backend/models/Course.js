const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    // trim:true,
    // required:true,
  },
  courseDescription: {
    type: String,
    // trim:true,
  },


  videoSegments: [
    {
      segmentPath: {
        type: String,
        required: false,
      },
      indexFile: {
        type: String,
        required: false,
      },
    },
  ],

  thumbnail: {
    type: String,
  },
  duration: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
