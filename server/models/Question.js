import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: [true, 'Question text is required'] },
  options: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 4;
      },
      message: 'A question must have exactly 4 options'
    },
    required: true
  },
  correctAnswer: { type: String, required: true },
  domain: { type: String, required: true }, // e.g. "Full Stack Development"
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard'], default: 'medium' },
  category: { type: String, trim: true },
  explanation: { type: String },
  marks: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
