require('dotenv').config();
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log('🔑 Testing Groq API Key...');
console.log('API Key:', GROQ_API_KEY ? `${GROQ_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

async function testGroq() {
  try {
    console.log('\n📤 Sending test request to Groq...');
    
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Say "Hello! I am working!" in one sentence.'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('✅ SUCCESS! Groq API is working!');
    console.log('📦 Response:', response.data.choices[0].message.content);
    console.log('\n✅ Your Groq integration is configured correctly!');
    
  } catch (error) {
    console.error('❌ ERROR! Groq API failed!');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGroq();
