const express = require("express");
const { trainRAG, clearRAG } = require("../controllers/chatController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Train RAG with documents - admin only
router.post("/train", protectAdmin, trainRAG);

// Clear all RAG documents - admin only
router.delete("/clear", protectAdmin, clearRAG);

module.exports = router;