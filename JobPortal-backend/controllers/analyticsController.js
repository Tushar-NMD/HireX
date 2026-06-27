const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/user');
const Admin = require('../models/Admin');

// Get admin analytics
const getAdminAnalytics = async (req, res) => {
  try {
    const adminId = req.admin._id;

    // Total jobs posted by this admin
    const totalJobs = await Job.countDocuments({ company: adminId });

    // Active vs inactive jobs
    const activeJobs = await Job.countDocuments({ company: adminId, status: 'active' });
    const inactiveJobs = totalJobs - activeJobs;

    // Total applications received
    const jobs = await Job.find({ company: adminId }).select('_id');
    const jobIds = jobs.map(job => job._id);
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

    // Applications by status
    const pendingApplications = await Application.countDocuments({ 
      job: { $in: jobIds }, 
      status: 'pending' 
    });
    const acceptedApplications = await Application.countDocuments({ 
      job: { $in: jobIds }, 
      status: 'accepted' 
    });
    const rejectedApplications = await Application.countDocuments({ 
      job: { $in: jobIds }, 
      status: 'rejected' 
    });

    // Applications in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentApplications = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Most popular jobs (by application count)
    const popularJobs = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'jobDetails'
        }
      },
      { $unwind: '$jobDetails' },
      {
        $project: {
          jobTitle: '$jobDetails.title',
          applications: '$count',
          location: '$jobDetails.location',
          salary: '$jobDetails.salary'
        }
      }
    ]);

    // Monthly application trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Application.aggregate([
      { 
        $match: { 
          job: { $in: jobIds },
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalJobs,
          activeJobs,
          inactiveJobs,
          totalApplications,
          recentApplications
        },
        applications: {
          pending: pendingApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications
        },
        popularJobs,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get system-wide analytics (super admin)
const getSystemAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Active users (applied in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await Application.distinct('applicant', {
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalJobs,
        totalApplications,
        activeUsers: activeUsers.length
      }
    });
  } catch (error) {
    console.error('Error getting system analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAdminAnalytics,
  getSystemAnalytics
};
