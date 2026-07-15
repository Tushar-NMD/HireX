# 🚀 AI-Powered Job Portal

A modern, full-stack job portal application with AI-powered features for intelligent resume analysis, job matching, and automated interviews. Built with MERN stack and integrated with Google Gemini AI.

![Job Portal](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20160720.png)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [AI Features](#-ai-features)
- [RAG System Setup](#-rag-system-setup)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Job Seekers (Employees)
- 👤 **User Authentication** - Secure registration and login with JWT
- 🔍 **Browse Jobs** - Search and filter jobs by location, salary, skills
- 📄 **Smart Resume Upload** - Upload resume with automatic parsing
- 🤖 **AI-Powered Job Matching** - Get personalized job recommendations
- 📊 **Resume Analysis** - AI analyzes your resume and provides feedback
- ✍️ **AI-Assisted Application** - Auto-fill application forms from resume
- 🎥 **AI Mock Interviews** - Practice with AI-powered interview simulation
- 📧 **Email Notifications** - Real-time updates on application status
- 📱 **Profile Management** - Update personal info, resume, and photo
- 📈 **Application Tracking** - View all applied jobs and their status
- 💬 **AI Chatbot** - Get instant answers about jobs and company

### For Recruiters (Admins)
- 🎯 **Post Jobs** - Create job postings with detailed requirements
- 🤖 **AI Job Parser** - Auto-generate job descriptions using AI
- 📊 **Analytics Dashboard** - Track applications, views, and hiring metrics
- 👥 **Applicant Management** - View and manage all job applications
- 🏆 **Resume Ranking** - AI ranks applicants by job fit score
- ✅ **Status Updates** - Accept/reject applications with automated emails
- 📅 **Interview Scheduling** - Schedule and manage interviews
- 🧠 **Train AI** - Add company-specific data to improve chatbot
- 📈 **Performance Metrics** - Monitor hiring funnel and conversion rates
- 👨‍💼 **Admin Profile** - Manage account and company information

### AI-Powered Features
- 🧠 **RAG (Retrieval-Augmented Generation)** - Intelligent chatbot with company knowledge
- 🎯 **Smart Resume Ranking** - AI scores and ranks candidates
- 📝 **Resume Parser** - Extract structured data from resumes
- 💡 **Job Recommendations** - ML-based job matching
- 🎤 **AI Interview Simulator** - Practice technical and behavioral questions
- ✍️ **Auto-fill Applications** - Parse resume to fill job applications
- 📊 **Resume Analysis** - Get detailed feedback on your resume

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Lucide React** - Modern icon set
- **React Toastify** - Toast notifications
- **PDF.js & Mammoth.js** - Document parsing

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage for resumes and images
- **Nodemailer** - Email notifications

### AI & ML
- **Google Gemini AI** - Resume analysis, job matching, interviews
- **ChromaDB** - Vector database for RAG system
- **Xenova Transformers** - Embedding generation
- **GROQ API** - Fast AI inference

### DevOps
- **Docker** - Containerization
- **Nginx** - Web server (production)
- **Git & GitHub** - Version control

---

## 📸 Screenshots

### Home Page
![Home](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20160720.png)

### Job Listings
![Browse Jobs](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20160913.png)

### Job Details
![Job Details](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20160922.png)

### AI-Powered Application
![Apply with AI](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20161101.png)

### Employee Dashboard
![Employee Dashboard](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20161302.png)

### Admin Dashboard
![Admin Dashboard](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20161446.png)

### Post Job Page
![Post Job](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20161535.png)

### Resume Ranking
![Resume Ranking](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20161617.png)

### Analytics
![Analytics](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20161705.png)

### AI Chatbot
![Chatbot](JobPortal-frontend/src/assets/Screenshot%202026-07-15%20161745.png)

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │   Jobs   │  │  Apply   │  │ Profile  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ (HTTP/REST API)
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express/Node.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   Jobs   │  │  Apply   │  │  Admin   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
        │                  │                  │
        ↓                  ↓                  ↓
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│   MongoDB   │   │  Cloudinary  │   │  Google AI   │
│  (Database) │   │   (Storage)  │   │   (Gemini)   │
└─────────────┘   └──────────────┘   └──────────────┘
                          │
                          ↓
                  ┌──────────────┐
                  │   ChromaDB   │
                  │  (RAG/Chat)  │
                  └──────────────┘
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Python 3.x (for ChromaDB)
- Git

### Clone Repository
```bash
git clone https://github.com/yourusername/job-portal.git
cd job-portal
```

### Backend Setup
```bash
cd JobPortal-backend
npm install

# Install Python dependencies for RAG
pip install chromadb
```

### Frontend Setup
```bash
cd JobPortal-frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)
Create `JobPortal-backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI APIs
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# RAG System
CHROMA_URL=http://localhost:8000
```

### Frontend (.env)
Create `JobPortal-frontend/.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Development Mode

#### 1. Start ChromaDB (for AI Chatbot)
```bash
cd JobPortal-backend
chroma run --path ./chroma_data --port 8000
# Or use: npm run chroma
```

#### 2. Start Backend Server
```bash
cd JobPortal-backend
npm run dev
# Server runs on http://localhost:5000
```

#### 3. Start Frontend
```bash
cd JobPortal-frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Mode

#### Backend
```bash
cd JobPortal-backend
npm start
```

#### Frontend
```bash
cd JobPortal-frontend
npm run build
npm run preview
```

---

## 📡 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee" // or "admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Jobs

#### Get All Jobs
```http
GET /api/jobs
Query Params: ?search=developer&location=remote&salary=80000
```

#### Get Single Job
```http
GET /api/jobs/:id
```

#### Post Job (Admin)
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "salary": "80000-120000",
  "description": "Job description...",
  "requirements": ["React", "Node.js"],
  "jobType": "Full-time"
}
```

### Applications

#### Apply for Job
```http
POST /api/applications/apply
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "jobId": "job_id_here",
  "resume": <file>,
  "coverLetter": "I am interested..."
}
```

#### Get My Applications
```http
GET /api/applications/my-applications
Authorization: Bearer <token>
```

#### Update Application Status (Admin)
```http
PUT /api/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted" // or "rejected"
}
```

### AI Features

#### Analyze Resume
```http
POST /api/resume/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "resume": <file>
}
```

#### Get Job Recommendations
```http
GET /api/recommendations
Authorization: Bearer <token>
```

#### Rank Resumes (Admin)
```http
POST /api/resumes/rank
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job_id_here"
}
```

#### AI Chatbot
```http
POST /api/chat
Content-Type: application/json

{
  "question": "What is the salary for Software Engineer?"
}
```

#### Train AI (Admin)
```http
POST /api/train
Authorization: Bearer <token>
Content-Type: application/json

{
  "documents": [
    {
      "title": "Company Info",
      "text": "Full content...",
      "category": "general"
    }
  ]
}
```

---

## 📁 Project Structure

```
job-portal/
│
├── JobPortal-frontend/           # React Frontend
│   ├── src/
│   │   ├── assets/               # Images and static files
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   └── AIInterview.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── employee/         # Employee pages
│   │   │   │   ├── BrowseJobs.jsx
│   │   │   │   ├── JobDetails.jsx
│   │   │   │   ├── ApplyJob.jsx
│   │   │   │   ├── ApplyJobWithAI.jsx
│   │   │   │   ├── AppliedJobs.jsx
│   │   │   │   ├── RecommendedJobs.jsx
│   │   │   │   └── EmployeeProfile.jsx
│   │   │   └── admin/            # Admin pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── PostJobPage.jsx
│   │   │       ├── AIPostJob.jsx
│   │   │       ├── MyPostedJobs.jsx
│   │   │       ├── JobApplications.jsx
│   │   │       ├── TopResumes.jsx
│   │   │       ├── Analytics.jsx
│   │   │       ├── TrainAI.jsx
│   │   │       ├── UpdateStatus.jsx
│   │   │       └── AdminProfile.jsx
│   │   ├── layouts/              # Layout components
│   │   ├── services/             # API services
│   │   │   ├── authService.js
│   │   │   └── jobService.js
│   │   ├── hooks/                # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── config/               # Configuration
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── public/                   # Public assets
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── JobPortal-backend/            # Express Backend
│   ├── config/                   # Configuration files
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/              # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── resumeParserController.js
│   │   ├── resumeAnalysisController.js
│   │   ├── resumeRankingController.js
│   │   ├── recommendationController.js
│   │   ├── chatController.js
│   │   ├── interviewController.js
│   │   ├── scheduleInterviewController.js
│   │   ├── analyticsController.js
│   │   └── aiJobParserController.js
│   ├── models/                   # Mongoose models
│   │   ├── user.js
│   │   ├── Admin.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── RAGDocument.js
│   ├── routes/                   # API routes
│   ├── middleware/               # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/                    # Utility functions
│   │   ├── generateToken.js
│   │   └── sendEmail.js
│   ├── rag/                      # RAG system
│   │   └── ragService.js
│   ├── scripts/                  # Setup scripts
│   │   └── initChroma.js
│   ├── uploads/                  # Temporary file storage
│   ├── .env                      # Environment variables
│   ├── server.js                 # Server entry point
│   ├── package.json
│   └── Dockerfile
│
├── README.md                     # This file
└── docker-compose.yml            # Docker orchestration
```

---

## 🤖 AI Features

### 1. Resume Analysis
- Extracts skills, experience, education from resume
- Provides improvement suggestions
- Calculates ATS (Applicant Tracking System) score
- Powered by Google Gemini AI

### 2. Smart Job Recommendations
- Analyzes user profile and resume
- Matches with relevant job postings
- ML-based scoring algorithm
- Considers skills, experience, location preferences

### 3. Resume Ranking
- AI scores each applicant for a job
- Considers job requirements vs candidate skills
- Provides match percentage
- Ranks candidates automatically

### 4. AI Interview Simulator
- Generates technical and behavioral questions
- Real-time feedback on answers
- Practice before actual interviews
- Covers multiple job domains

### 5. Auto-fill Applications
- Parses resume to extract information
- Auto-populates application forms
- Saves time for job seekers
- Supports PDF and DOCX formats

### 6. AI Chatbot (RAG System)
- Answers questions about jobs, company, application process
- Learns from company-specific documents
- Vector-based semantic search
- Contextual and accurate responses

### 7. AI Job Description Generator
- Creates professional job postings from brief input
- Suggests requirements and qualifications
- Optimizes for SEO and ATS
- Saves time for recruiters

---

## 🧠 RAG System Setup

The chatbot uses a **Retrieval-Augmented Generation (RAG)** system for intelligent responses.

### Installation

1. **Install Python** (if not installed)
   ```bash
   # Download from: https://www.python.org/downloads/
   ```

2. **Install ChromaDB**
   ```bash
   pip install chromadb
   ```

3. **Start ChromaDB Server**
   ```bash
   cd JobPortal-backend
   chroma run --path ./chroma_data --port 8000
   ```

### Training the AI

1. Login as Admin
2. Navigate to **Train AI** page
3. Add documents with:
   - **Title**: Brief description
   - **Text**: Full content (job info, company policies, FAQs)
   - **Category**: (optional) engineering, sales, general, etc.
4. Click **"Train AI"**

### Example Training Document
```json
{
  "title": "Software Engineer Salary and Benefits",
  "text": "Software Engineer position offers $80,000-$120,000 annual salary based on experience. Benefits include: health insurance, dental, 401k matching, remote work options, 20 days PTO, learning budget $2000/year.",
  "category": "engineering"
}
```

### How RAG Works

1. Admin trains AI with company-specific documents
2. Documents are converted to vector embeddings
3. Stored in ChromaDB vector database
4. User asks question in chatbot
5. Question is vectorized and similar documents are retrieved
6. AI generates contextual answer from retrieved documents

### Supported Queries
- "What is the salary for Software Engineer?"
- "What benefits do you offer?"
- "How do I apply for a job?"
- "Tell me about the company culture"
- "Is remote work available?"
- "What are the technical requirements?"

---

## 🐳 Deployment

### Docker Deployment

#### Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Docker Build

**Backend:**
```bash
cd JobPortal-backend
docker build -t job-portal-backend .
docker run -p 5000:5000 --env-file .env job-portal-backend
```

**Frontend:**
```bash
cd JobPortal-frontend
docker build -t job-portal-frontend .
docker run -p 80:80 job-portal-frontend
```

### Cloud Deployment

#### Render / Railway / Heroku (Backend)
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy main branch

#### Vercel / Netlify (Frontend)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL`

---

## 🔧 Configuration

### MongoDB Setup
1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `MONGO_URI` in backend `.env`

### Cloudinary Setup
1. Create account on [Cloudinary](https://cloudinary.com/)
2. Get Cloud Name, API Key, API Secret from dashboard
3. Add to backend `.env`

### Email Setup (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate App Password: Google Account → Security → App Passwords
3. Use app password in `EMAIL_PASS` in backend `.env`

### AI API Keys

**GROQ API:**
1. Sign up at [GROQ](https://groq.com/)
2. Get API key from dashboard
3. Add to `GROQ_API_KEY`

**Google Gemini:**
1. Get API key from [Google AI Studio](https://makersuite.google.com/)
2. Add to `GEMINI_API_KEY`

---

## 👥 User Roles

### Employee
- Browse and search jobs
- Apply for jobs with resume
- Get AI-powered recommendations
- Track application status
- Practice AI interviews
- Chat with AI assistant

### Admin
- Post and manage jobs
- View all applications
- AI-powered resume ranking
- Update application status
- Schedule interviews
- View analytics and metrics
- Train AI chatbot

---

## 🧪 Testing

### Backend API Testing
```bash
cd JobPortal-backend
node test-api.js
```

### Frontend Testing
```bash
cd JobPortal-frontend
npm run test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - AI-powered features
- **ChromaDB** - Vector database for RAG
- **Cloudinary** - File storage
- **MongoDB Atlas** - Database hosting
- **Tailwind CSS** - UI styling

---

## 📧 Contact

For questions or support, please contact:
- **Email**: tc151460@gmail.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## 🎯 Roadmap

- [ ] Video interview integration
- [ ] Real-time chat between recruiter and candidate
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with charts
- [ ] Multi-language support
- [ ] Integration with LinkedIn
- [ ] Skill assessment tests
- [ ] Salary negotiation AI assistant
- [ ] Company review system
- [ ] Referral program

---

**⭐ If you like this project, please give it a star!**

Made with ❤️ using MERN Stack + AI
