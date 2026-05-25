const express = require("express");
const router = express.Router();

const faceapi = require("face-api.js");
const canvas = require("canvas");

const Face = require("../models/Face");

router.post("/register", async (req, res) => {
  try {
    const { image, name, studentId } = req.body;

    if (!image || !name || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Image, name, and student ID required",
      });
    }

    console.log("Image received");

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const img = await canvas.loadImage(imageBuffer);

    console.log("Image loaded");

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

    console.log("Face detected");

    const descriptor = Array.from(detection.descriptor);

    const newFace = new Face({
      name,
      studentId,
      descriptor,
    });

    await newFace.save();

    console.log("Face saved");

    res.json({
      success: true,
      message: "Face registered successfully",
    });
  } catch (error) {
    console.log("FACE REGISTER ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;