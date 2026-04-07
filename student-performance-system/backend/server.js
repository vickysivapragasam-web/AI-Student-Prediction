require('dotenv').config({ path: '.env.local' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const performanceRoutes = require('./routes/performance');
const studentRoutes = require('./routes/students');
const predictionRoutes = require('./routes/predictions');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentDB';

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/', predictionRoutes);
app.use('/api', performanceRoutes);

app.use((error, _req, res, _next) => {
  if (error.message === 'CORS origin not allowed') {
    res.status(403).json({ error: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log(`Connected to MongoDB: ${MONGODB_URI.split('@')[MONGODB_URI.includes('@') ? 1 : 0]}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    console.error('\n⚠️  Troubleshooting:');
    if (MONGODB_URI.includes('mongodb+srv')) {
      console.error('  → Using MongoDB Atlas');
      console.error('  → Check: https://cloud.mongodb.com → Network Access → Whitelist your IP');
      console.error('  → Or use local MongoDB: Update MONGODB_URI=mongodb://127.0.0.1:27017/studentDB');
    } else {
      console.error('  → Using Local MongoDB');
      console.error('  → Make sure MongoDB is running: mongod');
      console.error('  → Or start with Docker: docker run -d -p 27017:27017 mongo:latest');
    }
    process.exit(1);
  });

