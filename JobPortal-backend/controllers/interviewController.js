const axios = require('axios');
const Application = require('../models/Application');

// Generate dynamic interview questions based on resume
const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeAnalysis, candidateName } = req.body;
    const applicationId = req.params.applicationId;

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const job = application.job;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    const systemPrompt = 'You are an expert interviewer. Generate 5 personalized interview questions based on the candidate resume and job requirements. Return ONLY a JSON array of question strings.';
    
    const userPrompt = 'Job: ' + job.jobTitle + '\nCompany: ' + job.companyName + '\nSkills Required: ' + (job.skills || []).join(', ') + '\n\nCandidate Name: ' + candidateName + '\nResume Summary: ' + (resumeAnalysis.resumeText || '').substring(0, 1000) + '\n\nGenerate 5 personalized interview questions that:\n1. Address the candidate by name\n2. Focus on their experience and skills\n3. Relate to the job requirements\n4. Are conversational and natural\n\nReturn as JSON array: ["question1", "question2", ...]';

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': 'Bearer ' + groqApiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiResponse = JSON.parse(response.data.choices[0].message.content);
    const questions = aiResponse.questions || Object.values(aiResponse)[0] || [];

    res.json({
      success: true,
      questions: questions
    });

  } catch (error) {
    console.error('Question generation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
};

// @desc    Start conversational interview - Get first question
// @route   POST /api/applications/:applicationId/interview/start
// @access  Private (User)
const startConversationalInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { resumeData } = req.body; // Parsed resume structure

    const application = await Application.findById(applicationId)
      .populate('job', 'jobTitle companyName requirements skills description')
      .populate('user', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    const job = application.job;
    const userName = resumeData.name || application.user.name;
    const userRole = resumeData.role || 'candidate';

    const systemPrompt = `You are a Senior Software Engineer conducting a professional technical interview.

CANDIDATE PROFILE:
- Name: ${userName}
- Role: ${userRole}
- Experience: ${resumeData.experience || 'Not specified'}
- Skills: ${resumeData.skills?.join(', ') || 'Not specified'}
- Projects: ${resumeData.projects?.join(', ') || 'Not specified'}

JOB DETAILS:
- Position: ${job.jobTitle}
- Company: ${job.companyName}
- Required Skills: ${job.skills?.join(', ')}
- Requirements: ${job.requirements || job.description}

INTERVIEW RULES:
1. Start by greeting the candidate warmly by name
2. Acknowledge their role and experience from resume
3. Mention the position they're applying for
4. Ask them to introduce themselves briefly
5. Be professional, friendly, and encouraging
6. Keep the introduction concise (2-3 sentences)

Return your greeting and first question.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: 'Start the interview with a greeting and introduction request.'
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    // Initialize interview conversation history
    const conversationHistory = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'assistant',
        content: aiMessage
      }
    ];

    res.json({
      success: true,
      data: {
        question: aiMessage,
        conversationHistory,
        questionNumber: 1,
        totalQuestions: 10
      }
    });

  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      error: error.message
    });
  }
};

// @desc    Get next interview question based on previous answer
// @route   POST /api/applications/:applicationId/interview/next
// @access  Private (User)
const getNextQuestion = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { conversationHistory, answer, questionNumber } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job', 'jobTitle requirements skills');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    // Add user's answer to conversation
    const updatedHistory = [
      ...conversationHistory,
      {
        role: 'user',
        content: answer
      }
    ];

    const totalQuestions = 10;
    const isLastQuestion = questionNumber >= totalQuestions;

    let promptAddition = '';
    if (isLastQuestion) {
      promptAddition = '\n\nThis is the final question. After their answer, provide a complete evaluation with score (0-100), strengths, and areas for improvement.';
    } else {
      promptAddition = `\n\nBased on their answer, ask the next relevant question (${questionNumber + 1}/${totalQuestions}). Adapt difficulty based on their response quality. If they answered well, ask something more challenging. If they struggled, ask a foundational question.`;
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...updatedHistory,
          {
            role: 'system',
            content: promptAddition
          }
        ],
        temperature: 0.7,
        max_tokens: isLastQuestion ? 1000 : 300
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    // Add AI response to history
    const newHistory = [
      ...updatedHistory,
      {
        role: 'assistant',
        content: aiResponse
      }
    ];

    res.json({
      success: true,
      data: {
        question: aiResponse,
        conversationHistory: newHistory,
        questionNumber: questionNumber + 1,
        totalQuestions,
        isComplete: isLastQuestion
      }
    });

  } catch (error) {
    console.error('Next question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get next question',
      error: error.message
    });
  }
};

// @desc    Complete interview and save evaluation
// @route   POST /api/applications/:applicationId/interview/complete
// @access  Private (User)
const completeConversationalInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { conversationHistory, finalAnswer } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    // Get final evaluation
    const evaluationPrompt = `Based on the complete interview conversation, provide a comprehensive evaluation in JSON format:
{
  "score": <number 0-100>,
  "feedback": "<overall performance paragraph>",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"]
}

Scoring criteria:
- Technical knowledge (40%)
- Communication clarity (30%)
- Problem-solving approach (20%)
- Experience relevance (10%)`;

    const fullHistory = [
      ...conversationHistory,
      {
        role: 'user',
        content: finalAnswer
      },
      {
        role: 'system',
        content: evaluationPrompt
      }
    ];

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: fullHistory,
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    const evaluation = JSON.parse(aiResponse);

    // Extract Q&A pairs from conversation
    const questions = [];
    for (let i = 0; i < conversationHistory.length; i++) {
      if (conversationHistory[i].role === 'assistant' && 
          i + 1 < conversationHistory.length && 
          conversationHistory[i + 1].role === 'user') {
        questions.push({
          question: conversationHistory[i].content,
          answer: conversationHistory[i + 1].content,
          timestamp: new Date()
        });
      }
    }

    // Save interview results
    application.interview = {
      completed: true,
      score: Math.round(evaluation.score),
      questions,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || [],
      completedAt: new Date()
    };

    await application.save();

    res.json({
      success: true,
      message: 'Interview completed successfully',
      data: {
        score: application.interview.score,
        feedback: application.interview.feedback,
        strengths: application.interview.strengths,
        improvements: application.interview.improvements
      }
    });

  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete interview',
      error: error.message
    });
  }
};

// @desc    Evaluate interview answer
// @route   POST /api/applications/:applicationId/interview/evaluate
// @access  Private (User)
const evaluateAnswer = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { question, answer } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job', 'jobTitle companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an interview evaluator. Provide brief, constructive feedback on interview answers.'
          },
          {
            role: 'user',
            content: `Job: ${application.job.jobTitle}
Question: ${question}
Answer: ${answer}

Provide 2-3 sentences of evaluation.`
          }
        ],
        temperature: 0.5,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const feedback = response.data.choices[0].message.content;

    res.json({
      success: true,
      data: { feedback }
    });
  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate answer',
      error: error.message
    });
  }
};

// @desc    Submit completed interview
// @route   POST /api/applications/:applicationId/interview/submit
// @access  Private (User)
const submitInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { questions, answers } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job', 'jobTitle companyName requirements skills');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (questions.length !== answers.length || questions.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Must provide exactly 10 questions and answers'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    // Prepare Q&A for evaluation
    const qaText = questions.map((q, i) => 
      `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i]}`
    ).join('\n\n');

    const systemPrompt = `You are an interview evaluator. Analyze the interview and return ONLY valid JSON with this exact structure:
{
  "score": 85,
  "feedback": "Overall feedback paragraph here",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"]
}

Scoring criteria:
- Relevance and completeness (40%)
- Technical knowledge (30%)
- Communication clarity (20%)
- Problem-solving (10%)`;

    const userPrompt = `Job: ${application.job.jobTitle} at ${application.job.companyName}
Requirements: ${application.job.requirements || application.job.description}
Required Skills: ${application.job.skills?.join(', ')}

Interview Q&A:
${qaText}

Evaluate this interview.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    const evaluation = JSON.parse(aiResponse);

    // Save interview data
    application.interview = {
      completed: true,
      score: Math.round(evaluation.score),
      questions: questions.map((q, i) => ({
        question: q,
        answer: answers[i],
        timestamp: new Date()
      })),
      feedback: evaluation.feedback,
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || [],
      completedAt: new Date()
    };

    await application.save();

    res.json({
      success: true,
      message: 'Interview submitted successfully',
      data: {
        score: application.interview.score,
        feedback: application.interview.feedback,
        strengths: application.interview.strengths,
        improvements: application.interview.improvements
      }
    });
  } catch (error) {
    console.error('Submit interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit interview',
      error: error.message
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
  submitInterview,
  startConversationalInterview,
  getNextQuestion,
  completeConversationalInterview
};
