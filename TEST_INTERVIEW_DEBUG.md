# Debug Instructions

## Issue
The interview is "still not working". Need to identify the specific problem.

## Steps to Debug

### 1. Check Browser Console
Open browser DevTools (F12) and check for errors when:
- Clicking "Start Interview" button
- Any step of the interview flow

### 2. Check Network Tab
Look for failed API requests:
- `/applications/parse-resume` - Should return parsed resume data
- `/applications/:id/interview/questions` - Should return 10 questions

### 3. Verify Resume Text
In browser console, after analyzing resume, check:
```javascript
// This should show resume text
console.log(analysis);
// Look for 'resumeText' property
```

### 4. Backend Fix Applied
✅ Added `resumeText` to analysis response:
```javascript
// In resumeAnalysisController.js
res.json({
  success: true,
  data: {
    ...analysisData,
    resumeText // Now included!
  }
})
```

### 5. Test Manually

**Step A: Check if resume text is preserved**
1. Go to Apply Job page
2. Paste resume text
3. Click "Analyze with AI"
4. Open console and type: `console.log(analysis)`
5. Check if `analysis.resumeText` exists

**Step B: Check parse endpoint**
```javascript
// In browser console after login
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/applications/parse-resume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    resumeText: 'Your resume text here...'
  })
})
.then(r => r.json())
.then(d => console.log('Parse result:', d));
```

**Step C: Check questions endpoint**
```javascript
const applicationId = 'your-application-id';
const resumeData = {
  name: "Test Name",
  role: "Developer",
  experience: "2 Years",
  skills: ["React", "Node.js"],
  projects: ["Project 1"]
};

fetch(`http://localhost:5000/api/applications/${applicationId}/interview/questions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ resumeData })
})
.then(r => r.json())
.then(d => console.log('Questions result:', d));
```

## Common Issues & Solutions

### Issue 1: "Resume data not found"
**Cause**: `resumeText` not in analysis object
**Solution**: ✅ Already fixed - backend now returns resumeText

### Issue 2: Parse endpoint fails
**Cause**: Missing GROQ_API_KEY
**Check**: `echo $GROQ_API_KEY` in backend terminal
**Solution**: Add to `.env` file

### Issue 3: Questions endpoint fails
**Cause**: Invalid application ID or missing resume data
**Check**: Console logs should show the request payload

### Issue 4: Camera/Mic not working
**Cause**: Browser permissions
**Solution**: Allow camera/microphone in browser settings

## Quick Fix to Test Without Resume Parse

If you want to test the interview flow immediately, you can bypass parsing:

```javascript
// In AIInterview.jsx, replace startInterview with:
const startInterview = async () => {
  setIsLoading(true);
  
  try {
    // Mock parsed resume data for testing
    const mockResumeData = {
      name: "Test Candidate",
      role: "Software Developer",
      experience: "2 Years",
      skills: ["JavaScript", "React", "Node.js"],
      projects: ["Web Application", "Mobile App"]
    };
    
    setResumeData(mockResumeData);
    
    // Generate questions with mock data
    const token = authService.getToken();
    const response = await fetch(`${conf.apiBaseUrl}/applications/${applicationId}/interview/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ resumeData: mockResumeData })
    });

    const data = await response.json();
    if (data.success && data.data.questions) {
      const greeting = `Hello ${mockResumeData.name}! I can see from your resume that you're a ${mockResumeData.role} with ${mockResumeData.experience} of experience. Let's begin the interview.`;
      const allQuestions = [greeting, ...data.data.questions];
      setQuestions(allQuestions);
      
      const mediaStarted = await startMediaStream();
      if (mediaStarted) {
        setStep('interview');
        setTimeout(() => speakQuestion(greeting), 1000);
        toast.success('Interview started!');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to start: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};
```

## Next Steps

**Please tell me:**
1. What error message do you see?
2. At which step does it fail?
3. What do you see in the browser console?
4. Can you share a screenshot of the error?

This will help me fix the exact issue!
