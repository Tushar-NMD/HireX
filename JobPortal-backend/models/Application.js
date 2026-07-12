const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: String,
    required: [true, 'Please upload resume']
  },
  resumeOriginalName: {
    type: String,
    default: ''
  },
  coverLetter: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending'
  },
  interview: {
    completed: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    questions: [{
      question: String,
      answer: String,
      timestamp: Date
    }],
    feedback: {
      type: String,
      default: ''
    },
    strengths: [String],
    improvements: [String],
    completedAt: Date
  },
  resumeAnalysis: {
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    matchingSkills: [String],
    missingSkills: [String],
    weakAreas: [String],
    suggestions: [String],
    analyzedAt: Date
  },
  scheduledInterview: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    meetLink: {
      type: String,
      default: ''
    },
    scheduledDate: {
      type: Date
    },
    scheduledTime: {
      type: String
    },
    duration: {
      type: Number,
      default: 60
    },
    notes: {
      type: String,
      default: ''
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    scheduledAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
