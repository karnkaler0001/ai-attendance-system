const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");

router.get("/", async (req, res) => {
  try {
    // TOTAL ATTENDANCE
    const totalAttendance =
      await Attendance.countDocuments();

    // UNIQUE STUDENTS
    const uniqueStudents =
      await Attendance.distinct(
        "studentId"
      );

    // TODAY DATE
    const today =
      new Date().toLocaleDateString();

    // TODAY ATTENDANCE
    const todayAttendance =
      await Attendance.countDocuments({
        date: today,
      });

    // RECENT RECORDS
    const recentAttendance =
      await Attendance.find()
        .sort({ _id: -1 })
        .limit(5);

    res.json({
      success: true,

      analytics: {
        totalAttendance,
        totalStudents:
          uniqueStudents.length,
        todayAttendance,
        recentAttendance,
      },
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