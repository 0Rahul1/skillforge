import User from '../models/User.js';
import Result from '../models/Result.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const body = req.body;

    // Support both flat fields and nested education object
    const education = body.education || {};
    const college         = body.college         || education.college         || undefined;
    const degree          = body.degree          || education.degree          || undefined;
    const branch          = body.branch          || education.branch          || undefined;
    // Support both gradYear (frontend) and graduationYear (backend)
    const graduationYear  = body.graduationYear  || body.gradYear
                          || education.graduationYear || education.gradYear  || undefined;

    const {
      fullName, phone, location, skills, experienceLevel,
      github, linkedin, portfolio, avatarUrl, resumeUrl,
      selectedDomain, profileComplete
    } = body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Update only provided fields
    if (fullName)        user.fullName        = fullName;
    if (phone)           user.phone           = phone;
    if (location)        user.location        = location;
    if (college)         user.college         = college;
    if (degree)          user.degree          = degree;
    if (branch)          user.branch          = branch;
    if (graduationYear)  user.graduationYear  = Number(graduationYear);
    if (skills)          user.skills          = skills;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (github)          user.github          = github;
    if (linkedin)        user.linkedin        = linkedin;
    if (portfolio)       user.portfolio       = portfolio;
    if (avatarUrl)       user.avatarUrl       = avatarUrl;
    if (resumeUrl)       user.resumeUrl       = resumeUrl;
    if (selectedDomain)  user.selectedDomain  = selectedDomain;

    // Mark profile complete: only require fullName + college + degree
    // (phone and branch are optional)
    const hasRequiredFields =
      user.fullName?.trim() &&
      user.college?.trim()  &&
      user.degree?.trim();

    // If the frontend explicitly sends profileComplete=true AND required fields exist,
    // OR required fields are all present → mark complete
    if (profileComplete === true && hasRequiredFields) {
      user.isProfileComplete = true;
    } else if (hasRequiredFields) {
      user.isProfileComplete = true;
    }

    user.lastActive = new Date();
    await user.save();

    // Try to populate selectedDomain (non-critical)
    try {
      await user.populate('selectedDomain', 'name slug icon color');
    } catch (_) { /* ignore if domain ref is invalid */ }

    res.json({ success: true, user });
  } catch (error) {
    console.error('[userController] updateProfile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's assessment history
// @route   GET /api/users/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('domain', 'name slug icon color')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const results = await Result.aggregate([
      { $group: { _id: '$user', bestScore: { $max: '$percentage' }, attempts: { $sum: 1 } } },
      { $sort: { bestScore: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
      { $unwind: '$userInfo' },
      { $project: {
          user: '$_id',
          fullName: '$userInfo.fullName',
          avatarUrl: '$userInfo.avatarUrl',
          college: '$userInfo.college',
          bestScore: 1,
          attempts: 1
        }
      }
    ]);
    res.json({ success: true, leaderboard: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await Result.find({ user: userId });
    const totalAssessments = results.length;
    const avgScore = totalAssessments > 0 ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / totalAssessments) : 0;
    const bestScore = totalAssessments > 0 ? Math.max(...results.map(r => r.percentage)) : 0;
    const totalTime = results.reduce((a, r) => a + (r.timeTaken || 0), 0);

    // Leaderboard rank
    const allUsers = await Result.aggregate([
      { $group: { _id: '$user', bestScore: { $max: '$percentage' } } },
      { $sort: { bestScore: -1 } }
    ]);
    const rankIndex = allUsers.findIndex(u => u._id.toString() === userId.toString());
    const rank = rankIndex >= 0 ? rankIndex + 1 : null;

    res.json({
      success: true,
      stats: { totalAssessments, avgScore, bestScore, totalTime, rank },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
