import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Init app
const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Uploads folder setup
const UPLOADS_FOLDER = path.join(__dirname, 'uploads');
try {
  await fs.access(UPLOADS_FOLDER);
} catch {
  await fs.mkdir(UPLOADS_FOLDER);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Import routes
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import paymentRouter from './routes/payment.route.js';
import reviewRouter from './routes/review.route.js';

// API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/review', reviewRouter);

// Cloudinary upload route
app.post('/upload', upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'ApnaGharBazar',
      });
      await fs.unlink(file.path); // delete local file
      return result;
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      message: 'Upload successful',
      files: results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      })),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Serve frontend (after APIs)
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Catch-all route for React Router (Express v5 safe)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(process.env.PORT || 3000, () =>
      console.log(
        `✅ Server running at http://localhost:${process.env.PORT || 3000}`
      )
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
