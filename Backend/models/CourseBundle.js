const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  bundleName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  
  quizes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  studyMaterials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial'
  }],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  price: {
    type: Number,
    required: true
  },
  aboutDescription: {
    type: String,
    required: true
  },
  listed: {
    type: Boolean,
    default: false
  },
  activeListing: {
    type: Date,
    default: () => new Date().toISOString()
  },
  status: {
		type: String,
		enum: ["Draft", "Published"],
	},
}, {timestamps: true});

const Bundle = mongoose.model('Bundle', bundleSchema);

module.exports = Bundle;