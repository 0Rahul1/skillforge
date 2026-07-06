import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Flame, Trophy, BookOpen, Star, Clock, ArrowRight, Award, Target, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Navbar from '../components/layout/Navbar.jsx';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/users/history');
        if (response.data?.success) {
          setHistory(response.data.history);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalQuizzes = history.length;
  const uniqueDomains = new Set(history.map(item => item.domainName)).size;
  const totalXP = user?.totalScore || 0;

  // Badge criteria
  const badges = [
    { id: 'first', name: 'First Milestone', desc: 'Completed first assessment', icon: '🎯', earned: totalQuizzes >= 1 },
    { id: 'explorer', name: 'Explorer', desc: 'Completed 3+ domains', icon: '🗺️', earned: uniqueDomains >= 3 },
    { id: 'high', name: 'High Scorer', desc: 'Scored 80%+ on any quiz', icon: '⭐', earned: history.some(item => item.percentage >= 80) },
    { id: 'scholar', name: 'AI Scholar', desc: 'Completed 5+ assessments', icon: '🎓', earned: totalQuizzes >= 5 },
  ];

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Welcome back, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Ready to continue your artificial intelligence learning path?
            </p>
          </div>
          <Link
            to="/select-domain"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            Start a New Quiz
            <Zap className="w-4 h-4 fill-current" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total XP Earned', value: `${totalXP} XP`, icon: Zap, color: 'text-indigo-400 border-indigo-500/10' },
            { label: 'Learning Streak', value: '0 Days', icon: Flame, color: 'text-orange-400 border-orange-500/10' },
            { label: 'Domains Completed', value: `${uniqueDomains} / 18`, icon: BookOpen, color: 'text-emerald-400 border-emerald-500/10' },
            { label: 'Quizzes Taken', value: totalQuizzes, icon: Award, color: 'text-purple-400 border-purple-500/10' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`backdrop-blur-md bg-white/[0.02] border ${stat.color} rounded-2xl p-6 flex items-center justify-between shadow-md`}
              >
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color.split(' ')[0]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Assessments */}
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Recent Quizzes
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/[0.02] h-16 rounded-xl border border-white/5" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm">No quizzes taken yet.</p>
                  <Link to="/select-domain" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold inline-flex items-center gap-1 mt-4">
                    Take your first quiz <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-lg">
                          🧠
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-white">{item.domainName}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span
                            className={`font-black text-sm ${
                              item.percentage >= 80
                                ? 'text-emerald-400'
                                : item.percentage >= 50
                                ? 'text-indigo-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {item.percentage}%
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">Score</p>
                        </div>

                        <button
                          onClick={() => navigate(`/results/${item._id}`)}
                          className="p-2 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-lg text-slate-400 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Domain chips */}
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Quick Study</h2>
              <p className="text-slate-400 text-xs mb-6">Select a trending domain to jump right back in.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Python', slug: 'python', emoji: '🐍' },
                  { name: 'Machine Learning', slug: 'machine-learning', emoji: '🧠' },
                  { name: 'Deep Learning', slug: 'deep-learning', emoji: '⚡' },
                  { name: 'Generative AI', slug: 'generative-ai', emoji: '✨' },
                  { name: 'Computer Vision', slug: 'computer-vision', emoji: '👁️' },
                  { name: 'NLP', slug: 'nlp', emoji: '💬' },
                ].map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => navigate('/select-domain')}
                    className="flex items-center gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-indigo-500/20 text-slate-300 hover:text-white hover:bg-indigo-500/5 transition-all text-left text-xs font-semibold"
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Badges & Progress */}
          <div className="space-y-8">
            {/* Circular Progress Ring */}
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                Curriculum Progress
              </h2>

              <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                {/* Simulated Conic Gradient circular ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#6366f1 ${(uniqueDomains / 18) * 360}deg, rgba(255,255,255,0.05) 0deg)`,
                  }}
                />
                <div className="absolute inset-2 bg-[#0a0a0f] rounded-full flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {Math.round((uniqueDomains / 18) * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
                    Completed
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs">
                You have explored {uniqueDomains} of the 18 available artificial intelligence and programming domains.
              </p>
            </div>

            {/* Achievements Badges */}
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Badges</h2>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-md">
                  {earnedCount} / {badges.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      badge.earned
                        ? 'bg-white/[0.02] border-indigo-500/20 shadow-md shadow-indigo-500/5'
                        : 'bg-white/[0.01] border-white/5 opacity-40'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <h3 className="text-xs font-bold text-white truncate">{badge.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 truncate">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
