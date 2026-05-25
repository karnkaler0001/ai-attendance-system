const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentName: String,
  studentId: String,
  date: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);