import { useState, useEffect } from 'react';
import { HiSparkles, HiDocumentText, HiMail, HiDownload } from 'react-icons/hi';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaVideo, FaTimes, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import jobService from '../../services/jobService';
import authService from '../../services/authService';
import conf from '../../config';

const TopResumes = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [topResumes, setTopResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    meetLink: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    notes: ''
  });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const fetchAdminJobs = async () => {
    try {
      const response = await jobService.getMyJobs();
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (err) {
      toast.error('Failed to load jobs');
      console.error('Error:', err);
    }
  };

  const fetchTopResumes = async (jobId) => {
    setLoading(true);
    setError('');
    try {
      const response = await jobService.api.get(`/admin/top-resumes/${jobId}`);
      
      if (response.success) {
        console.log('Top Resumes Response:', response.data); // Debug log
        setTopResumes(response.data);
      } else {
        setError(response.message || 'Failed to rank resumes');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch top resumes');
      toast.error(err.message || 'Failed to fetch top resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async (resumeUrl, originalName) => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(resumeUrl, '_blank');
      toast.info('Opening resume in new tab');
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    fetchTopResumes(job._id);
  };

  const openScheduleModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowScheduleModal(true);
    
    setScheduleData({
      meetLink: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      notes: ''
    });
  };

  const regenerateMeetLink = () => {
    window.open('https://meet.google.com/new', '_blank');
    toast.info('Create your Google Meet, then paste the link here');
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedCandidate(null);
  };

  const handleScheduleInterview = async () => {
    if (!scheduleData.meetLink || !scheduleData.scheduledDate || !scheduleData.scheduledTime) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate Google Meet link
    if (!scheduleData.meetLink.includes('meet.google.com')) {
      toast.error('Please enter a valid Google Meet link');
      return;
    }

    setScheduling(true);
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${conf.apiBaseUrl}/interviews/${selectedCandidate.applicationId}/schedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(scheduleData)
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Interview scheduled and email sent to candidate!');
        closeScheduleModal();
        // Refresh the resumes to show updated status
        if (selectedJob) {
          fetchTopResumes(selectedJob._id);
        }
      } else {
        toast.error(data.message || 'Failed to schedule interview');
      }
    } catch (error) {
      console.error('Schedule error:', error);
      toast.error('Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-orange-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center space-x-3">
          <HiSparkles className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">AI-Ranked Top Resumes</h1>
            <p className="text-yellow-100 text-sm">Smart resume ranking based on job requirements</p>
          </div>
        </div>
      </div>

      {/* Job Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Select a Job</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <button
              key={job._id}
              onClick={() => handleJobSelect(job)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedJob?._id === job._id
                  ? 'border-yellow-500 bg-yellow-50 shadow-md'
                  : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
              }`}
            >
              <h3 className="font-bold text-gray-900 mb-1">{job.jobTitle}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaBriefcase className="w-3 h-3" />
                {job.role}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaMapMarkerAlt className="w-3 h-3" />
                {job.location}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">AI is analyzing resumes...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && topResumes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top {topResumes.length} Candidates</h2>
              <p className="text-sm text-gray-600">
                Ranked by AI based on job requirements match
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg">
              <HiSparkles className="w-5 h-5" />
              <span className="font-bold">AI Ranked</span>
            </div>
          </div>

          {topResumes.map((resume, index) => (
            <div
              key={resume.applicationId}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                          : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                          : 'bg-gradient-to-br from-blue-400 to-blue-600'
                      }`}
                    >
                      #{index + 1}
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{resume.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreBgColor(resume.matchScore)} ${getScoreColor(resume.matchScore)}`}>
                        {resume.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm flex items-center gap-2 mb-3">
                      <HiMail className="w-4 h-4" />
                      {resume.email}
                    </p>

                    {/* Matching Keywords */}
                    {resume.matchingKeywords.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Matching Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {resume.matchingKeywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                            >
                              ✓ {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Keywords */}
                    {resume.missingKeywords.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Areas for Development:</p>
                        <div className="flex flex-wrap gap-2">
                          {resume.missingKeywords.slice(0, 5).map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => openScheduleModal(resume)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium whitespace-nowrap"
                  >
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Schedule Interview</span>
                  </button>
                  
                  {resume.resumeUrl ? (
                    <button
                      onClick={() => handleDownloadResume(resume.resumeUrl, resume.resumeOriginalName)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap shadow-md hover:shadow-lg"
                    >
                      <HiDownload className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed text-sm font-medium whitespace-nowrap"
                    >
                      <HiDocumentText className="w-4 h-4" />
                      <span>No Resume</span>
                    </button>
                  )}
                  
                  {resume.resumeOriginalName && (
                    <p className="text-xs text-gray-500 text-center truncate max-w-[150px]" title={resume.resumeOriginalName}>
                      {resume.resumeOriginalName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && selectedJob && topResumes.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No applications found for this job yet.</p>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaVideo className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Schedule Interview</h2>
                    <p className="text-purple-100 text-sm">with {selectedCandidate.name}</p>
                  </div>
                </div>
                <button
                  onClick={closeScheduleModal}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Candidate Info */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedCandidate.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCandidate.email}</p>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold text-sm">
                    {selectedCandidate.matchScore}% Match
                  </span>
                </div>
                {selectedJob && (
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Position:</span> {selectedJob.jobTitle}
                  </p>
                )}
              </div>

              {/* Video Meeting Link */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Google Meet Link <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <FaVideo className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                    <input
                      type="url"
                      value={scheduleData.meetLink}
                      onChange={(e) => setScheduleData({ ...scheduleData, meetLink: e.target.value })}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={regenerateMeetLink}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    Create Meet
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                  <span>Click "Create Meet" to open Google Meet in a new tab, then paste the meeting link here</span>
                </p>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Interview Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={scheduleData.scheduledDate}
                      onChange={(e) => setScheduleData({ ...scheduleData, scheduledDate: e.target.value })}
                      min={getTodayDate()}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Interview Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={scheduleData.scheduledTime}
                      onChange={(e) => setScheduleData({ ...scheduleData, scheduledTime: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={scheduleData.duration}
                  onChange={(e) => setScheduleData({ ...scheduleData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                  placeholder="Any special instructions or topics to prepare..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 flex items-start space-x-2">
                  <span className="text-lg">💡</span>
                  <span>
                    Click the <strong>"Create Meet"</strong> button above to open Google Meet in a new tab. Create your meeting, copy the link, and paste it in the field above. An email with the meeting link and all details will be sent to <strong>{selectedCandidate.email}</strong>
                  </span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex space-x-3">
              <button
                onClick={closeScheduleModal}
                disabled={scheduling}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                disabled={scheduling || !scheduleData.meetLink || !scheduleData.scheduledDate || !scheduleData.scheduledTime}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {scheduling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Schedule & Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopResumes;
