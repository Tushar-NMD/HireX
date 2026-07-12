import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaFileUpload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import jobService from '../../services/jobService';
import authService from '../../services/authService';
import conf from '../../config';

const ApplyJobWithAI = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [step, setStep] = useState(1); // 1: Upload, 2: Analysis, 3: Review
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setResumeFile(file);
      // Automatically extract text and analyze
      await extractTextAndAnalyze(file);
    }
  };

  const extractTextAndAnalyze = async (file) => {
    setAnalyzing(true);
    try {
      let extractedText = '';
      const fileType = file.name.split('.').pop().toLowerCase();

      if (fileType === 'pdf') {
        // Use PDF.js for PDF extraction
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          extractedText += pageText + '\n';
        }
      } else if (fileType === 'docx' || fileType === 'doc') {
        // Use mammoth for DOCX extraction
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else {
        toast.error('Please upload PDF or DOCX file');
        setAnalyzing(false);
        return;
      }

      if (!extractedText.trim()) {
        toast.error('Could not extract text from file. Please ensure the file is not empty or corrupted.');
        setAnalyzing(false);
        return;
      }

      setResumeText(extractedText);

      // Now analyze it against the job
      await analyzeResumeWithText(extractedText);

    } catch (error) {
      console.error('Text extraction error:', error);
      toast.error('Failed to extract text from file. Please try uploading a different file.');
      setAnalyzing(false);
    }
  };

  const analyzeResumeWithText = async (text) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${conf.apiBaseUrl}/applications/analyze-resume/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resumeText: text })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setCoverLetter(data.data.coverLetter);
        setStep(3);
        toast.success('Resume analyzed successfully!');
      } else {
        toast.error(data.message || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume text');
      return;
    }

    setAnalyzing(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${conf.apiBaseUrl}/applications/analyze-resume/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resumeText })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setCoverLetter(data.data.coverLetter);
        setStep(3);
        toast.success('Resume analyzed successfully!');
      } else {
        toast.error(data.message || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleProceedToSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      
      // Add resume analysis data
      if (analysis) {
        formData.append('resumeAnalysis', JSON.stringify({
          matchScore: analysis.matchScore,
          matchingSkills: analysis.matchingSkills || [],
          missingSkills: analysis.missingSkills || [],
          weakAreas: analysis.weakAreas || [],
          suggestions: analysis.suggestions || []
        }));
      }

      const response = await jobService.applyForJob(id, formData);

      if (response.success) {
        toast.success('Application submitted successfully!');
        navigate('/employee/applied-jobs');
      } else {
        toast.error(response.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Job not found</p>
      </div>
    );
  }

  console.log('🎯 Rendering ApplyJobWithAI - Step:', step, 'Analysis:', !!analysis);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl mb-6">
        <h1 className="text-2xl font-bold mb-2">{job?.jobTitle}</h1>
        <p className="text-blue-100">{job?.companyName} • {job?.location}</p>
      </div>

      {/* Step 1: Upload Resume */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Step 1: Upload Your Resume</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
            <FaFileUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
              disabled={analyzing}
            />
            <label
              htmlFor="resume-upload"
              className={`cursor-pointer text-blue-600 hover:text-blue-700 font-semibold ${analyzing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Click to upload resume
            </label>
            <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
            {resumeFile && (
              <p className="mt-4 text-green-600 font-medium">✓ {resumeFile.name}</p>
            )}
            {analyzing && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-purple-600">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing your resume...</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 text-center">
            Upload your resume and we'll automatically analyze it against the job requirements
          </p>
        </div>
      )}

      {/* Step 2: Paste Resume Text for Analysis */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Step 2: Paste Resume Text for AI Analysis</h2>
          
          <p className="text-gray-600 mb-4">
            Resume uploaded: <span className="font-semibold text-green-600">{resumeFile?.name}</span>
          </p>
          <p className="text-gray-600 mb-4">
            Please paste your resume text below so we can analyze it against the job requirements.
          </p>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here (skills, experience, education, etc.)..."
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
            rows="10"
          />

          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleAnalyzeResume}
              disabled={analyzing || !resumeText.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <HiSparkles className="w-5 h-5" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Show Analysis & Review */}
      {step === 3 && analysis && (
        <div className="space-y-6">
          {/* Match Score */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Resume Match Score</h2>
            <div className="flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full ${getScoreBg(analysis.matchScore)} flex items-center justify-center`}>
                <span className={`text-4xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                  {analysis.matchScore}%
                </span>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-4">
              {analysis.matchScore >= 80 ? 'Excellent match!' : analysis.matchScore >= 60 ? 'Good match' : 'Fair match - consider improvements'}
            </p>
          </div>

          {/* Matching Skills */}
          {analysis.matchingSkills?.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaCheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold">Matching Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.matchingSkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {analysis.missingSkills?.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaExclamationTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weak Areas & Suggestions */}
          {analysis.weakAreas?.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Areas for Improvement</h3>
              <ul className="space-y-2">
                {analysis.weakAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Suggestions</h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Auto-Generated Cover Letter */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">AI-Generated Cover Letter</h3>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
              rows="8"
            />
            <p className="text-sm text-gray-500 mt-2">You can edit the cover letter before submitting</p>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
              >
                Re-analyze
              </button>
              <button
                onClick={handleProceedToSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-5 h-5" />
                    <span>Submit Application</span>
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

export default ApplyJobWithAI;
