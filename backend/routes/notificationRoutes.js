const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({
      studentId,
    }).sort({ _id: -1 });

    res.json({
      success: true,
      records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/absent", async (req, res) => {
  try {
    const today =
      new Date().toLocaleDateString();

    // ALL STUDENTS
    const students =
      await Student.find();

    // TODAY ATTENDANCE
    const todayAttendance =
      await Attendance.find({
        date: today,
      });

    // PRESENT IDS
    const presentStudentIds =
      todayAttendance.map(
        (record) => record.studentId
      );

    // ABSENT STUDENTS
    const absentStudents =
      students.filter(
        (student) =>
          !presentStudentIds.includes(
            student.rollNo
          )
      );

    res.json({
      success: true,
      absentStudents,
      totalAbsent:
        absentStudents.length,
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