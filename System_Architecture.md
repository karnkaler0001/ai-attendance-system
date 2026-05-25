# AI-Based Attendance Management System

# 1. System Architecture

The AI Attendance Management System follows a full-stack architecture consisting of:

- Frontend (React Native + Expo)
- Backend (Node.js + Express.js)
- Database (MongoDB)
- AI/ML Module (face-api.js + TensorFlow.js)

The frontend communicates with backend REST APIs through HTTP requests. The backend processes facial recognition requests, stores attendance records, and manages authentication and reporting.

---

# 2. Architecture Components

## Frontend Layer
Technology Used:
- React Native
- Expo

Responsibilities:
- User login
- Face registration
- Attendance marking
- Attendance history
- Analytics dashboard
- Notification screens

---

## Backend Layer
Technology Used:
- Node.js
- Express.js

Responsibilities:
- API management
- Authentication
- Role-based access control
- Face recognition processing
- Attendance processing
- Excel export generation

---

## Database Layer
Technology Used:
- MongoDB

Collections:
- users
- students
- faces
- attendances
- classes

Responsibilities:
- Store user accounts
- Store attendance records
- Store face descriptors
- Store analytics data

---

## AI/ML Layer
Technology Used:
- face-api.js
- TensorFlow.js

Responsibilities:
- Face detection
- Face landmark extraction
- Face descriptor generation
- Face verification

---

# 3. AI Workflow

## Step 1 — Face Capture
The mobile camera captures the user's face image using Expo Camera.

---

## Step 2 — Image Transfer
The image is converted into Base64 format and sent to backend APIs.

---

## Step 3 — Face Detection
The TinyFaceDetector model detects a face from the image.

---

## Step 4 — Landmark Detection
The FaceLandmark68TinyNet extracts facial landmarks.

---

## Step 5 — Face Descriptor Generation
The FaceRecognitionNet generates a 128-dimensional facial descriptor.

---

## Step 6 — Face Matching
Euclidean distance is calculated between stored descriptors and current face descriptor.

If distance < threshold:
- Face is verified
- Attendance is marked

Otherwise:
- Face is rejected

---

# 4. Security Features

- JWT authentication
- Password hashing using bcrypt
- Role-based access
- Secure REST APIs

---

# 5. Attendance Workflow

1. User logs in
2. Face is captured
3. AI verifies identity
4. Attendance record is stored
5. Analytics are updated
6. Reports can be exported

---

# 6. Reporting Features

- Attendance history
- Analytics dashboard
- Excel export
- Absent student notifications

---

# 7. Technologies Used

| Module | Technology |
|---|---|
| Frontend | React Native |
| Backend | Node.js |
| Database | MongoDB |
| AI/ML | face-api.js |
| ML Backend | TensorFlow.js |
| Authentication | JWT + bcrypt |
| Export | ExcelJS |

---

# 8. Conclusion

The system successfully automates attendance management using AI-based facial recognition technology. The application improves attendance accuracy, reduces manual work, and provides real-time attendance analytics and reporting.