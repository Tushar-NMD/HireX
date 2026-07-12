const axios = require('axios');
const Job = require('../models/Job');

// Simple text extraction from resume filename and basic analysis
const analyzeResumeMatch = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeText } = req.body; // User will paste resume text or we extract from filename

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    // Prepare job requirements
    const jobRequirements = {
      title: job.jobTitle,
      role: job.role,
      description: job.description,
      requirements: job.requirements || [],
      skills: job.skills || [],
      experience: job.experience
    };

    console.log('🤖 Analyzing resume match for job:', job.jobTitle);

    // Create AI prompt for analysis
    const systemPrompt = `You are a resume analysis expert. Analyze the candidate's resume against job requirements and return ONLY valid JSON with this exact structure:
{
  "matchScore": 85,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "weakAreas": ["area1", "area2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "coverLetter": "Professional cover letter text here"
}

Rules:
- matchScore: 0-100 percentage
- Include 3-7 matching skills
- Include 2-5 missing skills
- Include 2-4 weak areas
- Include 2-4 actionable suggestions
- Generate professional 3-paragraph cover letter`;

    const userPrompt = `Job Requirements:
Title: ${jobRequirements.title}
Role: ${jobRequirements.role}
Experience: ${jobRequirements.experience}
Required Skills: ${jobRequirements.skills.join(', ')}
Requirements: ${jobRequirements.requirements.join(', ')}

Candidate's Resume:
${resumeText}

Analyze match and generate response.`;

    // Call Groq API
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
        max_tokens: 2000,
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

    console.log('✅ AI analysis received');

    const aiResponse = response.data.choices[0].message.content;
    const analysisData = JSON.parse(aiResponse);

    console.log('📊 Match Score:', analysisData.matchScore);

    res.json({
      success: true,
      data: {
        ...analysisData,
        resumeText // Include original resume text
      },
      job: {
        title: job.jobTitle,
        company: job.companyName
      }
    });

  } catch (error) {
    console.error('❌ Resume analysis error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message
    });
  }
};

module.exports = {
  analyzeResumeMatch
};
