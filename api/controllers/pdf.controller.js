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
    const { title, caption, banglishText, englishText, banglaText } = req.body;
    const file = req.file; // The file sent from the frontend

    // Ensure we have all the required data
    if (!file || !title || !caption || !banglaText) {
      return res.status(400).json({ message: "PDF file, title, caption, and Bangla text are required." });
    }

    // Validate that at least one source text (banglishText or englishText) is provided
    if (!banglishText && !englishText) {
      return res.status(400).json({ message: "Either Banglish text or English text is required." });
    }

    // Ensure the userId is available from the token (passed via middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    console.log("Uploading PDF to Cloudinary...");
    // Upload the PDF to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw", // Use "raw" for non-image files like PDFs
      folder: "pdfs",
    });

    console.log("Cloudinary upload successful:", result.secure_url);
    // Remove the local file after upload (the file is stored temporarily in 'uploads' folder)
    await fs.unlink(file.path);

    // Save the PDF details in the database, now with the userId
    const newPDF = new PDF({
      title,
      caption,
      filePath: result.secure_url, // Store the Cloudinary URL
      isPublic: false, // Default visibility is private
      userId: req.user.id, // Add the user ID from the token
      banglishText: banglishText || '', // Store the Banglish input text (can be empty)
      englishText: englishText || '', // Store the English input text (can be empty)
      banglaText, // Store the translated Bangla output text
    });

    console.log("Saving PDF to database...");
    await newPDF.save();
    console.log("PDF saved successfully");

    // Generate embeddings for the new PDF
    try {
      const embeddingResponse = await fetch(`${process.env.BACKEND_URL}/api/rag/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization // Forward the auth header
        },
        body: JSON.stringify({ pdfId: newPDF._id })
      });
      
      if (!embeddingResponse.ok) {
        console.error('Embedding generation failed:', await embeddingResponse.text());
      } else {
        console.log('Embeddings generated successfully');
      }
    } catch (embeddingError) {
      console.error('Error in embedding generation:', embeddingError);
    }
    // ===== END OF ADDED CODE =====

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
// Controller to update isPublic to true for a PDF
export const makePDFPublic = async (req, res) => {
  try {
    const { pdfId } = req.body;  // Get the PDF ID from the request body

    // Ensure the PDF exists and belongs to the logged-in user
    const pdf = await PDF.findOne({ _id: pdfId, userId: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found or doesn't belong to the user." });
    }

    // Update the isPublic field
    pdf.isPublic = true;
    await pdf.save();

    res.status(200).json({ message: "PDF is now public.", pdf });
  } catch (error) {
    console.error("Error making PDF public:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// Controller to make a PDF private (set isPublic to false)
export const makePDFPrivate = async (req, res) => {
  try {
    const { pdfId } = req.body;  // Get the PDF ID from the request body

    // Ensure the PDF exists and belongs to the logged-in user
    const pdf = await PDF.findOne({ _id: pdfId, userId: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found or doesn't belong to the user." });
    }

    // Update the isPublic field to false (make the PDF private)
    pdf.isPublic = false;
    await pdf.save();

    res.status(200).json({ message: "PDF is now private.", pdf });
  } catch (error) {
    console.error("Error making PDF private:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
let pdfCache = [];  // Temporary in-memory storage for PDF data

// Function to load all PDFs into memory
const loadPdfsIntoMemory = async () => {
  try {
    // Fetch all PDFs and only select relevant fields: title, caption, banglishText, banglaText
    pdfCache = await PDF.find({}).select('title caption banglishText banglaText');  // Adjust if necessary
    console.log('PDFs loaded into memory');
  } catch (err) {
    console.error('Error loading PDFs into memory', err);
  }
};

// Load PDFs when the server starts
loadPdfsIntoMemory();

// Optionally, refresh the cache every 5 minutes
setInterval(loadPdfsIntoMemory, 5 * 60 * 1000);  // Refresh every 5 minutes

// Search PDFs by Banglish or Bangla text
export const searchPdfByText = async (req, res) => {
  try {
    const { searchText } = req.query;

    // Validate input
    if (!searchText) {
      return res.status(400).json({ message: "Search text is required" });
    }

    // Search for PDFs in memory (case-insensitive search)
    const matchedPdfs = pdfCache.filter(pdf => {
      // Ensure that both banglishText and banglaText exist and are strings before calling toLowerCase()
      const banglishText = pdf.banglishText || "";
      const banglaText = pdf.banglaText || "";

      return (
        banglishText.toLowerCase().includes(searchText.toLowerCase()) ||
        banglaText.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    if (!matchedPdfs.length) {
      return res.status(404).json({ message: "No PDFs found" });
    }

    // Return the matched PDFs with title and caption
    res.status(200).json(matchedPdfs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
