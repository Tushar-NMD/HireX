const express = require("express");
const { chat, getRAGStatus } = require("../controllers/chatController");

const router = express.Router();

// Chat endpoint - public access for now
router.post("/chat", chat);

// Get RAG status
router.get("/status", getRAGStatus);

module.exports = router;