import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import pdfRoutes from './routes/pdf.route.js';
import updateCsvRoutes from "./routes/csv.js";
import { WebSocketServer } from 'ws'; // Import WebSocket server
import ragRoutes from './routes/rag.route.js';
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api", updateCsvRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rag", ragRoutes);
app.use('/api/user', userRoutes);

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

// Start the HTTP server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// WebSocket server setup for collaborative text editor
const wss = new WebSocketServer({ server }); // Attach WebSocket server to HTTP server
let document = ''; // Shared document state

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send the current document state to the new client
  ws.send(JSON.stringify({ type: 'init', data: document }));

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === 'update') {
        document = parsedMessage.data;

        // Broadcast the update to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', data: document }));
          }
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
