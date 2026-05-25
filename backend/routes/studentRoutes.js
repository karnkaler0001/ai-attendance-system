const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const Student = require("../models/Student");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, rollNo, email, password } = req.body;

    if (!name || !rollNo || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingStudent = await Student.findOne({ rollNo });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const student = await Student.create({
      name,
      rollNo,
      email,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      studentId: rollNo,
    });

    res.json({
      success: true,
      message: "Student and login account created successfully",
      student,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    console.log("STUDENT REGISTER ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ _id: -1 });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;