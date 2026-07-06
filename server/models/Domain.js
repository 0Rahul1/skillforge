import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🧠' },
  color: { type: String, default: '#6366f1' },
  gradient: { type: String, default: 'from-indigo-500 to-violet-600' },
  questionCount: { type: Number, default: 0 },
  avgDuration: { type: Number, default: 30 }, // minutes
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
  topics: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Domain', domainSchema);
