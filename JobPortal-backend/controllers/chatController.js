const { askQuestion, addDocuments, deleteAllDocuments, getDocumentCount } = require("../rag/ragService.js");
const Job = require("../models/Job.js");

const chat = async (req, res) => {
  try {
    const { question } = req.body;

    console.log('🔍 NEW DATABASE-ONLY CHAT CONTROLLER - Question received:', question);

    if (!question || question.trim() === '') {
      return res.status(400).json({ 
        error: 'Question is required' 
      });
    }

    // Parse user intent from question
    const lowerQuestion = question.toLowerCase();
    
    // Check if question is about job portal topics
    const offTopicKeywords = [
      'video editing', 'video editor', 'edit video', 'premiere', 'after effects',
      'cooking', 'recipe', 'food', 'cook', 'bake', 'kitchen',
      'movie', 'film', 'entertainment', 'music', 'song', 'album',
      'game', 'gaming', 'play', 'xbox', 'playstation',
      'weather', 'temperature', 'climate', 'forecast',
      'sports', 'football', 'cricket', 'basketball', 'soccer',
      'news', 'politics', 'election', 'government',
      'travel', 'vacation', 'trip', 'hotel', 'flight',
      'shopping', 'buy', 'purchase', 'product', 'amazon',
      'health', 'medicine', 'doctor', 'hospital', 'disease',
      'education', 'school', 'college', 'university', 'course',
      'dating', 'relationship', 'love', 'marriage',
      'religion', 'god', 'prayer', 'church', 'temple'
    ];
    
    // Check if question contains off-topic keywords
    const isOffTopic = offTopicKeywords.some(keyword => lowerQuestion.includes(keyword));
    
    // Also check if question doesn't contain job-related keywords
    const jobRelatedKeywords = [
      'job', 'work', 'career', 'position', 'role', 'hire', 'hiring', 'employment',
      'salary', 'developer', 'engineer', 'manager', 'analyst', 'designer',
      'company', 'apply', 'application', 'resume', 'cv', 'interview',
      'remote', 'office', 'location', 'experience', 'skill'
    ];
    
    const hasJobKeyword = jobRelatedKeywords.some(keyword => lowerQuestion.includes(keyword));
    
    // If off-topic and no job-related keywords, return coming soon
    if (isOffTopic && !hasJobKeyword) {
      return res.json({
        answer: '🚧 Coming Soon!\n\nThis feature is not available yet. I can only help you with job-related queries such as:\n\n• Finding jobs by role (e.g., "data scientist jobs")\n• Searching jobs by location (e.g., "remote jobs")\n• Getting total job count\n• Finding recent job postings\n• Filtering by job type\n\nPlease ask me about available jobs!',
        jobs: [],
        question
      });
    }
    
    // Extract role and location from question
    let searchCriteria = {};
    let responseType = 'general';
    let timeFilter = null;
    
    // Check for recent jobs query
    if (lowerQuestion.includes('recent') || lowerQuestion.includes('latest') || lowerQuestion.includes('new')) {
      responseType = 'recent';
      // Get jobs from last 30 minutes (or adjust as needed)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      timeFilter = { createdAt: { $gte: thirtyMinutesAgo } };
    }
    
    // Check if asking about total jobs
    if (lowerQuestion.includes('total') || lowerQuestion.includes('how many') || 
        lowerQuestion.includes('count') || lowerQuestion.includes('all jobs')) {
      responseType = 'count';
    }
    // Check if asking about specific role or job type
    else if (lowerQuestion.match(/developer|engineer|designer|manager|analyst|intern|frontend|backend|full.?stack|data|marketing|sales|hr|finance|accountant|tester|qa|devops|product|scientist|machine learning|ml|ai|artificial intelligence|python|java|react|node/)) {
      responseType = 'role';
      
      // Find the most specific matching keyword
      let matchedKeyword = null;
      
      // Check for multi-word keywords first (more specific)
      const multiWordKeywords = [
        'data scientist', 'data analyst', 'data engineer',
        'machine learning', 'ml engineer', 'ai engineer', 'artificial intelligence',
        'full stack', 'fullstack', 'front end', 'frontend', 'back end', 'backend',
        'product manager', 'scrum master', 'software engineer', 'software developer',
        'web developer', 'mobile developer', 'android developer', 'ios developer',
        'python developer', 'java developer', 'javascript developer', 
        'react developer', 'node developer', 'angular developer', 'vue developer',
        'quality assurance', 'human resource'
      ];
      
      for (const keyword of multiWordKeywords) {
        if (lowerQuestion.includes(keyword)) {
          matchedKeyword = keyword;
          break;
        }
      }
      
      // If no multi-word match, check single words
      if (!matchedKeyword) {
        const singleWordKeywords = [
          'developer', 'engineer', 'designer', 'manager', 'analyst', 'intern',
          'marketing', 'sales', 'hr', 'finance', 'accountant', 'tester',
          'qa', 'devops', 'architect', 'scientist'
        ];
        
        for (const keyword of singleWordKeywords) {
          if (lowerQuestion.includes(keyword)) {
            matchedKeyword = keyword;
            break;
          }
        }
      }
      
      // Create precise search criteria - only search in role and jobTitle
      if (matchedKeyword) {
        const regexPattern = matchedKeyword.replace(/\s+/g, '.*');
        searchCriteria.$or = [
          { role: { $regex: regexPattern, $options: 'i' } },
          { jobTitle: { $regex: regexPattern, $options: 'i' } }
        ];
      }
    }
    
    // Extract location if mentioned
    const locationKeywords = [
      'remote', 'work from home', 'wfh', 'bangalore', 'bengaluru', 'mumbai', 
      'delhi', 'ncr', 'hyderabad', 'pune', 'chennai', 'kolkata', 'gurgaon', 
      'gurugram', 'noida', 'usa', 'india', 'uk', 'canada', 'singapore', 'dubai',
      'ahmedabad', 'jaipur', 'chandigarh', 'kochi', 'thiruvananthapuram'
    ];
    
    for (const loc of locationKeywords) {
      if (lowerQuestion.includes(loc)) {
        searchCriteria.location = { $regex: loc, $options: 'i' };
        if (responseType !== 'count' && responseType !== 'recent') {
          responseType = 'location';
        }
        break;
      }
    }
    
    // Extract job type if mentioned
    if (lowerQuestion.includes('full-time') || lowerQuestion.includes('full time') || lowerQuestion.includes('fulltime')) {
      searchCriteria.jobType = 'Full-time';
    } else if (lowerQuestion.includes('part-time') || lowerQuestion.includes('part time') || lowerQuestion.includes('parttime')) {
      searchCriteria.jobType = 'Part-time';
    } else if (lowerQuestion.includes('internship') || lowerQuestion.includes('intern')) {
      searchCriteria.jobType = 'Internship';
    } else if (lowerQuestion.includes('contract')) {
      searchCriteria.jobType = 'Contract';
    }
    
    // Only show active jobs
    searchCriteria.isActive = true;
    
    // Add time filter if recent jobs requested
    if (timeFilter) {
      Object.assign(searchCriteria, timeFilter);
    }
    
    // Query database
    const jobs = await Job.find(searchCriteria)
      .populate('postedBy', 'companyName')
      .limit(20)
      .sort({ createdAt: -1 });
    
    // Format response based on what user asked
    let answer = '';
    
    if (responseType === 'count') {
      const totalCount = await Job.countDocuments({ isActive: true });
      
      if (Object.keys(searchCriteria).length > 1) {
        // Specific count with filters
        if (jobs.length > 0) {
          answer = `We found ${jobs.length} active job(s) matching your criteria.`;
        } else {
          answer = `We currently have ${totalCount} total active jobs, but no jobs match your specific criteria at the moment. Coming soon! We will update with relevant openings shortly.`;
        }
      } else {
        // Total count
        answer = `We currently have ${totalCount} active job openings available on our platform.`;
      }
    } else if (responseType === 'recent') {
      if (jobs.length === 0) {
        answer = 'No new jobs posted in the last 30 minutes. Check back soon or browse all available jobs!';
      } else {
        answer = `Found ${jobs.length} job(s) posted recently:\n\n`;
        
        jobs.forEach((job, idx) => {
          const timeAgo = getTimeAgo(job.createdAt);
          answer += `${idx + 1}. ${job.jobTitle} at ${job.companyName}\n`;
          answer += `   📍 Location: ${job.location}\n`;
          answer += `   💼 Type: ${job.jobType}\n`;
          answer += `   💰 Salary: ${job.salary}\n`;
          answer += `   🕐 Posted: ${timeAgo}\n\n`;
        });
        
        answer += 'Visit the Browse Jobs page to view full details and apply!';
      }
    } else if (jobs.length === 0) {
      answer = 'Coming soon! We will update with relevant job openings shortly. Please check back later or try a different search.';
    } else {
      // Format jobs as a list
      const roleInfo = searchCriteria.$or ? ' matching your search' : '';
      const locationInfo = searchCriteria.location ? ` in ${searchCriteria.location.$regex}` : '';
      const typeInfo = searchCriteria.jobType ? ` (${searchCriteria.jobType})` : '';
      
      answer = `Found ${jobs.length} job(s)${roleInfo}${locationInfo}${typeInfo}:\n\n`;
      
      jobs.forEach((job, idx) => {
        answer += `${idx + 1}. ${job.jobTitle} at ${job.companyName}\n`;
        answer += `   📍 Location: ${job.location}\n`;
        answer += `   💼 Type: ${job.jobType}\n`;
        answer += `   💰 Salary: ${job.salary}\n`;
        answer += `   🎯 Experience: ${job.experience}\n\n`;
      });
      
      answer += 'Visit the Browse Jobs page to view full details and apply!';
    }

    res.json({
      answer,
      jobs: jobs.map(job => ({
        id: job._id,
        title: job.jobTitle,
        company: job.companyName,
        location: job.location,
        salary: job.salary,
        type: job.jobType,
        postedAt: job.createdAt
      })),
      question
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ 
      error: err.message || 'Failed to process question'
    });
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const trainRAG = async (req, res) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Documents array is required' 
      });
    }

    // Validate document structure
    for (const doc of documents) {
      if (!doc.text || doc.text.trim() === '') {
        return res.status(400).json({ 
          success: false,
          message: 'Each document must have a text field' 
        });
      }
    }

    const result = await addDocuments(documents);

    res.json({
      success: true,
      message: `Successfully added ${result.count} documents to RAG`,
      count: result.count
    });
  } catch (err) {
    console.error('Train RAG error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to train RAG'
    });
  }
};

const clearRAG = async (req, res) => {
  try {
    await deleteAllDocuments();

    res.json({
      success: true,
      message: 'All documents cleared from RAG'
    });
  } catch (err) {
    console.error('Clear RAG error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to clear RAG'
    });
  }
};

const getRAGStatus = async (req, res) => {
  try {
    const count = await getDocumentCount();

    res.json({
      success: true,
      documentCount: count,
      status: count > 0 ? 'trained' : 'empty'
    });
  } catch (err) {
    console.error('Get RAG status error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to get RAG status'
    });
  }
};

module.exports = {
  chat,
  trainRAG,
  clearRAG,
  getRAGStatus
};