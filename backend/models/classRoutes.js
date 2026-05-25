const express = require("express");
const router = express.Router();

const Class = require("../models/Class");

router.post("/add", async (req, res) => {
  try {
    const { className, subject, teacherName } = req.body;

    if (!className || !subject || !teacherName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newClass = await Class.create({
      className,
      subject,
      teacherName,
    });

    res.json({
      success: true,
      message: "Class added successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const classes = await Class.find().sort({ _id: -1 });

    res.json({
      success: true,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;