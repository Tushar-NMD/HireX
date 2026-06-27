const { pipeline } = require('@xenova/transformers');
const RAGDocument = require('../models/RAGDocument');

class RAGService {
  constructor() {
    this.embedder = null;
    this.initialized = false;
    this.documentsCache = null; // Cache for performance
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Initializing RAG Service...');
      
      // Load embedding model
      this.embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );

      // Load documents from MongoDB into cache
      await this.loadDocumentsCache();

      this.initialized = true;
      console.log('RAG Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RAG Service:', error);
      throw error;
    }
  }

  async loadDocumentsCache() {
    try {
      const docs = await RAGDocument.find({}).lean();
      this.documentsCache = docs.map(doc => ({
        id: doc.documentId,
        title: doc.title,
        text: doc.text,
        category: doc.category,
        embedding: doc.embedding,
        timestamp: doc.createdAt
      }));
      console.log(`Loaded ${this.documentsCache.length} documents from MongoDB`);
    } catch (error) {
      console.error('Error loading documents cache:', error);
      this.documentsCache = [];
    }
  }

  async generateEmbedding(text) {
    try {
      const output = await this.embedder(text, {
        pooling: 'mean',
        normalize: true
      });
      return Array.from(output.data);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async addDocuments(documents) {
    await this.initialize();

    try {
      const savedDocs = [];

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const id = doc.id || `doc_${Date.now()}_${i}`;
        
        // Generate embedding
        const embedding = await this.generateEmbedding(doc.text);
        
        // Save to MongoDB
        const ragDoc = new RAGDocument({
          documentId: id,
          title: doc.title || 'Untitled',
          text: doc.text,
          category: doc.category || 'general',
          embedding: embedding,
          metadata: doc.metadata || {}
        });

        await ragDoc.save();
        
        // Add to cache
        savedDocs.push({
          id,
          text: doc.text,
          title: doc.title || 'Untitled',
          category: doc.category || 'general',
          embedding,
          timestamp: ragDoc.createdAt
        });
      }

      // Update cache
      this.documentsCache.push(...savedDocs);

      console.log(`Added ${documents.length} documents to RAG`);
      return { success: true, count: documents.length };
    } catch (error) {
      console.error('Error adding documents:', error);
      throw error;
    }
  }

  cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async askQuestion(question, k = 3) {
    await this.initialize();

    try {
      if (!this.documentsCache || this.documentsCache.length === 0) {
        return {
          answer: "I don't have enough information to answer that question. Please train me with relevant documents first.",
          contexts: [],
          question
        };
      }

      // Generate embedding for the question
      const questionEmbedding = await this.generateEmbedding(question);

      // Calculate similarity with all documents
      const similarities = this.documentsCache.map(doc => ({
        ...doc,
        similarity: this.cosineSimilarity(questionEmbedding, doc.embedding)
      }));

      // Sort by similarity and get top k
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topDocs = similarities.slice(0, k);

      // Extract relevant contexts
      const contexts = topDocs.map(doc => ({
        text: doc.text,
        title: doc.title,
        category: doc.category,
        similarity: doc.similarity
      }));

      // Generate answer based on contexts
      const answer = this.generateAnswer(question, contexts);

      return {
        answer,
        contexts: contexts.map(c => ({
          title: c.title,
          text: c.text.substring(0, 200) + '...',
          category: c.category
        })),
        question
      };
    } catch (error) {
      console.error('Error processing question:', error);
      throw error;
    }
  }

  generateAnswer(question, contexts) {
    if (contexts.length === 0) {
      return "I don't have enough information to answer that question. Our team will reach you shortly with more details.";
    }

    // Check relevance score - if too low, don't answer
    const bestMatch = contexts[0];
    if (bestMatch.similarity < 0.3) {
      return "I don't have specific information about that. Our support team will reach you shortly to help with your query.";
    }

    // Simple answer generation based on context relevance
    const relevantContext = contexts[0];
    
    // Extract key information based on question type
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('salary') || questionLower.includes('pay')) {
      return this.extractSalaryInfo(contexts);
    } else if (questionLower.includes('job') || questionLower.includes('position')) {
      return this.extractJobInfo(contexts);
    } else if (questionLower.includes('requirement') || questionLower.includes('skill')) {
      return this.extractRequirementInfo(contexts);
    } else if (questionLower.includes('company') || questionLower.includes('organization')) {
      return this.extractCompanyInfo(contexts);
    } else if (questionLower.includes('how to') || questionLower.includes('apply')) {
      return this.extractApplicationInfo(contexts);
    }

    // Default: Return summary of most relevant context only if similarity is good
    if (relevantContext.similarity > 0.4) {
      return `Based on our information: ${relevantContext.text.substring(0, 300)}${relevantContext.text.length > 300 ? '...' : ''}`;
    } else {
      return "I'm not sure about that specific question. Our team will get back to you with accurate information.";
    }
  }

  extractSalaryInfo(contexts) {
    for (const context of contexts) {
      if (context.similarity < 0.3) continue;
      
      const salaryMatch = context.text.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?|\d+k?\s*-\s*\d+k?/i);
      if (salaryMatch) {
        return `Salary information: ${salaryMatch[0]}. ${context.text.substring(0, 200)}`;
      }
    }
    return "I don't have specific salary information for this role. Please contact our HR team for detailed compensation details.";
  }

  extractJobInfo(contexts) {
    if (contexts[0].similarity < 0.3) {
      return "I don't have specific information about that job. Our recruitment team will reach you shortly with details.";
    }
    return `Here's what I found about jobs: ${contexts[0].text.substring(0, 300)}${contexts[0].text.length > 300 ? '...' : ''}`;
  }

  extractRequirementInfo(contexts) {
    if (contexts[0].similarity < 0.3) {
      return "I don't have specific requirement details. Our team will provide comprehensive information shortly.";
    }
    return `Requirements: ${contexts[0].text.substring(0, 300)}${contexts[0].text.length > 300 ? '...' : ''}`;
  }

  extractCompanyInfo(contexts) {
    if (contexts[0].similarity < 0.3) {
      return "I don't have specific company information at the moment. Our team will reach you with details soon.";
    }
    return `Company information: ${contexts[0].text.substring(0, 300)}${contexts[0].text.length > 300 ? '...' : ''}`;
  }

  extractApplicationInfo(contexts) {
    if (contexts[0].similarity < 0.3) {
      return "I don't have specific application process details. Please check the job listing or contact our support team.";
    }
    return `Application process: ${contexts[0].text.substring(0, 300)}${contexts[0].text.length > 300 ? '...' : ''}`;
  }

  async deleteAllDocuments() {
    await this.initialize();

    try {
      // Delete from MongoDB
      await RAGDocument.deleteMany({});
      
      // Clear cache
      this.documentsCache = [];
      
      console.log('All documents deleted from RAG');
      return { success: true, message: 'All documents deleted' };
    } catch (error) {
      console.error('Error deleting documents:', error);
      throw error;
    }
  }

  async getDocumentCount() {
    await this.initialize();

    try {
      const count = await RAGDocument.countDocuments();
      return count;
    } catch (error) {
      console.error('Error getting document count:', error);
      return 0;
    }
  }
}

// Create and export singleton instance
const ragService = new RAGService();

module.exports = {
  askQuestion: (question, k = 3) => ragService.askQuestion(question, k),
  addDocuments: (documents) => ragService.addDocuments(documents),
  deleteAllDocuments: () => ragService.deleteAllDocuments(),
  getDocumentCount: () => ragService.getDocumentCount()
};