const mongoose = require('mongoose');

const DailyUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('DailyUpdate', DailyUpdateSchema);