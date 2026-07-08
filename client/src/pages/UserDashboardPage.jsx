import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, BookOpen, Clock, Award, Target, Trophy, Settings,
  HelpCircle, LogOut, Search, Bell, Sun, Moon, Map, ChevronRight, ChevronLeft,
  Calendar, FileText, CheckCircle, XCircle, ArrowUpRight, BarChart2, Shield, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import Navbar from '../components/layout/Navbar.jsx';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';
import toast from 'react-hot-toast';

// ── SUB-COMPONENT: ANIMATED COUNTER ──
const AnimatedCounter = ({ value, duration = 1200 }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = String(value).replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) {
      setCount(end);
      return;
    }
    const totalMs = duration;
    const stepTime = Math.max(Math.floor(totalMs / end), 12);
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMs / stepTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// ── DAILY MOTIVATIONAL QUOTES ──
const MOTIVATIONAL_QUOTES = [
  "The only way to learn a new programming language is by writing programs in it. — Dennis Ritchie",
  "Intelligence is the ability to adapt to change. — Stephen Hawking",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "The best way to predict the future is to invent it. — Alan Kay",
  "In God we trust. All others must bring data. — W. Edwards Deming",
  "Machine learning is the science of getting computers to act without being explicitly programmed. — Andrew Ng"
];

export default function UserDashboardPage() {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Sidebar navigation active state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // API Data States
  const [stats, setStats] = useState({ totalAssessments: 0, avgScore: 0, bestScore: 0, totalTime: 0, rank: null });
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for profile editor
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.profile?.phone || user?.phone || '',
    location: user?.profile?.location || user?.location || '',
    college: user?.college || '',
    degree: user?.degree || '',
    branch: user?.branch || '',
    graduationYear: user?.graduationYear || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    skills: user?.skills || []
  });

  // Table search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [cameraPermission, setCameraPermission] = useState('Not Checked');

  // Daily Quote Selection
  const dailyQuote = MOTIVATIONAL_QUOTES[new Date().getDay() % MOTIVATIONAL_QUOTES.length];

  // Load dashboard dataset dynamically
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, historyRes, leaderboardRes, domainsRes] = await Promise.all([
        api.get('/users/stats').catch(() => ({ data: { success: false } })),
        api.get('/users/history').catch(() => ({ data: { success: false } })),
        api.get('/users/leaderboard').catch(() => ({ data: { success: false } })),
        api.get('/assessments/domains').catch(() => ({ data: { success: false } }))
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.stats);
      if (historyRes.data?.success) setHistory(historyRes.data.results || []);
      if (leaderboardRes.data?.success) setLeaderboard(leaderboardRes.data.leaderboard || []);
      if (domainsRes.data?.success) setDomains(domainsRes.data.domains || []);
    } catch (err) {
      console.error('Error fetching dashboard dataset:', err);
      toast.error('Failed to sync real-time dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle profile form update submit
  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', profileForm);
      if (response.data?.success) {
        updateUser(response.data.user);
        toast.success('Your profile metrics updated successfully! ✨');
        setActiveTab('dashboard');
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile settings');
    }
  };

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('Granted');
      toast.success('Camera permission verified! proctoring active. 📹');
    } catch {
      setCameraPermission('Denied');
      toast.error('Camera access blocked. Enable permissions in browser.');
    }
  };

  // Pre-compiled streaks, accuracy, solved count details
  const totalXP = user?.totalScore || 0;
  const uniqueCompletedCount = new Set(history.map(item => item.domainName)).size;
  const questionsCount = history.reduce((sum, item) => sum + (item.attempted || 0), 0);
  const correctCount = history.reduce((sum, item) => sum + (item.correctAnswers || 0), 0);
  const currentAccuracy = questionsCount > 0 ? Math.round((correctCount / questionsCount) * 100) : 0;
  const bestScoreVal = stats.bestScore || 0;

  // Badge list config
  const badges = [
    { id: 'first', name: 'First Quiz', desc: 'Completed first test', icon: '🎯', earned: history.length >= 1 },
    { id: 'explorer', name: 'AI Explorer', desc: 'Attempted 3+ domains', icon: '🗺️', earned: uniqueCompletedCount >= 3 },
    { id: 'master', name: 'ML Master', desc: 'Got 85%+ on ML domain', icon: '🧠', earned: history.some(h => h.domainName === 'Machine Learning' && h.percentage >= 85) },
    { id: 'streak', name: 'Fast Learner', desc: 'Took 5+ assessments', icon: '⚡', earned: history.length >= 5 },
    { id: 'performer', name: 'Top Performer', desc: 'Scored 90%+ on any domain', icon: '👑', earned: history.some(h => h.percentage >= 90) },
    { id: 'verified', name: 'Verified Profile', desc: 'Profile completion 100%', icon: '🛡️', earned: user?.isProfileComplete }
  ];
  const earnedCount = badges.filter(b => b.earned).length;

  // Chart Data preparation
  const weeklyAnalyticsData = history.slice(0, 7).reverse().map((item, idx) => ({
    name: `Test ${idx + 1}`,
    score: item.percentage,
    accuracy: Math.round((item.correctAnswers / (item.attempted || 1)) * 100)
  }));

  const domainScoresData = domains.map(dom => {
    const matchingAssessments = history.filter(h => h.domainName === dom.name);
    const topScore = matchingAssessments.length > 0 ? Math.max(...matchingAssessments.map(m => m.percentage)) : 0;
    return { name: dom.name, score: topScore };
  }).filter(d => d.score > 0);

  // Sidebar navigation options
  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'history', label: 'Assessment History', icon: Clock },
    { id: 'analytics', label: 'Results & Analytics', icon: BarChart2 },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Map },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#06060c] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />

      {/* Main Container Layout */}
      <div className="flex pt-16 min-h-screen relative">

        {/* ── SIDEBAR NAVIGATION ── */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-64px)] w-64 z-30 transition-all duration-300 transform border-r
          ${isDark ? 'bg-slate-950/80 border-white/5' : 'bg-white border-slate-200'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="flex flex-col h-full justify-between p-4">
            <div className="space-y-1">
              <p className={`text-[10px] uppercase font-bold tracking-widest px-3 mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Navigation Menu
              </p>
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative overflow-hidden group
                      ${active
                        ? (isDark ? 'text-indigo-400 bg-white/[0.03]' : 'text-indigo-600 bg-indigo-50')
                        : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.01]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}`}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-indigo-500' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Logout footer */}
            <button
              onClick={logout}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors mt-auto
                ${isDark ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Session</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile navigation toggle */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── MAIN CONTENT LAYER ── */}
        <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto">

          {/* mobile menu trigger */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-white/5 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                {user?.fullName?.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Tab Route Rendering router */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >

              {/* ── TAB 1: OVERVIEW HOME ── */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Personal Greeting header widget */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                        Good day, {user?.fullName || 'Candidate'} 👋
                      </h1>
                      <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Ready to improve your skills and check roadmap milestones today?
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to="/select-domain"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        Take Assessment
                      </Link>
                      <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-xl border transition-colors ${isDark ? 'bg-slate-900 border-white/5 hover:bg-slate-800 text-yellow-400' : 'bg-white border-slate-200 hover:bg-slate-100 text-indigo-600'}`}
                      >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Motivational Quote banner */}
                  <div className={`p-4 rounded-xl border border-dashed flex items-start gap-3 ${isDark ? 'bg-slate-950/40 border-white/10' : 'bg-indigo-50/50 border-indigo-100'}`}>
                    <span className="text-xl">💡</span>
                    <div>
                      <p className={`text-xs italic leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        "{dailyQuote}"
                      </p>
                    </div>
                  </div>

                  {/* Overview statistics grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                      { label: 'Total assessments', value: stats.totalAssessments, icon: FileText, color: 'from-indigo-500/10 to-indigo-500/5 text-indigo-400 border-indigo-500/10' },
                      { label: 'Average Score', value: `${stats.avgScore}%`, icon: Target, color: 'from-purple-500/10 to-purple-500/5 text-purple-400 border-purple-500/10' },
                      { label: 'Best Score', value: `${bestScoreVal}%`, icon: Award, color: 'from-pink-500/10 to-pink-500/5 text-pink-400 border-pink-500/10' },
                      { label: 'Streak Score', value: '1 Day', icon: BookOpen, color: 'from-orange-500/10 to-orange-500/5 text-orange-400 border-orange-500/10' },
                      { label: 'Global Rank', value: stats.rank ? `#${stats.rank}` : 'N/A', icon: Trophy, color: 'from-yellow-500/10 to-yellow-500/5 text-yellow-400 border-yellow-500/10' },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={idx}
                          className={`backdrop-blur-md bg-gradient-to-br ${stat.color} border rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.03] transition-transform shadow-sm`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {stat.label}
                            </span>
                            <div className="p-2 rounded-lg bg-white/5">
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <span className="text-2xl font-black">
                            <AnimatedCounter value={stat.value} />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Split screen content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Recent history */}
                    <div className="lg:col-span-2 space-y-8">
                      <div className={`backdrop-blur-md border rounded-2xl p-6 ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          Recent Assessments
                        </h2>

                        {loading ? (
                          <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="animate-pulse bg-white/[0.02] h-16 rounded-xl border border-white/5" />
                            ))}
                          </div>
                        ) : history.length === 0 ? (
                          <div className="text-center py-12">
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              No quizzes taken yet. Click start to explore!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {history.slice(0, 4).map((item) => (
                              <div
                                key={item._id}
                                className={`flex items-center justify-between p-4 border rounded-xl hover:border-indigo-500/20 transition-all ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">🧠</span>
                                  <div>
                                    <h3 className="font-bold text-sm">{item.domainName}</h3>
                                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-5">
                                  <span className={`font-black text-sm ${item.percentage >= 80 ? 'text-emerald-400' : item.percentage >= 55 ? 'text-indigo-400' : 'text-rose-400'}`}>
                                    {item.percentage}%
                                  </span>
                                  <button
                                    onClick={() => navigate(`/results/${item._id}`)}
                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-white/5 hover:bg-indigo-500 hover:text-white text-slate-400' : 'bg-slate-200 hover:bg-indigo-600 hover:text-white text-slate-700'}`}
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* AI Career Insights summaries card */}
                      <div className={`backdrop-blur-md border rounded-2xl p-6 ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-indigo-500" />
                          AI Career insights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <span className="text-xs uppercase font-bold text-emerald-400">Current Strengths</span>
                            <ul className={`text-xs mt-3 space-y-2 list-disc list-inside ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              <li>Excellent accuracy metrics in algorithms</li>
                              <li>Consistently finishes quizzes within half-limit</li>
                              <li>Accurate memory execution tracking</li>
                            </ul>
                          </div>

                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <span className="text-xs uppercase font-bold text-indigo-400">Recommended Path</span>
                            <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              Based on your Deep Learning scores, we recommend proceeding to the **Transformer Architectures** and **Generative AI** portfolio projects.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Achievements & Ring progress */}
                    <div className="space-y-8">
                      {/* Circular Progress Ring */}
                      <div className={`backdrop-blur-md border rounded-2xl p-6 text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                          Overall Progress
                        </h2>
                        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(#6366f1 ${(uniqueCompletedCount / 18) * 360}deg, rgba(255,255,255,0.05) 0deg)`,
                            }}
                          />
                          <div className={`absolute inset-2 rounded-full flex flex-col items-center justify-center ${isDark ? 'bg-[#0a0a0f]' : 'bg-white'}`}>
                            <span className="text-3xl font-black">
                              {Math.round((uniqueCompletedCount / 18) * 100)}%
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
                              Completed
                            </span>
                          </div>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          You have explored {uniqueCompletedCount} of the 18 available specialty domains.
                        </p>
                      </div>

                      {/* Achievements preview */}
                      <div className={`backdrop-blur-md border rounded-2xl p-6 ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-base font-bold">Earned Badges</h2>
                          <button onClick={() => setActiveTab('achievements')} className="text-xs text-indigo-400 hover:underline">
                            View All
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {badges.slice(0, 3).map((badge) => (
                            <div
                              key={badge.id}
                              className={`p-3 rounded-xl border text-center transition-all ${badge.earned ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-white/[0.01] border-white/5 opacity-30'}`}
                            >
                              <span className="text-2xl block mb-1">{badge.icon}</span>
                              <h3 className="text-[9px] font-bold truncate">{badge.name}</h3>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: MY PROFILE ── */}
              {activeTab === 'profile' && (
                <div className={`backdrop-blur-md border rounded-2xl p-6 max-w-4xl mx-auto ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    Manage Your Profile
                  </h2>
                  <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className={`w-full p-3 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2">Contact Number</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className={`w-full p-3 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2">College Name</label>
                        <input
                          type="text"
                          required
                          value={profileForm.college}
                          onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                          className={`w-full p-3 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2">Degree Programme</label>
                        <input
                          type="text"
                          required
                          value={profileForm.degree}
                          onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                          className={`w-full p-3 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2">GitHub Profile link</label>
                        <input
                          type="url"
                          value={profileForm.github}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                          className={`w-full p-3 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2">LinkedIn Profile link</label>
                        <input
                          type="url"
                          value={profileForm.linkedin}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                          className={`w-full p-3 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}

              {/* ── TAB 3: ASSESSMENT HISTORY ── */}
              {activeTab === 'history' && (
                <div className={`backdrop-blur-md border rounded-2xl p-6 ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold">Assessment History Log</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search domain..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`pl-9 pr-4 py-2 rounded-lg border text-xs w-48 ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`p-2 rounded-lg border text-xs ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                      >
                        <option value="All">All Grades</option>
                        <option value="Pass">Pass (&gt;= 75%)</option>
                        <option value="Review">Needs Review</option>
                      </select>
                    </div>
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-500 text-sm">No recorded tests taken yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-xs uppercase font-bold tracking-wider ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                            <th className="pb-3 pl-4">Domain name</th>
                            <th className="pb-3">Attempted Date</th>
                            <th className="pb-3 text-center">Questions</th>
                            <th className="pb-3 text-center">Score</th>
                            <th className="pb-3 text-center">Status</th>
                            <th className="pb-3 pr-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((row) => (
                            <tr key={row._id} className={`border-b text-sm ${isDark ? 'border-white/5 hover:bg-white/[0.01]' : 'border-slate-100 hover:bg-slate-50'}`}>
                              <td className="py-4 pl-4 font-bold">{row.domainName}</td>
                              <td className={`py-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {new Date(row.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="py-4 text-center">{row.attempted} Solved</td>
                              <td className="py-4 text-center font-black text-indigo-400">{row.percentage}%</td>
                              <td className="py-4 text-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.percentage >= 75 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                  {row.percentage >= 75 ? 'Pass' : 'Review'}
                                </span>
                              </td>
                              <td className="py-4 pr-4 text-right">
                                <button
                                  onClick={() => navigate(`/results/${row._id}`)}
                                  className="text-xs text-indigo-400 hover:underline inline-flex items-center gap-1"
                                >
                                  Report <ArrowUpRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 4: RESULTS & ANALYTICS ── */}
              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-500" />
                    Analytics Dashboard
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Weekly Performance Line Chart */}
                    <div className={`backdrop-blur-md border rounded-2xl p-6 ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Weekly Score Trends</h3>
                      {weeklyAnalyticsData.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs">Not enough test data. Complete assessments to visualize trends.</div>
                      ) : (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyAnalyticsData}>
                              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff0a' : '#0000000a'} />
                              <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
                              <YAxis domain={[0, 100]} stroke={isDark ? '#94a3b8' : '#64748b'} />
                              <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#fff', borderColor: '#6366f1' }} />
                              <Legend />
                              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} name="Score %" />
                              <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={2} name="Accuracy %" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    {/* Domain wise Bar Performance */}
                    <div className={`backdrop-blur-md border rounded-2xl p-6 ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Top Scores by Specialty</h3>
                      {domainScoresData.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs">No domain scores available yet.</div>
                      ) : (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={domainScoresData}>
                              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff0a' : '#0000000a'} />
                              <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
                              <YAxis domain={[0, 100]} stroke={isDark ? '#94a3b8' : '#64748b'} />
                              <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#fff', borderColor: '#8b5cf6' }} />
                              <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Peak Score" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 5: LEARNING ROADMAP ── */}
              {activeTab === 'roadmap' && (
                <div className={`backdrop-blur-md border rounded-2xl p-6 max-w-4xl mx-auto ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Map className="w-5 h-5 text-indigo-500" />
                    Personalized Timeline Roadmap
                  </h2>
                  <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    We analyze your history scores. Complete milestones, claim certificate awards, and prove your capabilities.
                  </p>

                  <div className="relative border-l-2 border-indigo-500/20 pl-6 ml-4 space-y-8">
                    {[
                      { title: 'Python Core Foundation', desc: 'Focus on decorators, comprehensions, and OOP mechanics.', time: '2 hours', completed: uniqueCompletedCount >= 1 },
                      { title: 'Supervised Model Foundations', desc: 'Study Bias-Variance Tradeoff, regularization coefficients, and cost gradients.', time: '4 hours', completed: uniqueCompletedCount >= 2 },
                      { title: 'Deep Learning & Neural Networks', desc: 'Develop intuition for backpropagation math, skip-connections, and optimizer functions.', time: '6 hours', completed: uniqueCompletedCount >= 3 },
                      { title: 'Generative AI & LLMs', desc: 'Master reinforcement feedback loops, token vectors, and RAG search structures.', time: '10 hours', completed: uniqueCompletedCount >= 4 }
                    ].map((step, idx) => (
                      <div key={idx} className="relative">
                        <span className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow
                          ${step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                          {step.completed ? '✓' : idx + 1}
                        </span>
                        <div>
                          <h3 className="text-base font-bold flex items-center gap-2">
                            {step.title}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${step.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                              {step.completed ? 'Completed' : 'Recommended'}
                            </span>
                          </h3>
                          <p className={`text-xs mt-2 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                          <span className="text-[10px] text-indigo-400 block mt-2">Completion Estimate: {step.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 6: LEADERBOARD ── */}
              {activeTab === 'leaderboard' && (
                <div className={`backdrop-blur-md border rounded-2xl p-6 max-w-4xl mx-auto ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-indigo-500" />
                    Global Leaderboard
                  </h2>

                  {leaderboard.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">Synchronizing score ratings...</div>
                  ) : (
                    <div className="space-y-4">
                      {leaderboard.map((item, index) => {
                        const isSelf = item.user === user?._id;
                        return (
                          <div
                            key={item.user}
                            className={`flex items-center justify-between p-4 border rounded-xl transition-all
                              ${isSelf
                                ? 'bg-indigo-500/10 border-indigo-500/40 scale-[1.01] shadow'
                                : (isDark ? 'bg-white/[0.01] border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100 hover:border-slate-200')}`}
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-black w-6 text-center">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                              </span>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                {item.fullName?.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold flex items-center gap-1.5">
                                  {item.fullName}
                                  {isSelf && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-black uppercase">You</span>}
                                </h4>
                                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.college || 'Engineering College'}</span>
                              </div>
                            </div>
                            <span className="text-sm font-black text-indigo-400">{item.bestScore}% Peak</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 7: ACHIEVEMENTS ── */}
              {activeTab === 'achievements' && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-500" />
                      Gamified Badges Achievements
                    </h2>
                    <span className="text-sm bg-indigo-500/10 text-indigo-400 font-bold px-3 py-1 rounded-full">
                      {earnedCount} / {badges.length} Unlocked
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-6 rounded-2xl border text-center transition-all relative overflow-hidden group
                          ${badge.earned
                            ? 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20 shadow shadow-indigo-500/5 hover:scale-[1.03]'
                            : 'bg-white/[0.01] border-white/5 opacity-40'}`}
                      >
                        {badge.earned && (
                          <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/10 blur-xl rounded-full" />
                        )}
                        <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{badge.icon}</span>
                        <h3 className="text-sm font-bold text-white mb-1.5">{badge.name}</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{badge.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 8: SETTINGS ── */}
              {activeTab === 'settings' && (
                <div className={`backdrop-blur-md border rounded-2xl p-6 max-w-4xl mx-auto ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-500" />
                    Account Settings & Preferences
                  </h2>

                  <div className="space-y-6 divide-y divide-white/5">
                    {/* Theme Preference toggle */}
                    <div className="flex items-center justify-between pb-6">
                      <div>
                        <h3 className="text-sm font-bold">Theme Style Selection</h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Switch between light mode and dark mode layouts.</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2
                          ${isDark ? 'bg-slate-900 border-white/5 hover:bg-slate-800 text-yellow-400' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                      >
                        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        {isDark ? 'Light theme' : 'Dark theme'}
                      </button>
                    </div>

                    {/* Notifications preferences toggle */}
                    <div className="flex items-center justify-between py-6">
                      <div>
                        <h3 className="text-sm font-bold">System Notifications</h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Toggle popup announcements and email test reports.</p>
                      </div>
                      <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all
                          ${notificationsEnabled
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : (isDark ? 'bg-slate-900 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}`}
                      >
                        {notificationsEnabled ? 'Notifications Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* Camera Device verification testing */}
                    <div className="flex items-center justify-between py-6">
                      <div>
                        <h3 className="text-sm font-bold">Camera & Proctoring Permission</h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verify browser device access before assessment loads.</p>
                      </div>
                      <button
                        onClick={checkCameraPermission}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all
                          ${cameraPermission === 'Granted'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : cameraPermission === 'Denied'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            : (isDark ? 'bg-slate-900 border-white/5 text-slate-300' : 'bg-white border-slate-200 text-slate-600')}`}
                      >
                        {cameraPermission === 'Not Checked' ? 'Run Camera Test' : `Permission: ${cameraPermission}`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 9: HELP & SUPPORT ── */}
              {activeTab === 'help' && (
                <div className={`backdrop-blur-md border rounded-2xl p-6 max-w-4xl mx-auto ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-500" />
                    Help & Support Desk
                  </h2>
                  <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Got questions regarding AI news feeds, certification claims, or assessment proctoring policies? Submit a support ticket!
                  </p>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className="text-sm font-bold mb-1">How is my integrity score calculated?</h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Integrity score decreases by 10 points per tab switch, 5 points per fullscreen exit, and 3 points per face alerts violation.
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className="text-sm font-bold mb-1">Where are my certificates saved?</h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Once a learning domain is completed, certifications are automatically saved on your profile under achievements.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
