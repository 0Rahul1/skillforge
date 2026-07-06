import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Question from '../models/Question.js';

const router = express.Router();

// @desc    Get questions by domain (with random selection)
// @route   GET /api/questions?domain=Full Stack Development&limit=20
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { domain, limit = 20, difficulty } = req.query;

    if (!domain) {
      return res.status(400).json({ success: false, message: 'domain query parameter is required' });
    }

    const matchStage = { isActive: true, domain };
    if (difficulty) matchStage.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: parseInt(limit, 10) } },
      { $project: { question: 1, options: 1, difficulty: 1, category: 1, marks: 1, domain: 1 } }
      // NOTE: correctAnswer is intentionally excluded from this endpoint
      // so clients cannot cheat by inspecting the response
    ]);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions are currently available for the domain: "${domain}". Please contact an administrator.`
      });
    }

    res.json({ success: true, questions, count: questions.length });
  } catch (error) {
    console.error('[questionRoutes] Error fetching questions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
