const { Schema, default: mongoose } = require("mongoose");

const logsSchema = new Schema({
  // userId: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  description: { type: String, required: false },
  logType: { type: Number, required: false },
  title: { type: String, required: false },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
});

const Logs = mongoose.model("logs", logsSchema);
module.exports = Logs;
