import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaVideo, FaPlay, FaStop } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import authService from '../services/authService';
import conf from '../config';

const AIInterview = ({ applicationId, resumeAnalysis, onComplete, onSkip }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [videoBlob, setVideoBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    generateQuestions();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const generateQuestions = () => {
    const defaultQuestions = [
      "Tell me about yourself and your background.",
      "What interests you most about this position?",
      "Describe a challenging project you've worked on.",
      "What are your key strengths?",
      "Where do you see yourself in 5 years?"
    ];
    setQuestions(defaultQuestions);
  };

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setAnswers([...answers, { question: questions[currentQuestion], video: blob }]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      toast.error('Failed to access camera or microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setVideoBlob(null);
    } else {
      submitInterview();
    }
  };

  const submitInterview = async () => {
    setIsSubmitting(true);
    try {
      const token = authService.getToken();
      const formData = new FormData();
      
      answers.forEach((answer, index) => {
        formData.append(`video_${index}`, answer.video);
      });

      const response = await fetch(`${conf.apiBaseUrl}/interviews/submit/${applicationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Interview submitted successfully!');
        onComplete(data.data);
      } else {
        toast.error(data.message || 'Failed to submit interview');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <HiSparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">AI Video Interview</h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip Interview
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
        <p className="text-lg font-semibold text-gray-800">
          {questions[currentQuestion]}
        </p>
      </div>

      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ height: '400px' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        {!stream && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <FaVideo className="w-16 h-16 text-gray-600" />
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        {!isRecording && !videoBlob && (
          <button
            onClick={startRecording}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <FaPlay className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg flex items-center justify-center space-x-2 animate-pulse"
          >
            <FaStop className="w-5 h-5" />
            <span>Stop Recording</span>
          </button>
        )}

        {videoBlob && (
          <>
            <button
              onClick={() => setVideoBlob(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
            >
              Re-record
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : isSubmitting ? 'Submitting...' : 'Submit Interview'}
            </button>
          </>
        )}
      </div>

      <p className="text-sm text-gray-500 text-center mt-4">
        Answer the question naturally. Take your time and speak clearly.
      </p>
    </div>
  );
};

export default AIInterview;
