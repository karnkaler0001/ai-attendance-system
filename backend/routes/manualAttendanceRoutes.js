const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

router.post("/mark", async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const student = await Student.findOne({
      rollNo: studentId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const now = new Date();

    const attendance = await Attendance.create({
      studentName: student.name,
      studentId: student.rollNo,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    });

    res.json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.log("MANUAL ATTENDANCE ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;