import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Info
  fullName: { type: String, required: [true, 'Full name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Profile Info
  phone: { type: String, trim: true },
  avatarUrl: { type: String, default: '' },
  location: { type: String, trim: true },

  // Education
  college: { type: String, trim: true },
  degree: { type: String, trim: true },
  branch: { type: String, trim: true },
  graduationYear: { type: Number },

  // Professional
  skills: [{ type: String, trim: true }],
  experienceLevel: { type: String, enum: ['fresher', 'beginner', 'intermediate', 'advanced', 'expert'], default: 'fresher' },
  github: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  resumeUrl: { type: String, default: '' },

  // Platform
  isProfileComplete: { type: Boolean, default: false },
  selectedDomain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  assessmentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Result' }],
  totalScore: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  badges: [{ name: String, icon: String, earnedAt: Date }],
  notifications: [{ message: String, read: Boolean, createdAt: Date }],

  // Auth
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
