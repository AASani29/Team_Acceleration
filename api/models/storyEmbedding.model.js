// models/storyEmbedding.model.js
import mongoose from "mongoose";

const storyEmbeddingSchema = new mongoose.Schema({
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PDF',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  textChunk: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number], // Array of numbers for the vector
    required: true
  },
  metadata: {
    title: String,
    createdAt: Date
  }
}, { timestamps: true });

const StoryEmbedding = mongoose.model('StoryEmbedding', storyEmbeddingSchema);

export default StoryEmbedding;