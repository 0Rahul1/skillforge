import User from '../models/User.js';
import Question from '../models/Question.js';
import Domain from '../models/Domain.js';
import Result from '../models/Result.js';
import Assessment from '../models/Assessment.js';
import ProctoringLog from '../models/ProctoringLog.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getAdminStats = async (req, res) => {
  try {
    const [userCount, questionCount, domainCount, resultCount, assessmentCount] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Question.countDocuments({ isActive: true }),
      Domain.countDocuments({ isActive: true }),
      Result.countDocuments(),
      Assessment.countDocuments(),
    ]);
    const avgScore = await Result.aggregate([{ $group: { _id: null, avg: { $avg: '$percentage' } } }]);
    res.json({ success: true, stats: {
      users: userCount, questions: questionCount, domains: domainCount,
      results: resultCount, assessments: assessmentCount,
      avgScore: Math.round(avgScore[0]?.avg || 0)
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search ? { $or: [{ fullName: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).select('-password')
      .populate('selectedDomain', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1).skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all questions
// @access  Admin
export const getAllQuestions = async (req, res) => {
  try {
    const { domain, difficulty, page = 1, limit = 20 } = req.query;
    const query = {};
    if (domain) {
      const domainDoc = await Domain.findOne({ $or: [{ slug: domain }, { name: domain }] });
      if (domainDoc) {
        query.domain = domainDoc.name;
      } else {
        query.domain = domain;
      }
    }
    if (difficulty) query.difficulty = difficulty;
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1).skip((page - 1) * limit);
    const total = await Question.countDocuments(query);
    res.json({ success: true, questions, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create question
// @access  Admin
export const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, domain, difficulty, category, explanation, marks } = req.body;
    
    // Resolve domainId using the domain name string
    const domainDoc = await Domain.findOne({ name: domain });
    const domainId = domainDoc ? domainDoc._id : null;

    const newQ = await Question.create({
      question,
      options,
      correctAnswer,
      domain,
      domainId,
      difficulty,
      category,
      explanation,
      marks: marks || 1
    });

    if (domainId) {
      await Domain.findByIdAndUpdate(domainId, { $inc: { questionCount: 1 } });
    }

    res.status(201).json({ success: true, question: newQ });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update question
// @access  Admin
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete question
// @access  Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    
    if (question.domainId) {
      await Domain.findByIdAndUpdate(question.domainId, { $inc: { questionCount: -1 } });
    } else {
      // Fallback matching by name
      const domainDoc = await Domain.findOne({ name: question.domain });
      if (domainDoc) {
        await Domain.findByIdAndUpdate(domainDoc._id, { $inc: { questionCount: -1 } });
      }
    }
    
    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk upload questions
// @access  Admin
export const bulkUploadQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty questions array' });
    }

    // Pre-fetch all domains to map domain names to domainIds
    const allDomains = await Domain.find();
    const domainMap = {};
    allDomains.forEach(d => { domainMap[d.name] = d._id; });

    const preparedQuestions = [];
    const domainCountIncrements = {};

    for (const q of questions) {
      const domainId = domainMap[q.domain] || null;
      preparedQuestions.push({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        domain: q.domain,
        domainId,
        difficulty: q.difficulty || 'Medium',
        category: q.category || 'General',
        explanation: q.explanation || '',
        marks: q.marks || 1
      });

      if (domainId) {
        domainCountIncrements[domainId] = (domainCountIncrements[domainId] || 0) + 1;
      }
    }

    // Bulk insert
    const newQuestions = await Question.insertMany(preparedQuestions);

    // Update question count for each domain
    for (const [domainId, inc] of Object.entries(domainCountIncrements)) {
      await Domain.findByIdAndUpdate(domainId, { $inc: { questionCount: inc } });
    }

    res.status(201).json({ success: true, count: newQuestions.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all results (for admin)
// @route   GET /api/admin/results
// @access  Admin
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('user', 'fullName email avatarUrl')
      .populate('domain', 'name slug icon')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create domain
// @route   POST /api/admin/domains
// @access  Admin
export const createDomain = async (req, res) => {
  try {
    const domain = await Domain.create(req.body);
    res.status(201).json({ success: true, domain });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
