# RAG (Retrieval-Augmented Generation) Setup Guide

## Overview
This project now uses a **JavaScript-based RAG system** instead of the C++ implementation. The system uses:
- **ChromaDB** - Vector database for document storage
- **Xenova Transformers** - For generating embeddings
- **Express.js** - Backend API

## Prerequisites

### 1. Install Python (Required for ChromaDB)
```bash
# Windows
Download from: https://www.python.org/downloads/

# Mac
brew install python

# Linux
sudo apt-get install python3 python3-pip
```

### 2. Install ChromaDB
```bash
pip install chromadb
```

### 3. Verify Installation
```bash
chroma --version
```

## Running the RAG System

### Step 1: Start ChromaDB Server
Open a terminal in the `JobPortal-backend` folder:

```bash
chroma run --path ./chroma_data --port 8000
```

Or use the npm script:
```bash
npm run chroma
```

You should see:
```
Running Chroma on http://localhost:8000
```

### Step 2: Start Backend Server
In another terminal:

```bash
npm run dev
```

### Step 3: Start Frontend
In the `JobPortal-frontend` folder:

```bash
npm run dev
```

## Using the AI Training Feature

### As Admin:
1. Login as admin
2. Navigate to "Train AI" page
3. Add documents with:
   - **Title**: Short description (e.g., "Software Engineer Job")
   - **Text**: Full content (job description, requirements, salary, etc.)
4. Click "🚀 Train AI"
5. You can add multiple documents at once

### Example Training Data:
```json
{
  "title": "Software Engineer Position",
  "text": "We are looking for a Software Engineer with 3+ years experience in React and Node.js. Salary range: $80,000 - $120,000. Requirements: Bachelor's degree in CS, experience with TypeScript, MongoDB, and AWS. Benefits include health insurance, 401k, and remote work options."
}
```

## API Endpoints

### Chat (Public)
```http
POST /api/chat
Content-Type: application/json

{
  "question": "What is the salary for Software Engineer?"
}
```

### Train AI (Admin Only)
```http
POST /api/train
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "documents": [
    {
      "title": "Job Title",
      "text": "Full job description...",
      "category": "engineering"
    }
  ]
}
```

### Clear All Documents (Admin Only)
```http
DELETE /api/train/clear
Authorization: Bearer <admin_token>
```

### Get RAG Status
```http
GET /api/chat/status
```

## How It Works

1. **Training Phase**:
   - Admin adds documents via TrainAI page
   - Text is converted to vector embeddings using `all-MiniLM-L6-v2` model
   - Embeddings are stored in ChromaDB

2. **Query Phase**:
   - User asks a question in the chatbot
   - Question is converted to embedding
   - ChromaDB finds the 3 most similar documents
   - System generates an answer based on retrieved context

3. **Answer Generation**:
   - Extracts relevant information based on question type
   - Supports queries about: salary, jobs, requirements, company info, application process

## Troubleshooting

### ChromaDB Not Starting
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# Kill the process if needed (Windows)
taskkill /PID <PID> /F

# Or use a different port
chroma run --path ./chroma_data --port 8001
# Then update backend .env: CHROMA_URL=http://localhost:8001
```

### Module Not Found Errors
```bash
# In JobPortal-backend folder
npm install chromadb @xenova/transformers
```

### Slow First Query
- The first query takes 10-20 seconds because the embedding model needs to download (~80MB)
- Subsequent queries are much faster (< 1 second)

### No Answers Returned
- Make sure ChromaDB is running
- Train the AI with at least a few documents first
- Check browser console and backend logs for errors

## Environment Variables

Add to `JobPortal-backend/.env`:
```env
CHROMA_URL=http://localhost:8000
```

## Advantages Over C++ Implementation

✅ **No external dependencies** - Runs entirely in Node.js  
✅ **Easy deployment** - No need to compile C++ code  
✅ **Cross-platform** - Works on Windows, Mac, Linux  
✅ **Real-time updates** - Documents are immediately searchable  
✅ **Better integration** - Native JavaScript/Node.js ecosystem  
✅ **Scalable** - ChromaDB can handle millions of documents  

## Production Deployment

For production, consider:
- Use managed ChromaDB service (e.g., Chroma Cloud)
- Deploy ChromaDB as a separate service (Docker)
- Add caching layer for frequently asked questions
- Implement rate limiting on chat endpoint
- Add more sophisticated answer generation (integrate with LLM APIs)

## Example Queries Users Can Ask

- "What's the salary for Software Engineer?"
- "What are the requirements for this position?"
- "Tell me about the company"
- "How do I apply?"
- "What benefits are offered?"
- "Is remote work available?"

The AI will search through all trained documents to find relevant answers!
