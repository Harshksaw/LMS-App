const mongoose = require("mongoose");

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

module.exports = mongoose.model("Quiz", Quiz);
