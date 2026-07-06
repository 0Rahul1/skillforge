import Domain from '../models/Domain.js';
import Question from '../models/Question.js';
import Assessment from '../models/Assessment.js';
import Result from '../models/Result.js';
import ProctoringLog from '../models/ProctoringLog.js';

// @desc    Get all active domains
// @route   GET /api/domains
// @access  Private
export const getDomains = async (req, res) => {
  try {
    const domains = await Domain.find({ isActive: true });
    res.json({ success: true, domains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start a new assessment
// @route   POST /api/assessments/start
// @access  Private
export const startAssessment = async (req, res) => {
  try {
    const { domainId } = req.body;
    if (!domainId) return res.status(400).json({ success: false, message: 'Domain ID is required' });

    // ── 1. Verify domain ──────────────────────────────────────────────────────
    const domain = await Domain.findById(domainId);
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });

    // ── 2. Block if user already has an active assessment ─────────────────────
    const existingActive = await Assessment.findOne({ user: req.user._id, status: 'active' });
    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active assessment',
        assessmentId: existingActive._id,
      });
    }

    // ── 3. Fetch & shuffle questions ──────────────────────────────────────────
    const rawQuestions = await Question.aggregate([
      { $match: { domain: domain.name, isActive: true } },
      { $sample: { size: 20 } },
    ]);

    if (rawQuestions.length < 5) {
      return res.status(400).json({
        success: false,
        message: `Not enough questions available for "${domain.name}". Please ask an admin to seed questions.`,
      });
    }

    // Fisher-Yates shuffle
    const shuffleArray = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const shuffledQuestions = shuffleArray(rawQuestions);
    const questionIds = shuffledQuestions.map(q => q._id);
    const blankAnswers = questionIds.map(id => ({
      questionId: id,
      selectedAnswer: null,
      isMarkedForReview: false,
      timeSpent: 0,
    }));

    // ── 4. Create Assessment FIRST (so its _id is available for ProctoringLog) ─
    let assessment;
    try {
      assessment = await Assessment.create({
        user:       req.user._id,
        domain:     domain._id,
        questions:  questionIds,
        answers:    blankAnswers,
        duration:   domain.avgDuration || 30,
        status:     'active',
        startTime:  new Date(),
      });
    } catch (assessErr) {
      console.error('[startAssessment] Assessment creation failed:', assessErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to create assessment record: ' + assessErr.message,
      });
    }

    // ── 5. Create ProctoringLog with the real assessment._id ──────────────────
    let proctoringLog;
    try {
      proctoringLog = await ProctoringLog.create({
        assessment: assessment._id,          // ← the real ObjectId, never null
        user:       req.user._id,
        events: [{
          type:      'session_start',
          severity:  'low',
          message:   'Assessment session started',
          timestamp: new Date(),
        }],
        cameraPermissionGranted: false,
        micPermissionGranted:    false,
        integrityScore:          100,
      });
    } catch (logErr) {
      // Roll back: delete the assessment so the user can try again
      console.error('[startAssessment] ProctoringLog creation failed:', logErr.message);
      await Assessment.findByIdAndDelete(assessment._id).catch(() => {});
      return res.status(500).json({
        success: false,
        message: 'Failed to initialise proctoring session: ' + logErr.message,
      });
    }

    // ── 6. Back-link proctoring session onto the assessment ───────────────────
    assessment.proctoringSessionId = proctoringLog._id;
    await assessment.save();

    // ── 7. Increment question usage counts (fire-and-forget) ─────────────────
    Question.updateMany({ _id: { $in: questionIds } }, { $inc: { usageCount: 1 } }).catch(() => {});

    // ── 8. Respond ────────────────────────────────────────────────────────────
    const mappedQuestions = shuffledQuestions.map(q => ({
      _id:        q._id,
      question:   q.question,
      options:    shuffleArray(q.options),   // shuffle option order per question
      difficulty: q.difficulty,
      category:   q.category,
      marks:      q.marks || 1,
    }));

    return res.status(201).json({
      success:      true,
      assessmentId: assessment._id,
      proctoringId: proctoringLog._id,
      questions:    mappedQuestions, // top-level questions array
      assessment: {
        _id:                assessment._id,
        domain:             domain,
        duration:           assessment.duration,
        startTime:          assessment.startTime,
        proctoringSessionId: proctoringLog._id,
        questions:          mappedQuestions,
      },
    });
  } catch (error) {
    console.error('[startAssessment] Unexpected error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Auto-save answers
// @route   PUT /api/assessments/:id/save
// @access  Private
export const saveAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    const assessment = await Assessment.findOne({ _id: req.params.id, user: req.user._id, status: 'active' });
    if (!assessment) return res.status(404).json({ success: false, message: 'Active assessment not found' });

    assessment.answers = answers;
    await assessment.save();
    res.json({ success: true, message: 'Answers saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assessment and calculate results
// @route   POST /api/assessments/:id/submit
// @access  Private
export const submitAssessment = async (req, res) => {
  try {
    const { answers, proctoringData } = req.body;
    const assessment = await Assessment.findOne({ _id: req.params.id, user: req.user._id })
      .populate('questions')
      .populate('domain');

    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    if (assessment.status === 'submitted') {
      const existing = await Result.findOne({ assessment: assessment._id });
      return res.json({ success: true, resultId: existing?._id });
    }

    // Update assessment status
    assessment.status = 'submitted';
    assessment.endTime = new Date();
    if (answers) assessment.answers = answers;
    await assessment.save();

    // Calculate results
    const questions = await (await import('../models/Question.js')).default.find({ _id: { $in: assessment.questions } });
    const answerMap = {};
    (answers || assessment.answers).forEach(a => { answerMap[a.questionId.toString()] = a; });

    let correct = 0, wrong = 0, skipped = 0;
    const questionAnalysis = [];
    const categoryMap = {};
    const difficultyBreakdown = { easy: { total: 0, correct: 0 }, medium: { total: 0, correct: 0 }, hard: { total: 0, correct: 0 } };

    questions.forEach(q => {
      const ans = answerMap[q._id.toString()];
      const selected = ans?.selectedAnswer || null;
      const isCorrect = selected === q.correctAnswer;
      if (!selected) skipped++;
      else if (isCorrect) correct++;
      else wrong++;

      questionAnalysis.push({
        questionId: q._id, question: q.question,
        selectedAnswer: selected, correctAnswer: q.correctAnswer,
        isCorrect, difficulty: q.difficulty, category: q.category,
        timeSpent: ans?.timeSpent || 0, explanation: q.explanation
      });

      const cat = q.category || 'General';
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, correct: 0 };
      categoryMap[cat].total++;
      if (isCorrect) categoryMap[cat].correct++;

      const diff = q.difficulty || 'medium';
      difficultyBreakdown[diff].total++;
      if (isCorrect) difficultyBreakdown[diff].correct++;
    });

    const totalQ = questions.length;
    const percentage = Math.round((correct / totalQ) * 100);
    const timeTaken = Math.round((new Date(assessment.endTime) - new Date(assessment.startTime)) / 1000);

    const categoryScores = Object.entries(categoryMap).map(([cat, data]) => ({
      category: cat, total: data.total, correct: data.correct,
      percentage: Math.round((data.correct / data.total) * 100)
    }));

    // Skill rating
    let skillRating = 'Novice';
    if (percentage >= 90) skillRating = 'Expert';
    else if (percentage >= 75) skillRating = 'Advanced';
    else if (percentage >= 55) skillRating = 'Intermediate';
    else if (percentage >= 35) skillRating = 'Beginner';

    // Strengths & weaknesses
    const strengths = categoryScores.filter(c => c.percentage >= 70).map(c => c.category);
    const weaknesses = categoryScores.filter(c => c.percentage < 50).map(c => c.category);

    // Recommendations
    const recommendations = [
      { title: 'Practice more on ' + (weaknesses[0] || assessment.domain.name), url: 'https://leetcode.com', type: 'practice' },
      { title: 'Read documentation', url: 'https://developer.mozilla.org', type: 'reading' },
    ];

    // Proctoring summary
    let proctoringReport = { tabSwitchCount: 0, fullScreenExits: 0, faceDetectionAlerts: 0, totalViolations: 0, audioAlerts: 0, recommendation: 'Clean' };
    let integrityScore = 100;

    if (assessment.proctoringSessionId) {
      const log = await ProctoringLog.findById(assessment.proctoringSessionId);
      if (log) {
        if (proctoringData) {
          log.tabSwitchCount = proctoringData.tabSwitchCount || 0;
          log.fullScreenExits = proctoringData.fullScreenExits || 0;
          log.faceAlerts = proctoringData.faceAlerts || 0;
          log.totalViolations = proctoringData.totalViolations || 0;
          log.events.push({ type: 'session_end', severity: 'low', message: 'Assessment submitted', timestamp: new Date() });
        }
        integrityScore = Math.max(0, 100 - (log.tabSwitchCount * 10) - (log.fullScreenExits * 5) - (log.faceAlerts * 3));
        log.integrityScore = integrityScore;
        log.recommendation = integrityScore >= 80 ? 'Clean' : integrityScore >= 50 ? 'Review' : 'Suspicious';
        await log.save();
        proctoringReport = {
          tabSwitchCount: log.tabSwitchCount,
          fullScreenExits: log.fullScreenExits,
          faceDetectionAlerts: log.faceAlerts,
          totalViolations: log.totalViolations,
          audioAlerts: log.audioAlerts,
          recommendation: log.recommendation,
        };
      }
    }

    // Create result
    const result = await Result.create({
      user: req.user._id, assessment: assessment._id,
      domain: assessment.domain._id, domainName: assessment.domain.name,
      totalQuestions: totalQ, attempted: correct + wrong, correctAnswers: correct,
      wrongAnswers: wrong, skipped, score: correct, percentage,
      timeTaken, questionAnalysis, categoryScores, difficultyBreakdown,
      integrityScore, proctoringReport, strengths, weaknesses, recommendations, skillRating,
    });

    // Update user total score
    await (await import('../models/User.js')).default.findByIdAndUpdate(req.user._id, {
      $push: { assessmentHistory: result._id },
      $inc: { totalScore: percentage }
    });

    res.json({ success: true, resultId: result._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get result by ID
// @route   GET /api/assessments/results/:id
// @access  Private
export const getResult = async (req, res) => {
  try {
    const resultDoc = await Result.findById(req.params.id).populate('domain', 'name slug icon color');
    if (!resultDoc) return res.status(404).json({ success: false, message: 'Result not found' });
    if (resultDoc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Normalize shape for ResultsPage.jsx
    const r = resultDoc.toObject();

    // Convert difficultyBreakdown from {easy:{},medium:{},hard:{}} to array format
    const diffArr = [];
    if (r.difficultyBreakdown) {
      ['easy', 'medium', 'hard'].forEach(level => {
        const d = r.difficultyBreakdown[level];
        if (d) diffArr.push({ difficulty: level.charAt(0).toUpperCase() + level.slice(1), correct: d.correct || 0, total: d.total || 0 });
      });
    }

    // Convert categoryScores → categoryPerformance
    const catPerf = (r.categoryScores || []).map(c => ({
      category: c.category,
      score: c.percentage || 0,
    }));

    // Map questionAnalysis → questions with userAnswer alias
    const questions = (r.questionAnalysis || []).map(q => ({
      question: q.question,
      options: [],                       // options not stored in result
      correctAnswer: q.correctAnswer,
      userAnswer: q.selectedAnswer,
      explanation: q.explanation || '',
      timeSpent: q.timeSpent || 0,
      difficulty: q.difficulty,
      category: q.category,
      isCorrect: q.isCorrect,
    }));

    const normalized = {
      _id: r._id,
      domain: {
        name: r.domainName || r.domain?.name || 'Assessment',
        icon: r.domain?.icon || '🎯',
        color: r.domain?.color,
      },
      score: r.percentage || 0,
      integrityScore: r.integrityScore || 100,
      skillRating: r.skillRating,
      stats: {
        correct:   r.correctAnswers || 0,
        wrong:     r.wrongAnswers   || 0,
        skipped:   r.skipped        || 0,
        timeTaken: r.timeTaken      || 0,
        total:     r.totalQuestions || 0,
      },
      categoryPerformance: catPerf,
      difficultyBreakdown: diffArr,
      strengths:       r.strengths       || [],
      weaknesses:      r.weaknesses      || [],
      recommendations: r.recommendations || [],
      questions,
      proctoring: r.proctoringReport || {},
      createdAt: r.createdAt,
    };

    res.json({ success: true, result: normalized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log proctoring event
// @route   POST /api/assessments/:id/proctor-event
// @access  Private
export const logProctoringEvent = async (req, res) => {
  try {
    const { type, severity, message, data } = req.body;
    const assessment = await Assessment.findOne({ _id: req.params.id, user: req.user._id });
    if (!assessment || !assessment.proctoringSessionId) {
      return res.status(404).json({ success: false, message: 'Assessment or proctoring session not found' });
    }
    const log = await ProctoringLog.findById(assessment.proctoringSessionId);
    if (!log) return res.status(404).json({ success: false, message: 'Proctoring log not found' });

    log.events.push({ type, severity: severity || 'medium', message, data, timestamp: new Date() });
    
    // Update counts
    if (type === 'tab_switch' || type === 'window_switch') log.tabSwitchCount++;
    if (type === 'fullscreen_exit') log.fullScreenExits++;
    if (['face_not_detected', 'multiple_faces', 'face_out_of_frame', 'camera_blocked', 'looking_away'].includes(type)) log.faceAlerts++;
    if (type === 'audio_alert') log.audioAlerts++;
    log.totalViolations++;

    await log.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
