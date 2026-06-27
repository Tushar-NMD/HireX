import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaCalendar, FaEye, FaHeart, FaSearch, FaFilter, FaClock, FaBuilding, FaUser } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import jobService from '../../services/jobService';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getAllJobs();
      
      if (response.success && response.data) {
        // Add isBookmarked property to each job
        const jobsWithBookmark = response.data.map(job => ({
          ...job,
          isBookmarked: false
        }));
        setJobs(jobsWithBookmark);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = (jobId) => {
    setJobs(jobs.map(job => 
      job._id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.jobType === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

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
        <div className="">
          {/* <HiSparkles className="w-4 h-4" /> */}
          {/* <span className="text-sm font-medium">Job Search</span> */}
        </div>
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
        <p className="text-gray-600">Discover amazing job opportunities from top companies</p> */}
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-8 animate-fade-in">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaFilter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4">
         
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        {/* <p className="text-gray-600">
          Found <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
        </p> */}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {!isLoading && (
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <div
              key={job._id}
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.jobTitle}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <FaBuilding className="w-4 h-4 text-purple-600" />
                        <p className="text-lg text-purple-600 font-medium">{job.companyName}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
                      {/* Posted By */}
                      {job.postedBy && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                          <FaUser className="w-3 h-3" />
                          <span>Posted by {job.postedBy.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bookmark Button */}
                    <button
                      onClick={() => handleBookmark(job._id)}
                      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                        job.isBookmarked
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaHeart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                  {/* Skills & Requirements */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Job Type */}
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {job.jobType}
                      </span>
                      {/* Role */}
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {job.role}
                      </span>
                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <>
                          {job.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 lg:ml-6">
                  <Link
                    to={`/employee/job-details/${job._id}`}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <FaEye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                  <Link
                    to={`/employee/apply/${job._id}`}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <FaBriefcase className="w-4 h-4" />
                    <span>Apply Now</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredJobs.length === 0 && jobs.length > 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl">
          <FaSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria to find more jobs.</p>
        </div>
      )}

      {/* No Jobs at All */}
      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl">
          <FaBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Available</h3>
          <p className="text-gray-600">Check back later for new job opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;