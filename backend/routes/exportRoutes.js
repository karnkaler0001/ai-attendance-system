const express = require("express");
const router = express.Router();

const ExcelJS = require("exceljs");
const Attendance = require("../models/Attendance");

router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      { header: "Student Name", key: "studentName", width: 25 },
      { header: "Student ID", key: "studentId", width: 20 },
      { header: "Date", key: "date", width: 20 },
      { header: "Time", key: "time", width: 20 },
    ];

    records.forEach((record) => {
      worksheet.addRow({
        studentName: record.studentName,
        studentId: record.studentId,
        date: record.date,
        time: record.time,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Export failed",
    });
  }
});

module.exports = router;