require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { loadModels } = require("./ai/faceModel");
const manualAttendanceRoutes = require("./routes/manualAttendanceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const faceRoutes = require("./routes/faceRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const historyRoutes = require("./routes/historyRoutes");
const exportRoutes = require("./routes/exportRoutes");
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use("/students", studentRoutes);
app.use("/face", faceRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/history", historyRoutes);
app.use("/export", exportRoutes);
app.use("/auth", authRoutes);
app.use("/classes", classRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/notifications", notificationRoutes);
app.use("/manual-attendance", manualAttendanceRoutes);


app.get("/", (req, res) => {
  res.send("API WORKING");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await loadModels();
    console.log("AI Models Loaded Successfully");

    app.listen(5050, "0.0.0.0", () => {
      console.log("Server running on 5050");
    });
  } catch (error) {
    console.log("SERVER ERROR:");
    console.log(error);
  }
};

startServer();