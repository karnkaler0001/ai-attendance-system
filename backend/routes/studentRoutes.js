const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const Student = require("../models/Student");
const User = require("../models/User");

const isValidEmail = (email) => {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
};

const isValidPassword = (password) => {
  const hasMinimumLength =
    password.length >= 7;

  const hasAlphabet =
    /[A-Za-z]/.test(password);

  const hasNumber =
    /\d/.test(password);

  return (
    hasMinimumLength &&
    hasAlphabet &&
    hasNumber
  );
};

router.post("/register", async (req, res) => {
  try {
    let {
      name,
      rollNo,
      email,
      password,
    } = req.body;

    name = name?.trim();
    rollNo = rollNo?.trim();
    email = email?.trim().toLowerCase();

    if (
      !name ||
      !rollNo ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!/^\d+$/.test(rollNo)) {
      return res.status(400).json({
        success: false,
        message:
          "Roll number / Student ID must contain numbers only",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 7 characters, including at least one alphabet and one number",
      });
    }

    const existingStudent =
      await Student.findOne({
        rollNo,
      });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID already exists",
      });
    }

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "A user with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const student =
      await Student.create({
        name,
        rollNo,
        email,
      });

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "student",
        studentId: rollNo,
      });

    res.json({
      success: true,
      message:
        "Student account created successfully",
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
    console.log(
      "STUDENT REGISTER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const students =
      await Student.find().sort({
        _id: -1,
      });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.log(
      "GET STUDENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;