import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaBriefcase, FaMapMarkerAlt, FaCalendar, FaEye, FaDownload, FaDollarSign, FaClock, FaFileAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaUserCheck
} from 'react-icons/fa';
import jobService from '../../services/jobService';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch applications on component mount
  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getMyApplications();

      if (response.success && response.data) {
        setApplications(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig = {
    pending: {
      label: 'Under Review',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <FaHourglassHalf className="inline w-3 h-3 mr-1" />
    },
    reviewed: {
      label: 'Reviewed',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <FaEye className="inline w-3 h-3 mr-1" />
    },
    shortlisted: {
      label: 'Shortlisted',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <FaUserCheck className="inline w-3 h-3 mr-1" />
    },
    rejected: {
      label: 'Not Selected',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: <FaTimesCircle className="inline w-3 h-3 mr-1" />
    },
    accepted: {
      label: 'Accepted',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <FaCheckCircle className="inline w-3 h-3 mr-1" />
    }
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

  const filteredApplications =
    selectedStatus === 'all'
      ? applications
      : applications.filter(app => app.status === selectedStatus);

  const getStatusCount = status => {
    return applications.filter(app => app.status === status).length;
  };

  const handleDownloadResume = (resumeUrl, fileName) => {
    window.open(resumeUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      {!isLoading && (
        <div className="bg-white/80 rounded-2xl shadow-lg p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-xl font-medium ${selectedStatus === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              All Applications ({applications.length})
            </button>

            {Object.keys(statusConfig).map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl capitalize font-medium ${selectedStatus === status
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {status} ({getStatusCount(status)})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Applications List */}
      {!isLoading && (
        <div className="space-y-6">
          {filteredApplications.map((application, index) => (
            <div
              key={application._id}
              className="bg-white/80 rounded-3xl shadow-xl p-6 hover:-translate-y-1 transition animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">

                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{application.job?.jobTitle || 'N/A'}</h3>
                      <p className="text-lg text-indigo-600 font-medium">{application.job?.companyName || 'N/A'}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[application.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {statusConfig[application.status]?.icon}
                      {statusConfig[application.status]?.label || application.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span>{application.job?.location || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaDollarSign className="w-4 h-4" />
                      <span>{application.job?.salary || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaBriefcase className="w-4 h-4" />
                      <span>{application.job?.jobType || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCalendar className="w-4 h-4" />
                      <span>Applied {getTimeAgo(application.createdAt)}</span>
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  {application.coverLetter && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaFileAlt className="w-4 h-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900 text-sm">Cover Letter</h4>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{application.coverLetter}</p>
                    </div>
                  )}

                  {/* Resume Info */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaFileAlt className="w-4 h-4" />
                    <span>Resume: {application.resumeOriginalName || 'Resume.pdf'}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 lg:min-w-[200px]">

                  <Link
                    to={`/employee/job-details/${application.job?._id}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <FaEye className="w-4 h-4" />
                    <span>View Job</span>
                  </Link>

                  <button
                    onClick={() => handleDownloadResume(application.resume, application.resumeOriginalName)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>View Resume</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State - Filtered */}
      {!isLoading && filteredApplications.length === 0 && applications.length > 0 && (
        <div className="text-center py-12 bg-white/80 rounded-3xl shadow-xl">
          <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600 mb-6">
            No applications match the selected filter.
          </p>
        </div>
      )}

      {/* Empty State - No Applications */}
      {!isLoading && applications.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-3xl shadow-xl">
          <FaBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't applied to any jobs yet. Start browsing and apply to jobs that interest you!
          </p>

          <Link
            to="/employee/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FaBriefcase className="w-5 h-5" />
            <span>Browse Jobs</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
