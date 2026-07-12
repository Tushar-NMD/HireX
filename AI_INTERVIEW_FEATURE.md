# AI Video Interview Feature

## Overview
Added an AI-powered video interview feature to the job application process. After resume analysis, employees can take a real-time AI interview where questions are asked based on their resume and job requirements.

## Features Implemented

### 1. **Employee Flow**
- **Step 1**: Upload Resume
- **Step 2**: Paste Resume Text for Analysis
- **Step 3**: View Analysis Results with Option to Take Interview
- **Step 4**: AI Video Interview (NEW!)
  - Camera and microphone access
  - Real-time video display
  - AI asks 10 personalized questions via voice
  - Employee answers via voice (with speech recognition)
  - Can also type answers
  - Progress indicator showing current question
- **Result**: Interview score and feedback displayed
- Application automatically submitted after interview completion

### 2. **AI Interview Components**

#### **Video & Audio**
- Camera feed displays during interview
- Microphone access for voice input
- Text-to-speech for AI asking questions
- Speech recognition for capturing answers
- Recording indicator when microphone is active

#### **Question Generation**
- AI generates exactly 10 questions
- Questions based on:
  - Candidate's resume content
  - Job requirements and skills
  - Matching and missing skills
  - Candidate's experience level
- Mix of behavioral and technical questions

#### **Real-time Interview Process**
1. AI speaks the question (text-to-speech)
2. Employee can either:
   - Click "Start Speaking" to use voice
   - Type directly in the answer box
3. Speech recognition transcribes voice to text
4. Employee reviews and submits answer
5. Moves to next question automatically
6. Progress bar shows completion status

#### **Scoring & Evaluation**
After all 10 questions are answered:
- Overall score (0-100%)
- Detailed feedback paragraph
- List of strengths (3 items)
- List of areas for improvement (3 items)

Scoring criteria:
- Relevance and completeness (40%)
- Technical knowledge (30%)
- Communication clarity (20%)
- Problem-solving approach (10%)

### 3. **Admin View Enhancements**
- Interview scores displayed in job applications list
- Visual score indicator with color coding:
  - **Green (80%+)**: Excellent
  - **Yellow (60-79%)**: Good
  - **Red (<60%)**: Needs Improvement
- Progress bar showing interview performance
- Interview section appears only if candidate completed interview

## Technical Implementation

### Backend

#### **New Files**
1. **`controllers/interviewController.js`**
   - `generateInterviewQuestions`: Creates 10 personalized questions
   - `evaluateAnswer`: Real-time answer evaluation (optional)
   - `submitInterview`: Final scoring and feedback

2. **Updated `models/Application.js`**
   - Added `interview` field with:
     - `completed`: Boolean
     - `score`: Number (0-100)
     - `questions`: Array of Q&A pairs
     - `feedback`: Overall feedback text
     - `strengths`: Array of strengths
     - `improvements`: Array of improvement areas
     - `completedAt`: Date

3. **Updated `routes/applicationRoutes.js`**
   - POST `/applications/:applicationId/interview/questions`
   - POST `/applications/:applicationId/interview/evaluate` (optional)
   - POST `/applications/:applicationId/interview/submit`

### Frontend

#### **New Files**
1. **`components/AIInterview.jsx`**
   - Complete interview UI component
   - Camera and microphone management
   - Speech recognition integration
   - Text-to-speech for questions
   - Real-time transcription
   - Results display

#### **Updated Files**
1. **`pages/employee/ApplyJobWithAI.jsx`**
   - Added Step 4 for AI Interview
   - Interview button after analysis
   - Application submission flow integration
   - State management for interview results

2. **`pages/admin/JobApplications.jsx`**
   - Interview score card display
   - Visual score indicators
   - Conditional rendering based on interview completion

## Browser Compatibility

### Speech Recognition
- Chrome/Edge: Full support
- Firefox: Partial support
- Safari: Limited support
- Fallback: Manual typing available

### Media Devices
- Requires HTTPS (or localhost)
- User permission for camera/microphone
- Error handling for denied permissions

## API Endpoints

### Generate Interview Questions
```
POST /api/applications/:applicationId/interview/questions
Authorization: Bearer <token>
Body: { resumeAnalysis }
Response: { success, data: { questions: [10 questions] } }
```

### Submit Interview
```
POST /api/applications/:applicationId/interview/submit
Authorization: Bearer <token>
Body: { questions: [], answers: [] }
Response: { 
  success, 
  data: { 
    score, 
    feedback, 
    strengths, 
    improvements 
  } 
}
```

## Usage Flow

### Employee Side
1. Upload resume → Paste text → Analyze
2. View match score and analysis results
3. Click "Take Interview" button
4. Grant camera/microphone permissions
5. AI generates 10 personalized questions
6. Answer each question via voice or text
7. Review final score and feedback
8. Application automatically submitted

### Admin Side
1. View job applications list
2. See interview score badge (if completed)
3. Score displayed with color coding
4. Can filter/sort by interview performance
5. Interview data saved with application

## Configuration

### Environment Variables Required
```env
GEMINI_API_KEY=your_gemini_api_key
```

### Dependencies
- `@google/generative-ai`: For AI question generation
- Browser APIs:
  - `navigator.mediaDevices.getUserMedia()`
  - `SpeechRecognition` / `webkitSpeechRecognition`
  - `SpeechSynthesis`

## Benefits

1. **For Employees**
   - Stand out from other applicants
   - Showcase communication skills
   - Get instant feedback
   - Practice interview skills

2. **For Admins**
   - Quickly assess candidate quality
   - Objective scoring system
   - Time-saving initial screening
   - Better candidate comparison

3. **For System**
   - Automated screening process
   - Consistent evaluation criteria
   - Data-driven hiring decisions
   - Scalable interview process

## Future Enhancements
- Video recording playback for admins
- Multi-language support
- Custom question templates per job
- Interview analytics dashboard
- AI feedback on body language (computer vision)
- Interview scheduling system
