# Student Performance System - Auth & Panels TODO

## Plan Steps (Completed ✅)

### 1. Backend Setup - DONE
- [x] User model, auth deps, register/login, middleware, protected routes, import CSV

### 2. Frontend Setup - DONE
- [x] react-router-dom, AuthContext, Login/Register, Panels (Student/Faculty/Admin), routes, CSV upload, auth integration

### 3. Testing - READY
**Run these commands:**
1. Start MongoDB (`mongod`)
2. `cd student-performance-system/ai-service && python app.py`
3. `cd student-performance-system/backend && node server.js`
4. `cd student-performance-system/frontend && npm start`

**Usage:**
- Go to http://localhost:3000/register → Create admin/faculty/student accounts
- Login at /login
- Admin/Faculty: Dashboard → CSV import (columns: studentId,examScore,assignmentScore,seminarScore,projectScore,sportsScore,hackathonScore,attendance)
- Student: View own performances
- Predictor: Public ML prediction + leaderboard (auth for personalized)

Full project complete with admin/user/faculty panels and local CSV data import!

**Sample CSV for test:**
```
studentId,examScore,assignmentScore,seminarScore,projectScore,sportsScore,hackathonScore,attendance
student1,85,90,88,92,30,25,95
student2,70,75,80,78,40,35,88
```

