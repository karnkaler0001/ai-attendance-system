# Usage Guide

# 1. System Requirements

## Hardware Requirements
- Smartphone or webcam
- Minimum 4GB RAM
- Internet/Wi-Fi connection

---

## Software Requirements
- Node.js
- MongoDB
- React Native / Expo
- TensorFlow.js
- face-api.js

---

# 2. Installation Steps

## Backend Setup

1. Open backend folder
2. Install dependencies

```bash
npm install

3. MongoDB Setup
Install MongoDB Compass
Connect using:
mongodb://127.0.0.1:27017
Database name:
attendanceDB
4. User Roles
Admin

Permissions:

Register students
Register faces
View attendance history
View analytics
View absent students
Teacher

Permissions:

Mark attendance
View attendance reports
Student

Permissions:

View personal dashboard
5. Face Registration Process
Open Face Registration screen
Enter student details
Capture face image
System stores facial descriptor
6. Attendance Marking Process
Open Mark Attendance
Capture face
AI verifies identity
Attendance stored in database
7. Analytics Dashboard

The dashboard displays:

Total attendance
Today's attendance
Total students
Recent attendance records
8. Excel Export

Attendance records can be exported using:

http://<IP_ADDRESS>:5050/export
9. Notification System

The system detects absent students automatically and displays them in the notification module.

10. Security Features
JWT Authentication
Encrypted passwords
Role-based access control
11. Future Improvements
Cloud deployment
Real-time notifications
Live face scanning
Anti-spoofing AI
Email/SMS alerts
Attendance percentage reports
12. Conclusion

The AI-Based Attendance Management System successfully automates attendance management using facial recognition technology. The system improves accuracy, reduces manual effort, and provides real-time analytics and reporting capabilities.