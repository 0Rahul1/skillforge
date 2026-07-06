import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: { type: String, default: null },  // stores full option text, not A/B/C/D
    isMarkedForReview: { type: Boolean, default: false },
    timeSpent: { type: Number, default: 0 }, // seconds
  }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number, default: 30 }, // minutes allowed
  status: { type: String, enum: ['active', 'submitted', 'terminated', 'timed_out'], default: 'active' },
  proctoringSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProctoringLog' },
  autoSubmitReason: { type: String },
}, { timestamps: true });

export default mongoose.model('Assessment', assessmentSchema);
