import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaCalendar, FaEye, FaEdit, FaTrash, FaUsers, FaClock, FaChartBar, FaCheckCircle, FaTimesCircle, FaSearch, FaFileAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import jobService from '../../services/jobService';
import { FaCheck, FaTimes, FaRegEdit } from 'react-icons/fa';


const statusIcons = {
  active: <FaCheck className="inline w-3 h-3" />,
  inactive: <FaTimes className="inline w-3 h-3" />,
  closed: <FaTimes className="inline w-3 h-3" />,
  draft: <FaRegEdit className="inline w-3 h-3" />
};

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch jobs on component mount
  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getMyJobs();

      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-red-100 text-red-800 border-red-200',
    closed: 'bg-red-100 text-red-800 border-red-200',
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const statusIcons = {
    active: <FaCheckCircle className="inline w-3 h-3 mr-1" />,
    inactive: <FaTimesCircle className="inline w-3 h-3 mr-1" />,
    closed: <FaTimesCircle className="inline w-3 h-3 mr-1" />,
    draft: <FaFileAlt className="inline w-3 h-3 mr-1" />
  };

  const filteredJobs = selectedStatus === 'all'
    ? jobs
    : jobs.filter(job => {
      const jobStatus = job.isActive ? 'active' : 'inactive';
      return jobStatus === selectedStatus;
    });

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(jobId);
        toast.success('Job deleted successfully');
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (error) {
        toast.error(error.message || 'Failed to delete job');
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const isActive = newStatus === 'active';
      await jobService.updateJob(jobId, { isActive });
      toast.success(`Job status updated to ${newStatus}`);
      setJobs(jobs.map(job =>
        job._id === jobId ? { ...job, isActive } : job
      ));
    } catch (error) {
      toast.error(error.message || 'Failed to update job status');
      console.error('Error updating job status:', error);
    }
  };

  const getStatusCount = (status) => {
    if (status === 'active') {
      return jobs.filter(job => job.isActive).length;
    } else if (status === 'inactive') {
      return jobs.filter(job => !job.isActive).length;
    }
    return 0;
  };

  const getTotalApplications = () => {
    // This would need to be fetched from the API
    // For now, return 0 as placeholder
    return 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full mb-4">
          <HiSparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Job Management</span>
        </div> */}
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posted Jobs</h1> */}
        {/* <p className="text-gray-600">Manage and track your job postings</p> */}
      </div>

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center animate-fade-in">
            <div className="flex justify-center mb-2">
              <FaChartBar className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center animate-fade-in animation-delay-100">
            <div className="flex justify-center mb-2">
              <FaCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{getStatusCount('active')}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center animate-fade-in animation-delay-200">
            <div className="flex justify-center mb-2">
              <FaUsers className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{getTotalApplications()}</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center animate-fade-in animation-delay-300">
            <div className="flex justify-center mb-2">
              <FaTimesCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{getStatusCount('inactive')}</div>
            <div className="text-sm text-gray-600">Inactive Jobs</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {!isLoading && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-2 mb-6 animate-fade-in animation-delay-400">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${selectedStatus === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              All Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${selectedStatus === 'active'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Active ({getStatusCount('active')})
            </button>
            <button
              onClick={() => setSelectedStatus('inactive')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${selectedStatus === 'inactive'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Inactive ({getStatusCount('inactive')})
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your jobs...</p>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredJobs.map((job, index) => {
            const jobStatus = job.isActive ? 'active' : 'inactive';
            return (
              <div
                key={job._id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.jobTitle}</h3>
                        <p className="text-lg text-blue-600 font-medium mb-2">{job.companyName}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaDollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaClock className="w-4 h-4" />
                            <span>{job.experience}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaCalendar className="w-4 h-4" />
                            <span>{getTimeAgo(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[jobStatus]}`}>
                        {statusIcons[jobStatus]} {jobStatus.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {job.jobType}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                        {job.role}
                      </span>
                      {job.skills && job.skills.length > 0 && (
                        <>
                          {job.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status Dropdown */}
                    <select
                      value={jobStatus}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/jobs/${job._id}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                      <Link
                        to={`/admin/jobs/${job._id}/edit`}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Job Description Preview */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredJobs.length === 0 && jobs.length > 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="flex justify-center mb-4">
            <FaSearch className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
          <p className="text-gray-600">No jobs match the selected filter.</p>
        </div>
      )}

      {/* No Jobs at All */}
      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="flex justify-center mb-4">
            <FaFileAlt className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Posted Yet</h3>
          <p className="text-gray-600 mb-6">Start by posting your first job opening.</p>
          <Link
            to="/admin/post-job"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FaBriefcase className="w-5 h-5" />
            <span>Post Your First Job</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPostedJobs;