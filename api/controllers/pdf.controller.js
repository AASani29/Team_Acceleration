// controllers/pdf.controller.js
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

    // Ensure the userId is available from the token (passed via middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Upload the PDF to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw", // Use "raw" for non-image files like PDFs
      folder: "pdfs",
    });

    // Remove the local file after upload (the file is stored temporarily in 'uploads' folder)
    await fs.unlink(file.path);

    // Save the PDF details in the database, now with the userId
    const newPDF = new PDF({
      title,
      caption,
      filePath: result.secure_url, // Store the Cloudinary URL
      isPublic: false, // Default visibility is private
      userId: req.user.id, // Add the user ID from the token
    });

    await newPDF.save();

    res.status(201).json({ message: "PDF uploaded successfully.", pdf: newPDF });
  } catch (error) {
    console.error("Error uploading PDF:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller to fetch PDFs for the logged-in user (only title, caption, and filePath)
export const getUserPDFs = async (req, res) => {
  try {
    // Fetch PDFs with only the selected fields (title, caption, filePath) where userId matches the logged-in user's ID
    const userPDFs = await PDF.find({ userId: req.user.id }).select('title caption filePath');

    if (userPDFs.length === 0) {
      return res.status(404).json({ message: "No PDFs found for this user." });
    }

    // Return the PDFs with the required fields
    res.status(200).json(userPDFs); // Send only title, caption, and filePath as a response
  } catch (error) {
    console.error("Error fetching PDFs:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};