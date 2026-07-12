const Job = require('../models/Job');

// @desc    Create new job
// @route   POST /api/admin/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    // Handle case where req.body might be undefined due to multer
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing. Make sure to use form-data in Postman.'
      });
    }
    
    const {
      companyName,
      jobTitle,
      role,
      location,
      salary,
      jobType,
      experience,
      description,
      requirements,
      skills
    } = req.body;

    // Validation
    if (!companyName || !jobTitle || !role || !location || !salary || !experience || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        received: {
          companyName: !!companyName,
          jobTitle: !!jobTitle,
          role: !!role,
          location: !!location,
          salary: !!salary,
          experience: !!experience,
          description: !!description
        }
      });
    }

    // Create job
    const job = await Job.create({
      companyName,
      jobTitle,
      role,
      location,
      salary,
      jobType,
      experience,
      description,
      requirements: requirements || [],
      skills: skills || [],
      companyLogo: req.file ? req.file.path : null,
      postedBy: req.admin.id
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getMyJobs = async(req, res) => {
  try{
    const jobs = await Job.find({ postedBy: req.admin.id })
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
};

const getAllJobsForUsers = async (req, res) => {
  try {
    const Application = require('../models/Application');
    
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    // Add application count to each job
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicationCount
        };
      })
    );

    res.json({
      success: true,
      count: jobsWithCount.length,
      data: jobsWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getSingleJob = async (req, res) => {
  try {
    const Application = require('../models/Application');
    
    const job = await Job.findById(req.params.id)
    .populate('postedBy', 'name email');

    if(!job)
    {
       return res.status(400).json({
        success: false,
        message: 'Job not found'
       });
    }

    if(!job.isActive){
         return res.status(401).json({
          success: false,
          message: 'Job is no longer active'
         });
    }

    // Add application count
    const applicationCount = await Application.countDocuments({ job: job._id });

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        applicationCount
      }
    });
  } catch (error) {
    if(error.kind === 'objectId'){
      return res.status(400).json({
        success: false,
        message: 'Invalid Job ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/admin/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if admin owns this job
    if (job.postedBy.toString() !== req.admin.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if admin owns this job
    if (job.postedBy.toString() !== req.admin.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getMyJobs,
  getAllJobsForUsers,
  getSingleJob,
  updateJob,
  deleteJob
};
