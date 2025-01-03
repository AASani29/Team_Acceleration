import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import pdfRoutes from './routes/pdf.route.js';


import updateCsvRoutes from "./routes/csv.js"; 


// Load environment variables
dotenv.config();

// Ensure MONGO environment variable is set
if (!process.env.MONGO) {
  console.error('Error: MONGO environment variable is not defined.');
  process.exit(1);
}

const app = express();
const __dirname = path.resolve();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit if the database connection fails
  });

// Middleware

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api", updateCsvRoutes);

// Catch-all route for serving the client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`Error: ${message} (Status: ${statusCode})`);
  res.status(statusCode).json({
    success: false,
    message,
  });
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



