import express from "express";
import multer from "multer";
import { uploadPDF, updatePDFVisibility } from "../controllers/pdf.controller.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save temporarily before uploading to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("pdf"), uploadPDF);
router.patch("/visibility/:id", updatePDFVisibility);

export default router;
