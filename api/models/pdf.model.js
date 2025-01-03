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
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Associate the PDF with a specific user
    },
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;
