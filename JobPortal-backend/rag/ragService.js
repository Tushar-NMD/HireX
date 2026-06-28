const { pipeline } = require('@xenova/transformers');
const RAGDocument = require('../models/RAGDocument');
const axios = require('axios');

class RAGService {
  constructor() {
    this.embedder = null;
    this.initialized = false;
    this.documentsCache = null;
    // Don't load API key in constructor - load it when needed
  }
  
  getGroqApiKey() {
    // Load API key when actually needed
    if (!this._groqApiKey) {
      this._groqApiKey = process.env.GROQ_API_KEY;
      console.log('🔍 Loading GROQ_API_KEY:', this._groqApiKey ? 'FOUND' : 'NOT FOUND');
    }
    return this._groqApiKey;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🚀 Initializing RAG Service...');
      console.log('📥 Loading embedding model (this may take 10-20 seconds on first run)...');
      
      // Load embedding model
      this.embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );

      console.log('✅ Embedding model loaded successfully');

      // Load documents from MongoDB into cache
      console.log('📚 Loading documents from database...');
      await this.loadDocumentsCache();

      this.initialized = true;
      console.log('✅ RAG Service initialized successfully');
      console.log(`📊 Total documents loaded: ${this.documentsCache.length}`);
    } catch (error) {
      console.error('❌ Failed to initialize RAG Service:', error);
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
      if (!this.embedder) {
        throw new Error('Embedder not initialized. Call initialize() first.');
      }
      
      console.log('🔄 Generating embedding for text...');
      const output = await this.embedder(text, {
        pooling: 'mean',
        normalize: true
      });
      console.log('✅ Embedding generated successfully');
      return Array.from(output.data);
    } catch (error) {
      console.error('❌ Error generating embedding:', error);
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
    console.log(`\n💬 Processing question: "${question}"`);
    await this.initialize();

    try {
      // Even if no documents, still use Gemini to answer
      let contexts = [];
      
      if (this.documentsCache && this.documentsCache.length > 0) {
        console.log(`📚 Searching through ${this.documentsCache.length} documents...`);

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

        console.log(`🎯 Top ${k} matches found:`);
        topDocs.forEach((doc, idx) => {
          console.log(`  ${idx + 1}. "${doc.title}" (similarity: ${doc.similarity.toFixed(3)})`);
        });

        // Extract relevant contexts
        contexts = topDocs.map(doc => ({
          text: doc.text,
          title: doc.title,
          category: doc.category,
          similarity: doc.similarity
        }));
      } else {
        console.log('⚠️  No documents in cache - Gemini will answer without context');
        // Create a dummy context for Gemini to work with
        contexts = [{
          text: '',
          title: 'No context',
          category: 'general',
          similarity: 0
        }];
      }

      // Generate answer using Gemini AI
      const answer = await this.generateAnswerWithGemini(question, contexts);

      console.log('✅ Answer generated successfully\n');

      return {
        answer,
        contexts: contexts
          .filter(c => c.similarity > 0)
          .map(c => ({
            title: c.title,
            text: c.text.substring(0, 200) + '...',
            category: c.category
          })),
        question
      };
    } catch (error) {
      console.error('❌ Error processing question:', error);
      throw error;
    }
  }

  async generateAnswerWithGemini(question, contexts) {
    const bestMatch = contexts[0];
    const groqApiKey = this.getGroqApiKey(); // Get API key dynamically
    
    console.log(`🤖 Using Groq AI - Best match similarity: ${bestMatch.similarity.toFixed(3)}`);
    console.log(`🔑 Groq API Key present: ${groqApiKey ? 'YES' : 'NO'}`);
    
    // If no Groq API key, use fallback
    if (!groqApiKey) {
      console.log('⚠️  No Groq API key found, using fallback response');
      if (bestMatch.text) {
        return bestMatch.text;
      }
      return "I don't have information about that. Please contact our support team for assistance.";
    }

    try {
      // Prepare context for Groq
      let contextText = '';
      const goodMatches = contexts.filter(c => c.text && c.text.trim() !== '');
      
      if (goodMatches.length > 0) {
        contextText = goodMatches
          .map((c, idx) => `Document ${idx + 1} (${c.title}):\n${c.text}`)
          .join('\n\n');
      }

      // Build the system and user messages
      const systemMessage = "You are a helpful job portal assistant. Answer questions about jobs, careers, and employment in a friendly and professional manner. Be concise but informative.";
      
      let userMessage;
      if (contextText) {
        userMessage = `Based on these documents from our job portal:

${contextText}

User question: ${question}

Please answer the question. If the documents contain relevant information, use it. Otherwise, provide a helpful general answer about jobs and careers.`;
      } else {
        userMessage = `User question: ${question}

Please provide a helpful answer about jobs, careers, or employment.`;
      }

      console.log('📤 Sending request to Groq API...');

      // Call Groq API
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile', // Fast and powerful
          messages: [
            {
              role: 'system',
              content: systemMessage
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          top_p: 1,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      console.log(`📥 Groq API response status: ${response.status}`);

      const data = response.data;
      
      if (data.choices && data.choices[0]?.message?.content) {
        const answer = data.choices[0].message.content.trim();
        console.log('✅ Groq AI answer extracted successfully');
        return answer;
      } else {
        console.error('❌ Invalid Groq response structure:', JSON.stringify(data, null, 2));
        throw new Error('Invalid response from Groq API');
      }

    } catch (error) {
      console.error('❌ Groq API error:', error.message);
      if (error.response) {
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Error response status:', error.response.status);
      }
      
      // Fallback to trained document
      if (bestMatch.text && bestMatch.text.trim() !== '') {
        console.log('↩️  Falling back to trained document');
        return bestMatch.text;
      } else {
        console.log('↩️  No trained document available');
        return "I'm having trouble connecting to AI service. Please try again later.";
      }
    }
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