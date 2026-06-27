const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/user');

// Get job recommendations for user
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's applied jobs
    const applications = await Application.find({ applicant: userId });
    const appliedJobIds = applications.map(app => app.job);

    // Get user's skills/interests from profile (if available)
    const userSkills = user.skills || [];
    const userLocation = user.location || '';

    // Find jobs user hasn't applied to
    let query = {
      _id: { $nin: appliedJobIds },
      status: 'active'
    };

    // Match by location if available
    if (userLocation) {
      query.$or = [
        { location: new RegExp(userLocation, 'i') },
        { jobType: 'Remote' }
      ];
    }

    const recommendedJobs = await Job.find(query)
      .populate('company', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Score jobs based on relevance
    const scoredJobs = recommendedJobs.map(job => {
      let score = 0;
      
      // Match skills
      if (userSkills.length > 0) {
        const jobDescription = (job.description + ' ' + job.requirements).toLowerCase();
        userSkills.forEach(skill => {
          if (jobDescription.includes(skill.toLowerCase())) {
            score += 10;
          }
        });
      }

      // Boost recent jobs
      const daysSincePosted = Math.floor((Date.now() - job.createdAt) / (1000 * 60 * 60 * 24));
      if (daysSincePosted < 7) score += 5;
      
      return { ...job.toObject(), relevanceScore: score };
    });

    // Sort by score
    scoredJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      success: true,
      count: scoredJobs.length,
      data: scoredJobs
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getRecommendations
};
