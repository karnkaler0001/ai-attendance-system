const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");


// ALL HISTORY
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().sort({
      _id: -1,
    });

    res.json({
      success: true,
      records,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// STUDENT HISTORY
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({
      studentId,
    }).sort({
      _id: -1,
    });

    res.json({
      success: true,
      records,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;