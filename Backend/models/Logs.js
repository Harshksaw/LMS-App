const { Schema, default: mongoose } = require("mongoose");

const logsSchema = new Schema({
  userId: { type: Number, required: true },
  action: { type: String, required: true },
  description: { type: String, required: false },
  logType: { type: String, required: false },
  title: { type: String, required: false },
  courseId: { type: Number, required: false },
});

const Logs = mongoose.model("logs", logsSchema);
module.exports = Logs;
