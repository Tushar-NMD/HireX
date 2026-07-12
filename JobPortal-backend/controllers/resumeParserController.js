const axios = require('axios');

// @desc    Parse resume text and extract structured data
// @route   POST /api/resume/parse
// @access  Private (User)
const parseResumeText = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    const systemPrompt = `You are a resume parser. Extract structured data from the resume and return ONLY valid JSON with this exact structure:
{
  "name": "Full Name",
  "role": "Job Title/Role",
  "experience": "X Years",
  "skills": ["skill1", "skill2", "skill3"],
  "projects": ["project1", "project2"],
  "education": "Degree/University",
  "summary": "Brief professional summary"
}

Extract accurately from the text provided.`;

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
            content: `Parse this resume:\n\n${resumeText}`
          }
        ],
        temperature: 0.3,
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
    const parsedData = JSON.parse(aiResponse);

    console.log('✅ Resume parsed:', parsedData);

    res.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('❌ Resume parsing error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to parse resume',
      error: error.message
    });
  }
};

module.exports = {
  parseResumeText
};
