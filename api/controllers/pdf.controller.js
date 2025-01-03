import PDF from "../models/pdf.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dd5d13l0p",
  api_key: process.env.CLOUDINARY_API_KEY ||"394887866187762" ,
  api_secret: process.env.CLOUDINARY_API_SECRET || "3R9vwK-zY0twfi-stE3xZtpVzME",
});

// Controller to upload a PDF
export const uploadPDF = async (req, res) => {
  try {
    const { title, caption } = req.body;

    if (!title || !caption || !req.file) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Upload the PDF to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // Use "raw" for non-image files like PDFs
      folder: "pdfs",
    });

    // Remove the local file after upload
    await fs.unlink(req.file.path);

    // Save the PDF details in the database
    const newPDF = new PDF({
      title,
      caption,
      filePath: result.secure_url, // Store the Cloudinary URL
      ownerId: req.user._id, // Assuming `req.user` is set by authMiddleware
    });

    await newPDF.save();

    res.status(201).json({ message: "PDF uploaded successfully.", pdf: newPDF });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to update PDF visibility
export const updatePDFVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;

    const pdf = await PDF.findById(id);

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found." });
    }

    // Ensure only the owner can update visibility
    if (pdf.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    pdf.isPublic = isPublic;
    await pdf.save();

    res.status(200).json({ message: "PDF visibility updated.", pdf });
  } catch (error) {
    console.error("Error updating PDF visibility:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
