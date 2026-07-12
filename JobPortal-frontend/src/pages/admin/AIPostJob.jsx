import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiSparkles } from 'react-icons/hi2';
import { FaRobot, FaEdit, FaBolt } from 'react-icons/fa';
import jobService from '../../services/jobService';
import authService from '../../services/authService';
import conf from '../../config';

const AIPostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [jobData, setJobData] = useState({
    companyName: '',
    jobTitle: '',
    role: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    experience: '',
    description: '',
    requirements: [],
    skills: []
  });

  console.log('AIPostJob rendered, step:', step);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setAiLoading(true);
    try {
      const token = authService.getToken(); // Use authService to get token
      
      console.log('Token found:', token ? 'YES' : 'NO');
      console.log('Calling AI parser API...');
      
      const response = await fetch(`${conf.apiBaseUrl}/admin/parse-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await response.json();
      
      console.log('AI Parser Response:', data);

      if (data.success) {
        setJobData(data.data);
        setStep(2);
        toast.success('AI generated job details successfully!');
      } else {
        toast.error(data.message || 'Failed to generate job details');
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      toast.error('Failed to generate job details');
    } finally {
      setAiLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    if (field === 'skills') {
      setJobData(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()).filter(Boolean) }));
    } else if (field === 'requirements') {
      setJobData(prev => ({ ...prev, [field]: value.split('\n').filter(Boolean) }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await jobService.postJob(jobData);
      if (response.success) {
        toast.success('Job posted successfully!');
        navigate('/admin/my-jobs');
      } else {
        toast.error(response.message || 'Failed to post job');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    "Senior Full Stack Developer needed in Bangalore with 5+ years experience in React and Node.js, salary 15-25 LPA",
    "Data Scientist position for ML projects, remote work, 3-5 years experience, competitive salary",
    "Junior Frontend Developer for startup, React and TypeScript skills, 1-2 years experience, Mumbai"
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl mb-6">
        <div className="flex items-center space-x-3">
          <HiSparkles className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">AI-Powered Job Posting</h1>
            <p className="text-purple-100 text-sm">Describe your job, AI does the rest</p>
          </div>
        </div>
      </div>

      {/* Step 1: AI Prompt */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FaRobot className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Describe Your Job Opening</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Simply describe the job you want to post, and AI will automatically fill in all the details for you!
            </p>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: We need a Senior React Developer in Mumbai with 5+ years experience, salary 15-20 LPA, should know TypeScript and Redux..."
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
              rows="6"
            />

            <button
              onClick={handleAIGenerate}
              disabled={aiLoading || !aiPrompt.trim()}
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {aiLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI is generating...</span>
                </>
              ) : (
                <>
                  <FaBolt className="w-5 h-5" />
                  <span>Generate Job Details with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Example Prompts */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">Example Prompts:</h3>
            <div className="space-y-2">
              {examplePrompts.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiPrompt(example)}
                  className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors text-sm text-gray-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Review & Edit */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FaEdit className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Review & Edit Job Details</h2>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to AI Prompt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={jobData.companyName}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={jobData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={jobData.role}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Required</label>
                <input
                  type="text"
                  name="experience"
                  value={jobData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 3-5 years"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements (one per line)</label>
                <textarea
                  value={jobData.requirements.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'requirements')}
                  rows="4"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={jobData.skills.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'skills')}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPostJob;
