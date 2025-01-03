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
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;
