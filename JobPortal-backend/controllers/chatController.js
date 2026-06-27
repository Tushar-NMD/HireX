const { askQuestion, addDocuments, deleteAllDocuments, getDocumentCount } = require("../rag/ragService.js");

const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ 
        error: 'Question is required' 
      });
    }

    const data = await askQuestion(question, 3);

    res.json(data);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ 
      error: err.message || 'Failed to process question'
    });
  }
};

const trainRAG = async (req, res) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Documents array is required' 
      });
    }

    // Validate document structure
    for (const doc of documents) {
      if (!doc.text || doc.text.trim() === '') {
        return res.status(400).json({ 
          success: false,
          message: 'Each document must have a text field' 
        });
      }
    }

    const result = await addDocuments(documents);

    res.json({
      success: true,
      message: `Successfully added ${result.count} documents to RAG`,
      count: result.count
    });
  } catch (err) {
    console.error('Train RAG error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to train RAG'
    });
  }
};

const clearRAG = async (req, res) => {
  try {
    await deleteAllDocuments();

    res.json({
      success: true,
      message: 'All documents cleared from RAG'
    });
  } catch (err) {
    console.error('Clear RAG error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to clear RAG'
    });
  }
};

const getRAGStatus = async (req, res) => {
  try {
    const count = await getDocumentCount();

    res.json({
      success: true,
      documentCount: count,
      status: count > 0 ? 'trained' : 'empty'
    });
  } catch (err) {
    console.error('Get RAG status error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to get RAG status'
    });
  }
};

module.exports = {
  chat,
  trainRAG,
  clearRAG,
  getRAGStatus
};