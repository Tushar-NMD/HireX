import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaCalendar, FaBuilding, 
  FaUsers, FaClock, FaHeart, FaShare, FaArrowLeft, FaUser, FaCheckCircle 
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import jobService from '../../services/jobService';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch job details on component mount
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job opportunity at ${job.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
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
        to="/employee/jobs"
        className="inline-flex items-center space-x-2 text-gray-700 hover:text-purple-600 mb-6 transition-colors group"
      >
        <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Jobs</span>
      </Link>

      {/* Job Header Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{job.jobTitle}</h2>
            <div className="flex items-center space-x-2 mb-4">
              <FaBuilding className="w-5 h-5 text-purple-600" />
              <p className="text-xl text-purple-600 font-semibold">{job.companyName}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <FaMapMarkerAlt className="w-5 h-5 text-purple-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaDollarSign className="w-5 h-5 text-green-500" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaBriefcase className="w-5 h-5 text-blue-500" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaClock className="w-5 h-5 text-orange-500" />
                <span>{job.experience} experience</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaCalendar className="w-5 h-5 text-indigo-500" />
                <span>Posted {getTimeAgo(job.createdAt)}</span>
              </div>
              {job.postedBy && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <FaUser className="w-5 h-5 text-pink-500" />
                  <span>By {job.postedBy.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {job.jobType}
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {job.role}
              </span>
              {job.isActive && (
                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium flex items-center space-x-1">
                  <FaCheckCircle className="w-3 h-3" />
                  <span>Active</span>
                </span>
              )}
              {job.skills && job.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 lg:min-w-[200px]">
            <Link
              to={`/employee/apply/${job._id}`}
              className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <FaBriefcase className="w-5 h-5" />
              <span>Apply Now</span>
            </Link>
            
            <div className="flex gap-2">
              <button
                onClick={handleBookmark}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isBookmarked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaHeart className="w-4 h-4" />
                <span className="text-sm">{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105"
              >
                <FaShare className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in animation-delay-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in animation-delay-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in animation-delay-400">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Company Info */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 animate-fade-in animation-delay-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About {job.companyName}</h3>
            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <FaBuilding className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{job.companyName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{job.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaBriefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{job.jobType}</span>
                </div>
                {job.postedBy && (
                  <div className="flex items-center space-x-3">
                    <FaUser className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Posted by {job.postedBy.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-3xl shadow-xl p-6 animate-fade-in animation-delay-700">
            <h3 className="text-lg font-bold mb-2">Job Posted</h3>
            <p className="text-purple-100 text-sm mb-4">
              {formatDate(job.createdAt)}
            </p>
            <p className="text-purple-100 text-xs mb-4">
              {getTimeAgo(job.createdAt)}
            </p>
            <Link
              to={`/employee/apply/${job._id}`}
              className="block w-full py-3 bg-white text-purple-600 rounded-xl text-center font-semibold hover:bg-purple-50 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;