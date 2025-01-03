import PDF from "../models/pdf.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dd5d13l0p",
  api_key: process.env.CLOUDINARY_API_KEY || "394887866187762",
  api_secret: process.env.CLOUDINARY_API_SECRET || "3R9vwK-zY0twfi-stE3xZtpVzME",
});

// Controller to upload a PDF
export const uploadPDF = async (req, res) => {
  try {
    const { title, caption } = req.body;
    const file = req.file; // The file sent from the frontend

    // Ensure we have all the required data
    if (!file || !title || !caption) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Upload the PDF to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw", // Use "raw" for non-image files like PDFs
      folder: "pdfs",
    });

    // Remove the local file after upload (the file is stored temporarily in 'uploads' folder)
    await fs.unlink(file.path);

    // Save the PDF details in the database
    const newPDF = new PDF({
      title,
      caption,
      filePath: result.secure_url, // Store the Cloudinary URL
      isPublic: false, // Default visibility is private
    });

    await newPDF.save();

    res.status(201).json({ message: "PDF uploaded successfully.", pdf: newPDF });
  } catch (error) {
    console.error("Error uploading PDF:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

