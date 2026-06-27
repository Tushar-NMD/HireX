import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaFileUpload, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaArrowLeft, FaPaperPlane, FaCheck, FaTimes, FaBriefcase, FaDollarSign 
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import jobService from '../../services/jobService';
import authService from '../../services/authService';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });

  // Fetch job details and user data on component mount
  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getJobById(id);
      
      if (response.success && response.data) {
        setJob(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch job details');
      console.error('Error fetching job details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setApplicationData({
        ...applicationData,
        resume: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!applicationData.resume) {
      toast.error('Please upload your resume');
      return;
    }

    if (!applicationData.coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await jobService.applyForJob(id, {
        resume: applicationData.resume,
        coverLetter: applicationData.coverLetter.trim()
      });

      if (response.success) {
        toast.success('Application submitted successfully! 🎉');
        
        // Reset form
        setApplicationData({
          coverLetter: '',
          resume: null
        });

        // Redirect to applied jobs page after short delay
        setTimeout(() => {
          navigate('/employee/applied-jobs');
        }, 1500);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit application. Please try again.');
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeResume = () => {
    setApplicationData({
      ...applicationData,
      resume: null
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // No job found
  if (!job) {
    return (
      <div className="text-center py-12">
        <FaBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h3>
        <p className="text-gray-600 mb-6">The job you're trying to apply for doesn't exist.</p>
        <Link
          to="/employee/jobs"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to={`/employee/job-details/${id}`}
        className="inline-flex items-center space-x-2 text-gray-700 hover:text-pink-600 mb-6 transition-colors group"
      >
        <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Job Details</span>
      </Link>

      {/* Job Summary Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-8 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{job.jobTitle}</h2>
        <p className="text-lg text-pink-600 font-medium mb-3">{job.companyName}</p>
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
            <FaBriefcase className="w-4 h-4" />
            <span>{job.jobType}</span>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Resume Upload */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in animation-delay-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Resume Upload</h3>
          
          {!applicationData.resume ? (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-pink-500 transition-colors">
              <div className="mb-4">
                <FaFileUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h4>
                <p className="text-gray-600 mb-4">Drag and drop your resume here, or click to browse</p>
                <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>
              
              <label className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <FaFileUpload className="w-5 h-5" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{applicationData.resume.name}</h4>
                    <p className="text-sm text-gray-600">
                      {(applicationData.resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeResume}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cover Letter */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in animation-delay-400">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Cover Letter</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tell us why you're interested in this position
            </label>
            <textarea
              name="coverLetter"
              value={applicationData.coverLetter}
              onChange={handleInputChange}
              required
              rows={8}
              placeholder="Write your cover letter here... Explain why you're the perfect fit for this role, highlight your relevant experience, and show your enthusiasm for the position."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-sm text-gray-500">
              {applicationData.coverLetter.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in animation-delay-500">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Submit?</h3>
            <p className="text-gray-600 mb-6">
              Please review your application before submitting. You can edit your profile information anytime.
            </p>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Application...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaPaperPlane className="w-5 h-5" />
                  <span>Submit Application</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplyJob;