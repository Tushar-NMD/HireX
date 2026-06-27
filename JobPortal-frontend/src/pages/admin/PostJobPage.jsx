import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBuilding, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock, FaFileAlt, FaTags, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import jobService from '../../services/jobService';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    companyName: '',
    jobTitle: '',
    role: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    experience: '',
    description: '',
    requirements: '',
    skills: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare job data
      const jobPayload = {
        companyName: jobData.companyName.trim(),
        jobTitle: jobData.jobTitle.trim(),
        role: jobData.role.trim(),
        location: jobData.location.trim(),
        salary: jobData.salary.trim(),
        jobType: jobData.jobType,
        experience: jobData.experience,
        description: jobData.description.trim(),
        requirements: jobData.requirements ? jobData.requirements.split('\n').filter(req => req.trim()) : [],
        skills: jobData.skills ? jobData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []
      };

      // Call API
      const response = await jobService.postJob(jobPayload);

      if (response.success) {
        toast.success('Job posted successfully! 🎉');

        // Reset form
        setJobData({
          companyName: '',
          jobTitle: '',
          role: '',
          location: '',
          salary: '',
          jobType: 'Full-time',
          experience: '',
          description: '',
          requirements: '',
          skills: ''
        });

        // Redirect to my jobs page after short delay
        setTimeout(() => {
          navigate('/admin/my-jobs');
        }, 1500);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to post job. Please try again.');
      console.error('Error posting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceOptions = [
    '0-1 years',
    '1-3 years',
    '3-5 years',
    '5-8 years',
    '8+ years'
  ];

  const jobTypeOptions = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full mb-4">
          <HiSparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Create New Job</span>
        </div> */}
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Job</h1> */}
        {/* <p className="text-gray-600">Fill in the details to post a new job opening</p> */}
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaBuilding className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={jobData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Job Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaBriefcase className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="jobTitle"
                  value={jobData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role/Department</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaBriefcase className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="role"
                  value={jobData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Engineering, Marketing"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. New York, NY or Remote"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Salary Range</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaDollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g. $80,000 - $120,000"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Job Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaBriefcase className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                >
                  {jobTypeOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Experience Required</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaClock className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  name="experience"
                  value={jobData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="">Select experience level</option>
                  {experienceOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Required Skills</label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <FaTags className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="skills"
                value={jobData.skills}
                onChange={handleInputChange}
                placeholder="e.g. JavaScript, React, Node.js (comma separated)"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="text-xs text-gray-500">Separate skills with commas</p>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Job Requirements</label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <FaCheckCircle className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="requirements"
                value={jobData.requirements}
                onChange={handleInputChange}
                placeholder="Enter each requirement on a new line&#10;• Bachelor's degree in Computer Science&#10;• 3+ years of experience&#10;• Strong communication skills"
                rows={4}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <p className="text-xs text-gray-500">Enter each requirement on a new line</p>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Job Description</label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <FaFileAlt className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleInputChange}
                placeholder="Describe the job responsibilities, requirements, and qualifications..."
                required
                rows={6}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting Job...</span>
                </div>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips Card */}
      <div className="mt-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 animate-fade-in animation-delay-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Tips for a Great Job Post</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Job Title</h4>
            <p>Use clear, specific titles that candidates would search for</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p>Include key responsibilities, requirements, and company culture</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Salary</h4>
            <p>Transparent salary ranges attract more qualified candidates</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Location</h4>
            <p>Specify if remote work is available or required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
