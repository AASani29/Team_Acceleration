import express from "express";
import multer from "multer";
import { uploadPDF } from "../controllers/pdf.controller.js";

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
router.post("/upload", upload.single("pdf"), uploadPDF);

export default router;
