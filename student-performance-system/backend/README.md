# Student Performance Backend API

A comprehensive REST API backend for the Student Performance AI System, built with Node.js, Express, and MongoDB. This service handles user authentication, student data management, performance tracking, and AI predictions integration.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Student Management** - CRUD operations for student records
- **Performance Tracking** - Academic performance data management
- **AI Predictions** - Integration with ML prediction service
- **File Upload** - CSV data import functionality
- **MongoDB Integration** - Built-in MongoDB with Docker support
- **CORS Support** - Cross-origin resource sharing
- **Health Monitoring** - API health checks

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.22+
- **Database**: MongoDB 7.8+ (built-in with Docker)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: multer
- **CORS**: cors middleware
- **CSV Parsing**: csv-parser
- **HTTP Client**: axios

## 📁 Project Structure

```
backend/
├── middleware/           # Authentication & middleware
│   └── auth.js          # JWT authentication middleware
├── models/              # MongoDB schemas
│   ├── User.js          # User model with auth
│   ├── Student.js       # Student data model
│   ├── Performance.js   # Academic performance model
│   └── Prediction.js    # AI prediction results model
├── routes/              # API route handlers
│   ├── auth.js          # Authentication endpoints
│   ├── students.js      # Student CRUD operations
│   ├── performance.js   # Performance data endpoints
│   └── predictions.js   # AI prediction endpoints
├── scripts/             # Utility scripts
│   └── seedDemoData.js  # Database seeding script
├── utils/               # Helper utilities
│   ├── aiClient.js      # AI service communication
│   └── scoring.js       # Performance scoring logic
├── uploads/             # File upload directory
├── .env.local           # Environment variables
├── Dockerfile           # Docker container config
├── package.json         # Dependencies & scripts
├── server.js            # Main application entry point
└── README.md            # This file
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB (local or Atlas)

### Local Development Setup

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create `.env.local` file:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/studentDB

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # CORS
   FRONTEND_URL=http://localhost:3000

   # Admin Registration (optional)
   ALLOW_ADMIN_REGISTRATION=true
   ```

4. **Start MongoDB:**
   ```bash
   # Using Docker (recommended)
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or using local MongoDB installation
   mongod
   ```

5. **Seed demo data (optional):**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 🐳 Docker Setup

### Build and Run with Docker

```bash
# Build the image
docker build -t student-performance-backend .

# Run the container
docker run -p 5000:5000 -p 27017:27017 student-performance-backend
```

### Docker Compose (Full Stack)

For the complete application with all services:

```bash
# From project root
docker compose up --build
```

## 🌐 API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | User registration | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/me` | Get current user info | Yes |

### Student Routes (`/students`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/students` | Get all students | Yes | Any |
| POST | `/students` | Create new student | Yes | Admin/Faculty |
| GET | `/students/:id` | Get student by ID | Yes | Any |
| PUT | `/students/:id` | Update student | Yes | Admin/Faculty |
| DELETE | `/students/:id` | Delete student | Yes | Admin |
| POST | `/students/upload` | Upload CSV data | Yes | Admin/Faculty |

### Performance Routes (`/api`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/performance` | Get performance data | Yes | Any |
| POST | `/api/performance` | Create performance record | Yes | Admin/Faculty |
| GET | `/api/performance/:id` | Get performance by ID | Yes | Any |
| PUT | `/api/performance/:id` | Update performance | Yes | Admin/Faculty |
| DELETE | `/api/performance/:id` | Delete performance | Yes | Admin |

### Prediction Routes (`/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/predict` | Get AI prediction | Yes |
| GET | `/predictions` | Get prediction history | Yes |
| GET | `/predictions/:id` | Get prediction by ID | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | API health status | No |

## 🔐 Authentication & Authorization

### JWT Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **user**: Basic user access
- **student**: Student-specific access
- **faculty**: Teaching staff with elevated permissions
- **admin**: Full system access

### Role-Based Access Control

Some endpoints require specific roles. The middleware automatically checks user roles and returns 403 Forbidden if access is denied.

## 📊 Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin', 'student', 'faculty']),
  createdAt: Date,
  updatedAt: Date
}
```

### Student Model
```javascript
{
  studentName: String (required),
  registerNo: String (required, unique),
  email: String (required),
  department: String (required),
  yearOrSemester: String (required),
  examScore: Number,
  assignmentScore: Number,
  seminarScore: Number,
  projectScore: Number,
  sportsScore: Number,
  hackathonScore: Number,
  attendance: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Performance Model
```javascript
{
  studentId: ObjectId (ref: Student),
  examScore: Number,
  assignmentScore: Number,
  seminarScore: Number,
  projectScore: Number,
  sportsScore: Number,
  hackathonScore: Number,
  attendance: Number,
  totalScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Prediction Model
```javascript
{
  userId: ObjectId (ref: User),
  studentData: Object,
  predictedScore: Number,
  pass: Boolean,
  createdAt: Date
}
```

## 🔄 API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get AI Prediction
```bash
curl -X POST http://localhost:5000/predict \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "examScore": 85,
    "assignmentScore": 80,
    "seminarScore": 75,
    "projectScore": 90,
    "sportsScore": 20,
    "hackathonScore": 25,
    "attendance": 95
  }'
```

## 🧪 Testing

### Manual Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints.

### Automated Testing

```bash
# Install testing dependencies (if added)
npm install --save-dev jest supertest

# Run tests
npm test
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-user:prod-pass@cluster.mongodb.net/prod-db
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://yourdomain.com
ALLOW_ADMIN_REGISTRATION=false
```

### Docker Production Build

```bash
# Build production image
docker build -t student-performance-backend:prod .

# Run in production
docker run -d \
  --name student-performance-backend \
  -p 5000:5000 \
  -p 27017:27017 \
  --env-file .env.production \
  student-performance-backend:prod
```

### Health Checks

The API includes health check endpoints for monitoring:

- `GET /health` - Returns `{"status": "ok"}` when healthy

## 🔧 Development

### Available Scripts

```bash
# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# Seed database with demo data
npm run seed
```

### Code Style

- Use ESLint for code linting (if configured)
- Follow standard JavaScript naming conventions
- Use async/await for asynchronous operations
- Include JSDoc comments for functions

### Adding New Routes

1. Create route file in `routes/` directory
2. Import and use in `server.js`
3. Add authentication middleware as needed
4. Update this README with new endpoints

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running on port 27017
   - Check `MONGODB_URI` in environment variables
   - For Docker: MongoDB runs inside the backend container

2. **Authentication Errors**
   - Verify JWT token is valid and not expired
   - Check token format: `Bearer <token>`
   - Ensure user exists in database

3. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Ensure frontend URL is in allowed origins

4. **File Upload Issues**
   - Check `uploads/` directory permissions
   - Ensure multer is properly configured

### Logs

Check application logs for detailed error information:

```bash
# Docker logs
docker logs student-performance-backend

# Local development
npm run dev  # Shows logs in terminal
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License - see package.json for details

## 📞 Support

For issues and questions:
1. Check this README
2. Review the main project documentation
3. Check existing GitHub issues
4. Create a new issue with detailed information