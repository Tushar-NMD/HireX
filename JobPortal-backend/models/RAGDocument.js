const mongoose = require('mongoose');

const RAGDocumentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  embedding: {
    type: [Number],
    required: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for faster queries
RAGDocumentSchema.index({ documentId: 1 });
RAGDocumentSchema.index({ category: 1 });

module.exports = mongoose.model('RAGDocument', RAGDocumentSchema);
