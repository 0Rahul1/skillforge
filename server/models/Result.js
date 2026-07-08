import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  domainName: { type: String },

  // Score Data
  totalQuestions: { type: Number },
  attempted: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  skipped: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }, // seconds

  // Per-Question Analysis
  questionAnalysis: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    question: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    difficulty: String,
    category: String,
    timeSpent: Number,
    explanation: String,
  }],

  // Category-wise performance
  categoryScores: [{
    category: String,
    total: Number,
    correct: Number,
    percentage: Number,
  }],

  // Difficulty breakdown
  difficultyBreakdown: {
    easy: { total: Number, correct: Number },
    medium: { total: Number, correct: Number },
    hard: { total: Number, correct: Number },
  },

  // AI Analytics
  integrityScore: { type: Number, default: 100 },
  proctoringReport: {
    tabSwitchCount: { type: Number, default: 0 },
    fullScreenExits: { type: Number, default: 0 },
    faceDetectionAlerts: { type: Number, default: 0 },
    totalViolations: { type: Number, default: 0 },
    audioAlerts: { type: Number, default: 0 },
    recommendation: { type: String, default: 'Clean' },
  },

  // Insights
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: { type: Array, default: [] },
  skillRating: { type: String, enum: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },

  // Badge earned
  badgeEarned: { name: String, icon: String },

  rank: { type: Number },
}, { timestamps: true });

export default mongoose.model('Result', resultSchema);
