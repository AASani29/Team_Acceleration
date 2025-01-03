// routes/pdf.route.js
import express from "express";
import multer from "multer";
import { getUserPDFs, uploadPDF } from "../controllers/pdf.controller.js";
import { verifyToken } from "../utils/verifyUser.js"; // Add verifyToken here

// Create a new router instance
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Temporarily store the file before uploading to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to handle file upload
router.post("/upload", verifyToken, upload.single("pdf"), uploadPDF);  // Apply verifyToken middleware here
router.get("/user-pdfs", verifyToken, getUserPDFs); // Protected route for logged-in user

export default router;
