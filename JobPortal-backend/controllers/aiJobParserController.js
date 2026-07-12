const axios = require('axios');

const parseJobFromPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const adminId = req.admin._id;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    console.log('🤖 Parsing job from prompt:', prompt);

    // Create AI prompt for structured extraction
    const systemPrompt = `You are a job posting assistant. Extract job details from the user's description and return ONLY a valid JSON object with these exact fields:
{
  "companyName": "string",
  "jobTitle": "string",
  "role": "string",
  "location": "string",
  "salary": "string",
  "jobType": "Full-time" | "Part-time" | "Contract" | "Internship",
  "experience": "string",
  "description": "string",
  "requirements": ["string array"],
  "skills": ["string array"]
}

Rules:
- Return ONLY valid JSON, no markdown, no explanations
- If location not specified, use "Remote"
- If salary not specified, use "Competitive"
- If jobType not specified, use "Full-time"
- Extract 3-5 requirements as array
- Extract 3-7 skills as array
- Make description professional and detailed (2-3 paragraphs)`;

    const userPrompt = `Extract job details from this: "${prompt}"`;

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
        temperature: 0.3,
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

    console.log('✅ AI response received');

    const aiResponse = response.data.choices[0].message.content;
    const jobData = JSON.parse(aiResponse);

    // Add postedBy field
    jobData.postedBy = adminId;
    jobData.isActive = true;

    console.log('📋 Parsed job data:', jobData);

    res.json({
      success: true,
      data: jobData,
      message: 'Job details extracted successfully'
    });

  } catch (error) {
    console.error('❌ AI Job Parser error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to parse job details',
      error: error.message
    });
  }
};

module.exports = {
  parseJobFromPrompt
};
