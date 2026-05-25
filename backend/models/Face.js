const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  descriptor: [Number],
});

module.exports = mongoose.model("Face", faceSchema);