const express = require("express");
const router = express.Router();

const faceapi = require("face-api.js");
const canvas = require("canvas");

const Face = require("../models/Face");
const Attendance = require("../models/Attendance");

router.post("/login", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image received",
      });
    }

    console.log("Login image received");

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const img = await canvas.loadImage(imageBuffer);

    console.log("Login image loaded");

    const detection = await faceapi
      .detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.3,
        })
      )
      .withFaceLandmarks(true)
      .withFaceDescriptor();

    if (!detection) {
      return res.status(400).json({
        success: false,
        message: "No face detected",
      });
    }

    console.log("Face detected for login");

    const savedFaces = await Face.find();

    if (savedFaces.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No registered faces",
      });
    }

    let matchedUser = null;

    for (const savedFace of savedFaces) {
      const distance = faceapi.euclideanDistance(
        detection.descriptor,
        savedFace.descriptor
      );

      console.log("Distance:", distance);

      if (distance < 0.7) {
        matchedUser = savedFace;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: "Face not recognized",
      });
    }

    const now = new Date();

    const attendance = new Attendance({
      studentName: matchedUser.name,
      studentId: matchedUser.studentId,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    });

    await attendance.save();

    console.log("Attendance Saved");

    res.json({
      success: true,
      message: "Attendance Marked Successfully",
      studentName: matchedUser.name,
      studentId: matchedUser.studentId,
    });
  } catch (error) {
    console.log("LOGIN ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;