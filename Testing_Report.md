# Testing Report

## 1. Login Testing

| Test Case | Input | Expected Output | Result |
|---|---|---|---|
| Valid admin login | Correct email/password | Dashboard opens | Pass |
| Wrong password | Incorrect password | Login failed message | Pass |
| Empty fields | Blank email/password | Validation error | Pass |

## 2. Student Registration Testing

| Test Case | Input | Expected Output | Result |
|---|---|---|---|
| Valid student details | Name, ID, Email | Student registered | Pass |
| Empty fields | Missing data | Error message | Pass |

## 3. Face Registration Testing

| Test Case | Input | Expected Output | Result |
|---|---|---|---|
| Clear face image | Proper lighting | Face registered | Pass |
| No face | Camera without face | No face detected | Pass |
| Poor lighting | Dark image | Detection may fail | Pass |

## 4. Attendance Testing

| Test Case | Input | Expected Output | Result |
|---|---|---|---|
| Registered face | Same student face | Attendance marked | Pass |
| Unknown face | Unregistered person | Face not recognized | Pass |
| No face | Empty camera | No face detected | Pass |

## 5. Reporting Testing

| Test Case | Input | Expected Output | Result |
|---|---|---|---|
| View history | Open history screen | Attendance records shown | Pass |
| Export Excel | Open export URL | Excel file downloaded | Pass |
| Analytics | Open dashboard | Counts displayed | Pass |