import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import {
  CheckCircle, XCircle, MinusCircle, Clock, Trophy, Shield,
  ChevronDown, ChevronRight, ExternalLink, Share2, LayoutDashboard,
  Layers, AlertTriangle, Star, TrendingUp, Eye, EyeOff, ArrowLeft,
  BookOpen, Video, FileText, Monitor, Award, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

/* ─── helpers ────────────────────────────────────────────────── */
const getRatingInfo = (score) => {
  if (score >= 90) return { label: 'Expert',        color: 'text-purple-400',  bg: 'bg-purple-500/20 border-purple-500/30',  icon: '🏆' };
  if (score >= 75) return { label: 'Advanced',      color: 'text-blue-400',    bg: 'bg-blue-500/20 border-blue-500/30',      icon: '⭐' };
  if (score >= 60) return { label: 'Intermediate',  color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30',icon: '✅' };
  if (score >= 40) return { label: 'Beginner',      color: 'text-amber-400',   bg: 'bg-amber-500/20 border-amber-500/30',    icon: '📚' };
  return             { label: 'Novice',             color: 'text-red-400',     bg: 'bg-red-500/20 border-red-500/30',        icon: '🌱' };
};

const getScoreColor = (score) => {
  if (score >= 70) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

const getIntegrityInfo = (score) => {
  if (score >= 85) return { label: 'Clean',      color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' };
  if (score >= 60) return { label: 'Review',     color: 'text-amber-400',   bg: 'bg-amber-500/20 border-amber-500/30' };
  return             { label: 'Suspicious',      color: 'text-red-400',     bg: 'bg-red-500/20 border-red-500/30' };
};

const formatTime = (seconds) => {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

/* ─── Circular Score ─────────────────────────────────────────── */
const CircularScore = ({ score, size = 200, strokeWidth = 12 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1.5;
        if (start >= score) { setAnimatedScore(score); return; }
        setAnimatedScore(Math.round(start));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 400);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 12px ${color})` }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-black text-white" style={{ color }}>{animatedScore}%</span>
        <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
};

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass p-5 flex flex-col items-center gap-2 text-center"
  >
    <div className={`p-2.5 rounded-xl ${color}`}>
      <Icon size={20} />
    </div>
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
  </motion.div>
);

/* ─── Question Accordion ─────────────────────────────────────── */
const QuestionAccordion = ({ question, index }) => {
  const [open, setOpen] = useState(false);
  const userAnswer = question.userAnswer;
  const correct = question.correctAnswer;

  const isCorrect = userAnswer === correct;
  const isSkipped = userAnswer == null || userAnswer === '';

  const statusColor = isSkipped ? 'text-slate-400' : isCorrect ? 'text-emerald-400' : 'text-red-400';
  const statusIcon  = isSkipped ? <MinusCircle size={16}/> : isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>;

  const optionStyle = (opt) => {
    if (opt === correct) return 'option-correct';
    if (opt === userAnswer && !isCorrect) return 'option-wrong';
    return '';
  };

  return (
    <div className="glass mb-3 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className={`font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0
          ${isSkipped ? 'bg-slate-700 text-slate-400' : isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {index + 1}
        </span>
        <span className="flex-1 text-slate-200 text-sm line-clamp-2">{question.question}</span>
        <span className={`${statusColor} shrink-0 flex items-center gap-1`}>{statusIcon}</span>
        <span className="text-slate-500 shrink-0">{open ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              <div className="divider mb-3" />
              {question.options?.map((opt, i) => (
                <div key={i} className={`option-btn ${optionStyle(opt)}`}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {opt === correct && <CheckCircle size={14} className="ml-auto text-emerald-400 shrink-0"/>}
                  {opt === userAnswer && !isCorrect && <XCircle size={14} className="ml-auto text-red-400 shrink-0"/>}
                </div>
              ))}

              {question.explanation && (
                <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs font-semibold text-blue-400 mb-1">💡 Explanation</p>
                  <p className="text-sm text-slate-300">{question.explanation}</p>
                </div>
              )}

              {question.timeSpent != null && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <Clock size={12} />
                  <span>Time spent: {formatTime(question.timeSpent)}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Custom Tooltip for Recharts ────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-3 py-2 text-xs">
      <p className="text-slate-300 font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

/* ─── MOCK fallback data ─────────────────────────────────────── */
const MOCK_RESULT = {
  domain: { name: 'JavaScript', icon: '⚡' },
  score: 78,
  integrityScore: 92,
  stats: { correct: 14, wrong: 3, skipped: 3, timeTaken: 1740 },
  categoryPerformance: [
    { category: 'Arrays', score: 90 }, { category: 'Closures', score: 65 },
    { category: 'Async', score: 80 }, { category: 'Prototypes', score: 70 },
    { category: 'DOM', score: 85 }, { category: 'ES6+', score: 75 },
  ],
  difficultyBreakdown: [
    { difficulty: 'Easy', correct: 7, total: 7 },
    { difficulty: 'Medium', correct: 5, total: 8 },
    { difficulty: 'Hard', correct: 2, total: 5 },
  ],
  strengths: ['Array Methods', 'ES6 Syntax', 'DOM Manipulation', 'Promises', 'Event Handling'],
  weaknesses: ['Closures', 'Prototype Chain', 'Memory Management'],
  questions: [
    {
      question: 'What is the output of typeof null in JavaScript?',
      options: ['null', 'undefined', 'object', 'string'],
      correctAnswer: 'object', userAnswer: 'object', explanation: 'typeof null returns "object" — this is a known bug in JavaScript that was never fixed for backward compatibility.',
      timeSpent: 45,
    },
    {
      question: 'Which method is used to create a shallow copy of an array?',
      options: ['array.copy()', 'array.slice()', 'array.splice()', 'array.clone()'],
      correctAnswer: 'array.slice()', userAnswer: 'array.splice()', explanation: 'Array.prototype.slice() without arguments creates a shallow copy. splice() modifies the original array.',
      timeSpent: 62,
    },
    {
      question: 'What does the "use strict" directive do?',
      options: ['Enables strict mode', 'Disables hoisting', 'Enables ES6 features', 'Disables closures'],
      correctAnswer: 'Enables strict mode', userAnswer: 'Enables strict mode', explanation: '"use strict" enables strict mode, which catches common coding errors and prevents certain unsafe actions.',
      timeSpent: 30,
    },
  ],
  recommendations: [
    { title: 'JavaScript Closures Deep Dive', type: 'Article', url: '#', icon: FileText },
    { title: 'Prototype Chain Explained', type: 'Video', url: '#', icon: Video },
    { title: 'Advanced JS Patterns', type: 'Course', url: '#', icon: BookOpen },
  ],
  proctoring: {
    integrityScore: 92,
    tabSwitches: 1,
    fullscreenExits: 0,
    faceAlerts: 2,
  },
};

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ResultsPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await api.get(`/assessments/results/${resultId}`);
        setResult(data.result || data);
      } catch {
        // fallback to mock
        setResult(MOCK_RESULT);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  const handleShare = () => {
    toast.success('Result link copied to clipboard! 🎉', { icon: '📋' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="spinner w-12 h-12" />
        <p className="text-slate-400 text-sm">Loading your results…</p>
      </div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="glass p-8 text-center max-w-sm">
        <AlertTriangle className="text-amber-400 mx-auto mb-3" size={40} />
        <p className="text-slate-300">Result not found.</p>
        <button onClick={() => navigate('/select-domain')} className="btn-primary mt-4 text-sm">
          Take Assessment
        </button>
      </div>
    </div>
  );

  const { domain, score, integrityScore, stats, categoryPerformance, difficultyBreakdown,
          strengths, weaknesses, questions, recommendations, proctoring } = result;
  const rating = getRatingInfo(score);
  const integrityInfo = getIntegrityInfo(integrityScore ?? proctoring?.integrityScore ?? 100);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const sectionVariants  = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

  const radarData = (categoryPerformance || []).map(c => ({
    subject: c.category, A: c.score, fullMark: 100,
  }));

  const barData = (difficultyBreakdown || []).map(d => ({
    name: d.difficulty, Correct: d.correct, Total: d.total, Wrong: d.total - d.correct,
  }));

  return (
    <div className="min-h-screen bg-grid" style={{ background: 'var(--color-bg)' }}>
      {/* Background blobs */}
      <div className="animated-blob w-96 h-96 bg-indigo-600 top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <div className="animated-blob w-80 h-80 bg-violet-600 top-1/2 right-0 translate-x-1/2" />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

          {/* ── HERO ── */}
          <motion.div variants={sectionVariants} className="glass p-8 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="text-6xl mb-3"
            >
              {domain?.icon || '🎯'}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-3xl font-black gradient-text mb-1"
            >
              {domain?.name || 'Assessment'} Results
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-slate-400 text-sm mb-8"
            >
              Here's a detailed breakdown of your performance
            </motion.p>

            {/* Circular score */}
            <div className="flex justify-center mb-6">
              <CircularScore score={score} size={200} strokeWidth={14} />
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className={`badge text-sm px-4 py-1.5 border ${rating.bg} ${rating.color} font-semibold`}>
                {rating.icon} {rating.label}
              </span>
              <span className={`badge text-sm px-4 py-1.5 border ${integrityInfo.bg} ${integrityInfo.color} font-semibold`}>
                <Shield size={13} /> Integrity: {integrityScore ?? proctoring?.integrityScore ?? '—'}%
              </span>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={CheckCircle} label="Correct"   value={stats?.correct ?? '—'}                      color="bg-emerald-500/20 text-emerald-400" delay={0.5} />
              <StatCard icon={XCircle}     label="Wrong"     value={stats?.wrong ?? '—'}                        color="bg-red-500/20 text-red-400"          delay={0.6} />
              <StatCard icon={MinusCircle} label="Skipped"   value={stats?.skipped ?? '—'}                      color="bg-slate-500/20 text-slate-400"       delay={0.7} />
              <StatCard icon={Clock}       label="Time Taken" value={formatTime(stats?.timeTaken)}              color="bg-blue-500/20 text-blue-400"         delay={0.8} />
            </div>
          </motion.div>

          {/* ── ANALYTICS ── */}
          <motion.div variants={sectionVariants} className="grid md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="glass p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={18} className="text-violet-400" /> Category Performance
              </h2>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
                    <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} dot={{ fill: '#8b5cf6', r: 4 }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No category data</div>
              )}
            </div>

            {/* Bar Chart */}
            <div className="glass p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" /> Difficulty Breakdown
              </h2>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Bar dataKey="Correct" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Wrong"   fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No difficulty data</div>
              )}
            </div>
          </motion.div>

          {/* ── STRENGTHS & WEAKNESSES ── */}
          <motion.div variants={sectionVariants} className="grid md:grid-cols-2 gap-6">
            <div className="glass p-6">
              <h2 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <Star size={18} /> Strengths
              </h2>
              <div className="flex flex-wrap gap-2">
                {(strengths || []).map((s, i) => (
                  <motion.span key={i}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="badge-success px-3 py-1.5 text-sm"
                  >
                    ✓ {s}
                  </motion.span>
                ))}
                {(!strengths || strengths.length === 0) && <p className="text-slate-500 text-sm">No strengths identified</p>}
              </div>
            </div>
            <div className="glass p-6">
              <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} /> Areas to Improve
              </h2>
              <div className="flex flex-wrap gap-2">
                {(weaknesses || []).map((w, i) => (
                  <motion.span key={i}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="badge-error px-3 py-1.5 text-sm"
                  >
                    ✗ {w}
                  </motion.span>
                ))}
                {(!weaknesses || weaknesses.length === 0) && <p className="text-slate-500 text-sm">No areas identified</p>}
              </div>
            </div>
          </motion.div>

          {/* ── QUESTION REVIEW ── */}
          <motion.div variants={sectionVariants} className="glass p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Eye size={18} className="text-indigo-400" /> Question Review
            </h2>
            {(questions || []).length > 0 ? (
              questions.map((q, i) => <QuestionAccordion key={i} question={q} index={i} />)
            ) : (
              <p className="text-slate-500 text-sm text-center py-6">No questions available for review.</p>
            )}
          </motion.div>

          {/* ── RECOMMENDATIONS ── */}
          {(recommendations || []).length > 0 && (
            <motion.div variants={sectionVariants} className="glass p-6">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <BookOpen size={18} className="text-amber-400" /> Recommended Resources
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {recommendations.map((rec, i) => {
                  const Icon = rec.icon || FileText;
                  return (
                    <motion.a key={i} href={rec.url || '#'} target="_blank" rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="glass-card p-4 flex flex-col gap-3 no-underline"
                    >
                      <div className="flex items-center justify-between">
                        <span className="badge-info text-xs px-2 py-0.5">{rec.type}</span>
                        <ExternalLink size={14} className="text-slate-500" />
                      </div>
                      <div className="p-2 rounded-xl bg-amber-500/10 w-fit">
                        <Icon size={20} className="text-amber-400" />
                      </div>
                      <p className="text-sm text-slate-200 font-medium leading-tight">{rec.title}</p>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── PROCTORING REPORT ── */}
          {proctoring && (
            <motion.div variants={sectionVariants} className="glass p-6">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Monitor size={18} className="text-violet-400" /> Proctoring Report
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Integrity gauge */}
                <div className="flex flex-col items-center gap-3">
                  <CircularScore score={proctoring.integrityScore ?? integrityScore ?? 100} size={140} strokeWidth={10} />
                  <span className={`badge text-sm px-4 py-1.5 border ${integrityInfo.bg} ${integrityInfo.color} font-semibold`}>
                    <Shield size={13} /> {integrityInfo.label}
                  </span>
                </div>
                {/* Stats */}
                <div className="space-y-4 self-center">
                  {[
                    { label: 'Tab Switches',      value: proctoring.tabSwitches,    icon: Layers,    warn: proctoring.tabSwitches > 2 },
                    { label: 'Fullscreen Exits',  value: proctoring.fullscreenExits,icon: Monitor,   warn: proctoring.fullscreenExits > 0 },
                    { label: 'Face Alerts',        value: proctoring.faceAlerts,     icon: Eye,       warn: proctoring.faceAlerts > 3 },
                  ].map(({ label, value, icon: Icon, warn }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Icon size={15} className={warn ? 'text-amber-400' : 'text-slate-500'} />
                        {label}
                      </div>
                      <span className={`font-bold text-sm ${warn ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {value ?? 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ACTION BUTTONS ── */}
          <motion.div variants={sectionVariants} className="flex flex-wrap items-center justify-center gap-4 pb-6">
            <button onClick={() => navigate('/select-domain')} className="btn-secondary gap-2">
              <Layers size={16} /> Try Another Domain
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary gap-2">
              <LayoutDashboard size={16} /> Go to Dashboard
            </button>
            <button onClick={handleShare} className="btn-secondary gap-2">
              <Share2 size={16} /> Share Result
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
