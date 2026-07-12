const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/user');

// Extract keywords from text (simple keyword extraction)
const extractKeywords = (text) => {
  if (!text) return [];
  
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'is', 'was', 'are'
  ]);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  return [...new Set(words)];
};

// Calculate match score between job and resume
const calculateMatchScore = (jobKeywords, resumeKeywords) => {
  if (jobKeywords.length === 0) return 0;
  
  const matchingKeywords = jobKeywords.filter(keyword => 
    resumeKeywords.some(rk => rk.includes(keyword) || keyword.includes(rk))
  );
  
  return Math.round((matchingKeywords.length / jobKeywords.length) * 100);
};

// Get matching and missing keywords
const getKeywordAnalysis = (jobKeywords, resumeKeywords) => {
  const matching = [];
  const missing = [];
  
  jobKeywords.forEach(keyword => {
    const found = resumeKeywords.some(rk => 
      rk.includes(keyword) || keyword.includes(rk)
    );
    
    if (found) {
      matching.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  return { matching, missing };
};

// Determine top N based on total applications
const getTopN = (totalApplications) => {
  if (totalApplications <= 10) return 5;
  if (totalApplications <= 50) return 8;
  if (totalApplications <= 100) return 10;
  if (totalApplications <= 500) return 12;
  return 15; // For 1000+ applications
};

const getTopResumesForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const adminId = req.admin._id;

    // Verify job belongs to this admin
    const job = await Job.findOne({ _id: jobId, postedBy: adminId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    // Get all applications for this job
    const applications = await Application.find({ job: jobId })
      .populate('user', 'name email')
      .lean();

    if (applications.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No applications yet'
      });
    }

    // Analyze each resume - prioritize saved analysis data
    const rankedResumes = applications.map(application => {
      let matchScore = 0;
      let matchingKeywords = [];
      let missingKeywords = [];

      // Use saved resume analysis if available
      if (application.resumeAnalysis && application.resumeAnalysis.matchScore > 0) {
        matchScore = application.resumeAnalysis.matchScore;
        matchingKeywords = application.resumeAnalysis.matchingSkills || [];
        missingKeywords = application.resumeAnalysis.missingSkills || [];
      } else {
        // Fallback to keyword extraction if no analysis saved
        const jobText = [
          job.role,
          job.jobTitle,
          job.description,
          ...(job.skills || []),
          ...(job.requirements || [])
        ].join(' ');
        
        const jobKeywords = extractKeywords(jobText);
        
        const resumeText = [
          application.resumeOriginalName || '',
          application.coverLetter || ''
        ].join(' ');
        
        const resumeKeywords = extractKeywords(resumeText);
        matchScore = calculateMatchScore(jobKeywords, resumeKeywords);
        
        const { matching, missing } = getKeywordAnalysis(jobKeywords, resumeKeywords);
        matchingKeywords = matching;
        missingKeywords = missing;
      }
      
      return {
        applicationId: application._id,
        name: application.user.name,
        email: application.user.email,
        resumeUrl: application.resume,
        resumeOriginalName: application.resumeOriginalName,
        matchScore,
        matchingKeywords,
        missingKeywords,
        appliedAt: application.createdAt
      };
    });

    // Sort by match score (descending)
    rankedResumes.sort((a, b) => b.matchScore - a.matchScore);

    // Get top N based on total applications
    const topN = getTopN(applications.length);
    const topResumes = rankedResumes.slice(0, topN);

    res.json({
      success: true,
      data: topResumes,
      totalApplications: applications.length,
      showingTop: topN
    });

  } catch (error) {
    console.error('Error ranking resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rank resumes',
      error: error.message
    });
  }
};

module.exports = {
  getTopResumesForJob
};
