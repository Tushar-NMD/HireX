import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEye, FaEdit, FaFileAlt, FaDownload, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUserCheck, FaInbox } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { X } from 'lucide-react';
import jobService from '../../services/jobService';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getAllApplications();
      
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

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
    shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    accepted: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusIcons = {
    pending: <FaHourglassHalf className="inline w-3 h-3 mr-1" />,
    reviewed: <FaEye className="inline w-3 h-3 mr-1" />,
    shortlisted: <FaUserCheck className="inline w-3 h-3 mr-1" />,
    rejected: <FaTimesCircle className="inline w-3 h-3 mr-1" />,
    accepted: <FaCheckCircle className="inline w-3 h-3 mr-1" />
  };

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await jobService.updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application status updated to ${newStatus}`);
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      toast.error(error.message || 'Failed to update application status');
      console.error('Error updating application status:', error);
    }
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
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

  const handleViewResume = (resumeUrl, fileName) => {
    setSelectedResume({ url: resumeUrl, name: fileName });
    setShowResumeModal(true);
  };

  const handleDirectDownload = async (resumeUrl, fileName) => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resume');
      console.error('Error downloading resume:', error);
    }
  };

  const closeResumeModal = () => {
    setShowResumeModal(false);
    setSelectedResume(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-red-600 text-white px-4 py-2 rounded-full mb-4">
          <HiSparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Application Management</span>
        </div> */}
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1> */}
        {/* <p className="text-gray-600">Review and manage job applications from candidates</p> */}
      </div>

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center animate-fade-in">
            <div className="flex justify-center mb-2">
              <FaHourglassHalf className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('pending')}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center animate-fade-in animation-delay-100">
            <div className="flex justify-center mb-2">
              <FaEye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('reviewed')}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center animate-fade-in animation-delay-200">
            <div className="flex justify-center mb-2">
              <FaUserCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('shortlisted')}</div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center animate-fade-in animation-delay-300">
            <div className="flex justify-center mb-2">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('accepted')}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center animate-fade-in animation-delay-400">
            <div className="flex justify-center mb-2">
              <FaTimesCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('rejected')}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-2 mb-6 animate-fade-in animation-delay-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              selectedStatus === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Applications ({applications.length})
          </button>
          {Object.keys(statusColors).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status} ({getStatusCount(status)})
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      )}

      {/* Applications List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <div
              key={application._id}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <FaUser className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{application.user?.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-600">{application.user?.email || 'No email'}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[application.status]}`}>
                    {statusIcons[application.status]} {application.status.toUpperCase()}
                  </div>
                </div>

                {/* Job Info Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <FaBriefcase className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Applied For</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-lg font-bold text-blue-600 mb-1">{application.job?.jobTitle || 'N/A'}</p>
                      <p className="text-gray-700 font-medium">{application.job?.companyName || 'N/A'}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        <span>{application.job?.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaDollarSign className="w-4 h-4" />
                        <span>{application.job?.salary || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock className="w-4 h-4" />
                        <span>{application.job?.jobType || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaFileAlt className="w-4 h-4 text-blue-600" />
                        <h5 className="font-semibold text-gray-900">Cover Letter</h5>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3">{application.coverLetter}</p>
                    </div>
                  )}

                  {/* Resume */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaFileAlt className="w-4 h-4 text-green-600" />
                      <h5 className="font-semibold text-gray-900">Resume</h5>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-700 truncate">{application.resumeOriginalName || 'Resume.pdf'}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewResume(application.resume, application.resumeOriginalName)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <FaEye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDirectDownload(application.resume, application.resumeOriginalName)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <FaDownload className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaCalendar className="w-4 h-4" />
                    <span>Applied {getTimeAgo(application.createdAt)}</span>
                    <span className="text-gray-400">•</span>
                    <span>{formatDate(application.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application._id, e.target.value)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>

                    {/* View Details Button */}
                    <Link
                      to={`/admin/applications/${application._id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <FaEye className="w-4 h-4" />
                      <span className="hidden sm:inline">Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredApplications.length === 0 && applications.length > 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="flex justify-center mb-4">
            <FaInbox className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600">No applications match the selected filter.</p>
        </div>
      )}

      {/* No Applications at All */}
      {!isLoading && applications.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="flex justify-center mb-4">
            <FaInbox className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">You haven't received any job applications yet.</p>
          <Link
            to="/admin/my-jobs"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FaBriefcase className="w-5 h-5" />
            <span>View My Jobs</span>
          </Link>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FaFileAlt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Resume Viewer</h3>
                  <p className="text-sm text-gray-600">{selectedResume.name || 'Resume.pdf'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDirectDownload(selectedResume.url, selectedResume.name)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaDownload className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={closeResumeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Body - Resume Viewer */}
            <div className="flex-1 overflow-hidden p-4 bg-gray-50">
              <div className="w-full h-full bg-white rounded-lg shadow-inner overflow-hidden">
                <iframe
                  src={selectedResume.url}
                  className="w-full h-full"
                  title="Resume Viewer"
                  style={{ minHeight: '600px' }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Tip: Use the download button to save this resume to your computer
                </p>
                <button
                  onClick={closeResumeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;