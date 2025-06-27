// routes/rag.route.js
import express from "express";
import { generateEmbeddings, searchStories, deleteEmbeddings } from "../controllers/rag.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/generate-embeddings", verifyToken, generateEmbeddings);
router.get("/search-stories", verifyToken, searchStories);
router.post("/delete-embeddings", verifyToken, deleteEmbeddings);

export default router;