// controllers/rag.controller.js
import PDF from "../models/pdf.model.js";
import StoryEmbedding from "../models/storyEmbedding.model.js";
import { pipeline } from '@xenova/transformers';
import mongoose from "mongoose";

// Initialize embedding pipeline (cached for performance)
let embedder;
const initializeEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
};

// Generate embeddings for a PDF's content
export const generateEmbeddings = async (req, res) => {
    try {
      console.log("Starting embedding generation..."); // Debug 1
      const { pdfId } = req.body;
      const userId = req.user.id;
  
      console.log("Searching for PDF:", pdfId); // Debug 2
      const pdf = await PDF.findOne({ _id: pdfId, userId });
      
      if (!pdf) {
        console.log("PDF not found or user mismatch"); // Debug 3
        return res.status(404).json({ message: "PDF not found" });
      }
  
      console.log("PDF found. Text length:", pdf.banglaText?.length); // Debug 4
      
      // Initialize embedder
      console.log("Initializing embedder..."); // Debug 5
      await initializeEmbedder();
      if (!embedder) {
        console.error("Embedder failed to initialize"); // Debug 6
        throw new Error("Embedding model not loaded");
      }
  
      // Chunking
      const chunkSize = 500;
      const chunks = [];
      const text = pdf.banglaText || '';
      
      console.log("Original text sample:", text.substring(0, 100)); // Debug 7
      
      for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
      }
  
      console.log(`Created ${chunks.length} chunks`); // Debug 8
      console.log("Sample chunk:", chunks[0]); // Debug 9
  
      // Store embeddings
      let insertedCount = 0;
      for (const chunk of chunks) {
        try {
          const output = await embedder(chunk, { pooling: 'mean', normalize: true });
          const embedding = Array.from(output.data);
          
          await StoryEmbedding.create({
            pdfId,
            userId,
            textChunk: chunk,
            embedding,
            metadata: {
              title: pdf.title,
              createdAt: pdf.createdAt
            }
          });
          insertedCount++;
        } catch (chunkError) {
          console.error(`Error processing chunk ${insertedCount}:`, chunkError);
        }
      }
  
      console.log(`Successfully stored ${insertedCount}/${chunks.length} chunks`); // Debug 10
      
      res.status(200).json({ 
        message: "Embeddings generated",
        chunksProcessed: insertedCount
      });
    } catch (error) {
      console.error("Full error stack:", error);
      res.status(500).json({ 
        message: "Embedding generation failed",
        error: error.message,
        suggestion: "Check server logs for detailed error"
      });
    }
  };

// Search for relevant story chunks
export const searchStories = async (req, res) => {
    try {
      const { query, userId } = req.query;
      console.log("Search request received:", { query, userId }); // Debug
  
      if (!query?.trim() || !userId) {
        return res.status(400).json({ message: "Valid query and userId required" });
      }
  
      if (!embedder) {
        await initializeEmbedder();
        if (!embedder) throw new Error("Embedding model failed to load");
      }
  
      // Generate query embedding
      const output = await embedder(query, { 
        pooling: 'mean', 
        normalize: true 
      });
      const queryEmbedding = Array.from(output.data);
      
      console.log("Query embedding generated. Dimensions:", queryEmbedding.length); // Debug
  
      // Vector search query
      const pipeline = [
        {
          $search: {
            index: "vector_index",
            vectorSearch: {
              queryVector: queryEmbedding,
              path: "embedding",
              numCandidates: 150,
              limit: 5,
              filter: {
                term: {
                  path: "userId",
                  value: new mongoose.Types.ObjectId(userId)
                }
              }
            }
          }
        },
        {
          $project: {
            textChunk: 1,
            metadata: 1,
            score: { $meta: "searchScore" }
          }
        }
      ];
  
      console.log("Executing pipeline:", JSON.stringify(pipeline)); // Debug
      const results = await StoryEmbedding.aggregate(pipeline);
      
      console.log("Search results found:", results.length); // Debug
      if (results.length === 0) {
        return res.status(404).json({ 
          message: "No matching stories found",
          suggestion: "Try using different keywords from your stories"
        });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error("Full search error:", {
        message: error.message,
        stack: error.stack,
        query: req.query.query
      });
      res.status(500).json({ 
        message: "Search failed",
        error: error.message,
        suggestion: "Check if embeddings were generated for your stories"
      });
    }
  };

// Delete embeddings for a PDF
export const deleteEmbeddings = async (req, res) => {
  try {
    const { pdfId } = req.body;
    const userId = req.user.id;

    await StoryEmbedding.deleteMany({ pdfId, userId });
    res.status(200).json({ message: "Embeddings deleted successfully" });
  } catch (error) {
    console.error("Error deleting embeddings:", error);
    res.status(500).json({ message: "Error deleting embeddings", error: error.message });
  }
};