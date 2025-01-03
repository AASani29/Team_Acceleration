// models/pdf.model.js
import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // Default to private
    },
    userId: {  // Add userId field
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,  // Ensure a userId is always associated with the PDF
    },
    banglishText: { // Store the Banglish input text
      type: String,
      required: true,
    },
    banglaText: { // Store the translated Bangla output text
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;
