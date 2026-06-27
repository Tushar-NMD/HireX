# 🚀 Quick Start - JavaScript RAG System

Your Job Portal now has a **pure JavaScript RAG system** - no more C++ dependencies!

## ✅ What's Fixed

1. ✅ **Token Storage** - Fixed localStorage token persistence
2. ✅ **ChatBot Visibility** - Now only shows for employees (not admins)
3. ✅ **RAG in JavaScript** - Replaced C++ with native Node.js implementation

## 🎯 Quick Setup (3 Steps)

### Step 1: Install ChromaDB
```bash
pip install chromadb
```

### Step 2: Start ChromaDB (Keep this running)
```bash
cd JobPortal-backend
npm run chroma
```

Should show: `Running Chroma on http://localhost:8000`

### Step 3: Start Your Servers
```bash
# Terminal 1 - Backend
cd JobPortal-backend
npm run dev

# Terminal 2 - Frontend  
cd JobPortal-frontend
npm run dev
```

## 🎓 Train the AI

1. Login as **Admin**
2. Go to **Train AI** page
3. Add documents:
   - Title: "Software Engineer Job"
   - Text: "Looking for React developer with 3+ years. Salary: $80k-$120k..."
4. Click **🚀 Train AI**

## 💬 Test the ChatBot

1. Logout and login as **Employee** (or regular user)
2. You'll see the AI chatbot in bottom-right
3. Ask: "What's the salary?" or "Tell me about jobs"

## 📊 Features

### For Admins:
- ✨ Train AI with job information
- 📝 Add multiple documents at once
- 🗑️ Clear all training data
- 📊 View document count status

### For Employees:
- 💬 AI chatbot assistant
- ❓ Ask about jobs, salaries, requirements
- 🔍 Get instant answers from trained data
- 📚 View source documents

### For Guests:
- ❌ No chatbot shown (only for logged-in employees)

## 🔧 Tech Stack

- **ChromaDB** - Vector database
- **Xenova Transformers** - AI embeddings (all-MiniLM-L6-v2)
- **Express.js** - Backend API
- **React** - Frontend

## 📖 Full Documentation

See `JobPortal-backend/RAG_SETUP.md` for detailed documentation.

## ❓ Troubleshooting

### ChatBot not showing?
- Make sure you're logged in as **employee** (not admin)
- Check browser console for errors

### Can't train AI?
- Make sure ChromaDB is running (`npm run chroma`)
- Check you're logged in as admin

### "ChromaDB not responding"?
```bash
# Check if running on port 8000
netstat -ano | findstr :8000

# Restart ChromaDB
cd JobPortal-backend
npm run chroma
```

---

**That's it!** Your RAG system is now running entirely in JavaScript 🎉
