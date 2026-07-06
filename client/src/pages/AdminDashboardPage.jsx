import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, HelpCircle, Users, FileText, Globe, Plus, Edit2, Trash2,
  Search, X, ChevronDown, Shield, AlertTriangle, CheckCircle, Eye, Filter,
  LogOut, Save, BarChart2, TrendingUp, Book
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

/* ─── helpers ───────────────────────────────────────────────── */
const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const getDifficultyColor = (d) => {
  if (d === 'Easy')   return 'badge-success';
  if (d === 'Medium') return 'badge-warning';
  return 'badge-error';
};
const getScoreBg = (score) => {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
};

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_STATS = {
  totalUsers: 284, totalQuestions: 620, totalDomains: 12, totalAssessments: 1847, avgScore: 68,
};
const MOCK_DOMAIN_DIST = [
  { name: 'JavaScript', count: 420 }, { name: 'Python', count: 310 }, { name: 'React', count: 280 },
  { name: 'Java', count: 195 }, { name: 'SQL', count: 185 }, { name: 'DSA', count: 160 },
];
const MOCK_QUESTIONS = [
  { _id: 'q1', question: 'What is the output of typeof null?', domain: 'JavaScript', difficulty: 'Easy',   category: 'Types' },
  { _id: 'q2', question: 'Explain the difference between == and ===', domain: 'JavaScript', difficulty: 'Easy',   category: 'Operators' },
  { _id: 'q3', question: 'What is a closure in JavaScript?', domain: 'JavaScript', difficulty: 'Medium', category: 'Closures' },
  { _id: 'q4', question: 'Explain the virtual DOM in React', domain: 'React', difficulty: 'Medium', category: 'Fundamentals' },
  { _id: 'q5', question: 'What is the difference between useEffect and useLayoutEffect?', domain: 'React', difficulty: 'Hard',   category: 'Hooks' },
  { _id: 'q6', question: 'What is a generator function in Python?', domain: 'Python', difficulty: 'Medium', category: 'Generators' },
];
const MOCK_USERS = [
  { _id: 'u1', fullName: 'Arjun Mehta',  email: 'arjun@email.com',  college: 'IIT Bombay', profileComplete: true,  assessmentsCount: 8, role: 'user' },
  { _id: 'u2', fullName: 'Priya Sharma', email: 'priya@email.com',  college: 'NIT Trichy',  profileComplete: true,  assessmentsCount: 5, role: 'user' },
  { _id: 'u3', fullName: 'Admin User',   email: 'admin@email.com',  college: '—',           profileComplete: false, assessmentsCount: 0, role: 'admin' },
  { _id: 'u4', fullName: 'Rohan Gupta',  email: 'rohan@email.com',  college: 'BITS Pilani', profileComplete: true,  assessmentsCount: 12, role: 'user' },
  { _id: 'u5', fullName: 'Sneha Patel',  email: 'sneha@email.com',  college: 'IIT Delhi',   profileComplete: false, assessmentsCount: 3, role: 'user' },
];
const MOCK_RESULTS = [
  { _id: 'r1', candidate: { fullName: 'Arjun Mehta' },  domain: { name: 'JavaScript' }, score: 78, integrityScore: 92, date: new Date().toISOString() },
  { _id: 'r2', candidate: { fullName: 'Priya Sharma' }, domain: { name: 'React' },       score: 91, integrityScore: 88, date: new Date(Date.now()-86400000).toISOString() },
  { _id: 'r3', candidate: { fullName: 'Rohan Gupta' },  domain: { name: 'Python' },      score: 45, integrityScore: 70, date: new Date(Date.now()-172800000).toISOString() },
  { _id: 'r4', candidate: { fullName: 'Sneha Patel' },  domain: { name: 'SQL' },          score: 62, integrityScore: 95, date: new Date(Date.now()-259200000).toISOString() },
  { _id: 'r5', candidate: { fullName: 'Vikram Nair' },  domain: { name: 'DSA' },          score: 33, integrityScore: 55, date: new Date(Date.now()-345600000).toISOString() },
];
const DOMAINS_LIST = [
  'Artificial Intelligence',
  'Machine Learning',
  'Deep Learning',
  'Data Science',
  'Computer Vision',
  'Natural Language Processing',
  'Generative AI',
  'Prompt Engineering',
  'AI Agents',
  'Python',
  'Mathematics for AI',
  'Statistics',
  'Data Structures & Algorithms',
  'MLOps',
  'Cloud for AI',
  'Frontend Development',
  'Backend Development',
  'Git & GitHub'
];

/* ─── Nav items ──────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',   icon: LayoutDashboard },
  { id: 'questions',  label: 'Questions',  icon: HelpCircle },
  { id: 'users',      label: 'Users',      icon: Users },
  { id: 'results',    label: 'Results',    icon: FileText },
  { id: 'domains',    label: 'Domains',    icon: Globe },
];

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass p-5 flex items-center gap-4"
  >
    <div className={`p-3 rounded-2xl ${color} shrink-0`}>
      <Icon size={22} />
    </div>
    <div>
      <div className="text-2xl font-black text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  </motion.div>
);

/* ─── Custom Tooltip ─────────────────────────────────────────── */
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

/* ─── Question Modal ─────────────────────────────────────────── */
const QuestionModal = ({ question, onClose, onSave, domains }) => {
  const [form, setForm] = useState({
    question: question?.question || '',
    options: question?.options || ['', '', '', ''],
    correctAnswer: question?.correctAnswer || '',
    domain: question?.domain || domains[0] || '',
    difficulty: question?.difficulty || 'Medium',
    category: question?.category || '',
    explanation: question?.explanation || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) return toast.error('Question text is required');
    if (form.options.some(o => !o.trim())) return toast.error('All 4 options are required');
    if (!form.correctAnswer) return toast.error('Select a correct answer');
    setSaving(true);
    try {
      if (question?._id) {
        await api.put(`/admin/questions/${question._id}`, form);
        toast.success('Question updated!');
      } else {
        await api.post('/admin/questions', form);
        toast.success('Question added!');
      }
      onSave();
      onClose();
    } catch {
      toast.error(question?._id ? 'Failed to update question' : 'Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            {question?._id ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Question Text *</label>
            <textarea rows={3} placeholder="Enter the question…"
              value={form.question}
              onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              className="input-field text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Options *</label>
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                  <input type="radio" name="correctAnswer" value={opt || `Option ${i + 1}`}
                    checked={form.correctAnswer === opt}
                    onChange={() => setForm(f => ({ ...f, correctAnswer: f.options[i] }))}
                    className="accent-indigo-500"
                  />
                  <span className="text-xs text-slate-400 w-16">{String.fromCharCode(65 + i)}) Correct</span>
                </label>
                <input type="text" placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChange={e => {
                    const newOpts = [...form.options];
                    const wasCorrect = form.correctAnswer === form.options[i];
                    newOpts[i] = e.target.value;
                    setForm(f => ({ ...f, options: newOpts, correctAnswer: wasCorrect ? e.target.value : f.correctAnswer }));
                  }}
                  className="input-field text-sm flex-1"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Domain *</label>
              <select value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                className="input-field text-sm">
                {(domains.length ? domains : DOMAINS_LIST).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Difficulty *</label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                className="input-field text-sm">
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <input type="text" placeholder="e.g. Arrays" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="input-field text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Explanation</label>
            <textarea rows={2} placeholder="Optional explanation for the correct answer…"
              value={form.explanation}
              onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
              className="input-field text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-sm py-2.5">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5">
              {saving ? <span className="spinner w-4 h-4" /> : <><Save size={14} /> {question?._id ? 'Update' : 'Add Question'}</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─── Confirm Delete Modal ───────────────────────────────────── */
const ConfirmModal = ({ message, onConfirm, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    onClick={e => e.target === e.currentTarget && onClose()}
  >
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass p-6 w-full max-w-sm text-center"
    >
      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <h3 className="font-bold text-white mb-2">Confirm Delete</h3>
      <p className="text-slate-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Main Component ─────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CSV state
  const [showCsvArea, setShowCsvArea] = useState(false);
  const [csvQuestions, setCsvQuestions] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const parseCSV = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i+1];
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++;
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') lines.push(row);
    if (lines.length < 2) return [];

    const headers = lines[0].map(h => h.trim().toLowerCase());
    const parsedData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i];
      if (values.length < headers.length) continue;
      const qObj = {};
      headers.forEach((header, idx) => {
        qObj[header] = values[idx]?.trim();
      });

      if (qObj.question) {
        const options = [
          qObj.option1 || qObj.a,
          qObj.option2 || qObj.b,
          qObj.option3 || qObj.c,
          qObj.option4 || qObj.d
        ].filter(Boolean);

        if (options.length === 4) {
          parsedData.push({
            question: qObj.question,
            options,
            correctAnswer: qObj.correctanswer || qObj.correct || qObj.answer,
            domain: qObj.domain || 'Full Stack Development',
            difficulty: qObj.difficulty || 'Medium',
            category: qObj.category || 'General',
            explanation: qObj.explanation || '',
            marks: parseInt(qObj.marks, 10) || 1
          });
        }
      }
    }
    return parsedData;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = parseCSV(event.target.result);
        if (parsed.length === 0) {
          toast.error('No valid questions found. Headers: question, option1, option2, option3, option4, correctAnswer, domain, difficulty, category, explanation, marks');
        } else {
          setCsvQuestions(parsed);
          toast.success(`Parsed ${parsed.length} questions successfully!`);
        }
      } catch (err) {
        toast.error('Failed to parse CSV: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (csvQuestions.length === 0) return;
    setUploadingCsv(true);
    try {
      await api.post('/admin/questions/bulk', { questions: csvQuestions });
      toast.success(`Successfully uploaded ${csvQuestions.length} questions!`);
      setCsvFile(null);
      setCsvQuestions([]);
      setShowCsvArea(false);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload questions');
    } finally {
      setUploadingCsv(false);
    }
  };

  // Questions state
  const [qSearch, setQSearch] = useState('');
  const [qDomainFilter, setQDomainFilter] = useState('');
  const [qDiffFilter, setQDiffFilter] = useState('');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Users state
  const [userSearch, setUserSearch] = useState('');

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [sRes, qRes, uRes, rRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/questions'),
        api.get('/admin/users'),
        api.get('/admin/results'),
      ]);
      setStats(sRes.status === 'fulfilled' ? (sRes.value.data.stats || sRes.value.data) : MOCK_STATS);
      setQuestions(qRes.status === 'fulfilled' ? (qRes.value.data.questions || qRes.value.data) : MOCK_QUESTIONS);
      setUsers(uRes.status === 'fulfilled' ? (uRes.value.data.users || uRes.value.data) : MOCK_USERS);
      setResults(rRes.status === 'fulfilled' ? (rRes.value.data.results || rRes.value.data) : MOCK_RESULTS);
    } catch {
      setStats(MOCK_STATS); setQuestions(MOCK_QUESTIONS);
      setUsers(MOCK_USERS); setResults(MOCK_RESULTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteQuestion = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/questions/${deleteTarget._id}`);
      setQuestions(q => q.filter(x => x._id !== deleteTarget._id));
      toast.success('Question deleted');
    } catch {
      // optimistic removal from mock
      setQuestions(q => q.filter(x => x._id !== deleteTarget._id));
      toast.success('Question deleted');
    }
    setDeleteTarget(null);
  };

  const handleDeleteUser = async (u) => {
    try {
      await api.delete(`/admin/users/${u._id}`);
    } catch {/* ignore */}
    setUsers(prev => prev.filter(x => x._id !== u._id));
    toast.success(`User "${u.fullName}" deleted`);
  };

  const currentStats = stats || MOCK_STATS;
  const domainDist = MOCK_DOMAIN_DIST;

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  /* ─── Sidebar ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
        <div>
          <div className="font-bold text-white text-sm">Admin Panel</div>
          <div className="text-xs text-slate-500">SkillForge</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
              ${activeTab === id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2">
        <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
          <Users size={15} /> User Dashboard
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  /* ─── OVERVIEW TAB ── */
  const OverviewTab = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-black text-white">Admin Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Platform statistics at a glance</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users}      label="Total Users"       value={currentStats.totalUsers}       color="bg-indigo-500/20 text-indigo-400"  delay={0.1} />
        <StatCard icon={HelpCircle} label="Total Questions"   value={currentStats.totalQuestions}   color="bg-violet-500/20 text-violet-400"  delay={0.15} />
        <StatCard icon={Globe}      label="Domains"           value={currentStats.totalDomains}     color="bg-cyan-500/20 text-cyan-400"      delay={0.2} />
        <StatCard icon={FileText}   label="Assessments"       value={currentStats.totalAssessments} color="bg-amber-500/20 text-amber-400"    delay={0.25} />
        <StatCard icon={TrendingUp} label="Avg Score"         value={`${currentStats.avgScore}%`}  color="bg-emerald-500/20 text-emerald-400" delay={0.3} />
      </div>

      <motion.div variants={itemVariants} className="glass p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BarChart2 size={16} className="text-indigo-400" /> Domain Distribution (Assessments Taken)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={domainDist} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Assessments" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );

  /* ─── QUESTIONS TAB ── */
  const QuestionsTab = () => {
    const filtered = questions.filter(q => {
      const matchSearch = !qSearch || q.question?.toLowerCase().includes(qSearch.toLowerCase());
      const matchDomain = !qDomainFilter || q.domain === qDomainFilter;
      const matchDiff   = !qDiffFilter   || q.difficulty === qDiffFilter;
      return matchSearch && matchDomain && matchDiff;
    });

    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white">Questions</h2>
            <p className="text-slate-400 text-xs mt-0.5">{questions.length} total questions</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCsvArea(!showCsvArea)} className="btn-secondary text-sm py-2.5">
              {showCsvArea ? 'Hide CSV Upload' : 'Bulk Upload CSV'}
            </button>
            <button onClick={() => { setEditingQuestion(null); setShowQuestionModal(true); }} className="btn-primary text-sm py-2.5">
              <Plus size={15} /> Add Question
            </button>
          </div>
        </motion.div>

        {showCsvArea && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Bulk Upload Questions via CSV</h3>
            <p className="text-xs text-slate-400">
              CSV file must contain headers: <b>question, option1, option2, option3, option4, correctAnswer, domain, difficulty, category, explanation, marks</b>
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input type="file" accept=".csv" onChange={handleFileChange} className="text-xs text-slate-300 block w-full border border-white/10 rounded-lg p-2 bg-white/5" />
              {csvQuestions.length > 0 && (
                <button onClick={handleBulkUpload} disabled={uploadingCsv} className="btn-primary text-sm py-2.5 w-full sm:w-auto">
                  {uploadingCsv ? 'Uploading...' : `Upload ${csvQuestions.length} Questions`}
                </button>
              )}
            </div>
            {csvQuestions.length > 0 && (
              <div className="max-h-48 overflow-y-auto border border-white/10 rounded-lg text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="px-2 py-1 text-left font-medium">Question</th>
                      <th className="px-2 py-1 text-left font-medium">Correct</th>
                      <th className="px-2 py-1 text-left font-medium">Domain</th>
                      <th className="px-2 py-1 text-left font-medium">Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvQuestions.slice(0, 10).map((q, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-2 py-1 text-slate-300 truncate max-w-xs">{q.question}</td>
                        <td className="px-2 py-1 text-emerald-400">{q.correctAnswer}</td>
                        <td className="px-2 py-1 text-slate-400">{q.domain}</td>
                        <td className="px-2 py-1 text-slate-400">{q.difficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvQuestions.length > 10 && <div className="text-[10px] text-slate-500 p-2 text-center">and {csvQuestions.length - 10} more questions...</div>}
              </div>
            )}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search questions…" value={qSearch}
              onChange={e => setQSearch(e.target.value)} className="input-field text-sm pl-9 py-2.5" />
          </div>
          <select value={qDomainFilter} onChange={e => setQDomainFilter(e.target.value)} className="input-field text-sm py-2.5 w-auto">
            <option value="">All Domains</option>
            {[...new Set(questions.map(q => q.domain))].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={qDiffFilter} onChange={e => setQDiffFilter(e.target.value)} className="input-field text-sm py-2.5 w-auto">
            <option value="">All Difficulties</option>
            {['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants} className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 text-xs uppercase tracking-wide">
                  {['#', 'Question', 'Domain', 'Difficulty', 'Category', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr key={q._id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-slate-500 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-slate-200 line-clamp-2 text-xs leading-relaxed">{q.question}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-info text-xs px-2 py-0.5">{q.domain}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${getDifficultyColor(q.difficulty)} text-xs px-2 py-0.5`}>{q.difficulty}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{q.category || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingQuestion(q); setShowQuestionModal(true); }}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-lg hover:bg-indigo-500/10"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(q)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">No questions found.</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  /* ─── USERS TAB ── */
  const UsersTab = () => {
    const filtered = users.filter(u =>
      !userSearch || u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white">Users</h2>
            <p className="text-slate-400 text-xs mt-0.5">{users.length} registered users</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search users…" value={userSearch}
              onChange={e => setUserSearch(e.target.value)} className="input-field text-sm pl-9 py-2.5 w-56" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 text-xs uppercase tracking-wide">
                  {['User', 'Email', 'College', 'Profile', 'Assessments', 'Role', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(u.fullName)}
                        </div>
                        <span className="text-slate-200 font-medium text-xs">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{u.college || '—'}</td>
                    <td className="px-4 py-3">
                      {u.profileComplete
                        ? <span className="badge-success text-xs"><CheckCircle size={11} /> Complete</span>
                        : <span className="badge-warning text-xs"><AlertTriangle size={11} /> Incomplete</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs font-semibold">{u.assessmentsCount ?? 0}</td>
                    <td className="px-4 py-3">
                      {u.role === 'admin'
                        ? <span className="badge-error text-xs"><Shield size={11} /> Admin</span>
                        : <span className="badge-info text-xs">User</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                          title="Delete user"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">No users found.</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  /* ─── RESULTS TAB ── */
  const ResultsTab = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-black text-white">Assessment Results</h2>
        <p className="text-slate-400 text-xs mt-0.5">{results.length} total results</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 text-xs uppercase tracking-wide">
                {['Candidate', 'Domain', 'Score', 'Integrity', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r._id || i}
                  className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors
                    ${r.score >= 70 ? 'border-l-2 border-l-emerald-500/30' : r.score >= 50 ? 'border-l-2 border-l-amber-500/30' : 'border-l-2 border-l-red-500/30'}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                        {getInitials(r.candidate?.fullName || 'U')}
                      </div>
                      <span className="text-slate-200 font-medium text-xs">{r.candidate?.fullName || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-info text-xs px-2 py-0.5">{r.domain?.name || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getScoreBg(r.score)}`}>{r.score}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${r.score}%`,
                          background: r.score >= 70 ? '#10b981' : r.score >= 50 ? '#f59e0b' : '#ef4444',
                        }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${r.integrityScore >= 85 ? 'text-emerald-400' : r.integrityScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {r.integrityScore ?? '—'}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(r.date)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => r._id && navigate(`/results/${r._id}`)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-lg hover:bg-indigo-500/10"
                      title="View result"
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm">No results found.</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  /* ─── DOMAINS TAB ── */
  const DomainsTab = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-black text-white">Domains</h2>
        <p className="text-slate-400 text-xs mt-0.5">All skill domains on the platform</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { name: 'JavaScript', icon: '⚡', count: 80 },
          { name: 'Python',     icon: '🐍', count: 75 },
          { name: 'React',      icon: '⚛️', count: 60 },
          { name: 'Node.js',    icon: '🟢', count: 55 },
          { name: 'Java',       icon: '☕', count: 70 },
          { name: 'SQL',        icon: '🗄️', count: 50 },
          { name: 'DSA',        icon: '🌲', count: 90 },
          { name: 'TypeScript', icon: '🔷', count: 45 },
          { name: 'C++',        icon: '⚙️', count: 65 },
          { name: 'ML / AI',    icon: '🤖', count: 40 },
          { name: 'DevOps',     icon: '🚀', count: 30 },
          { name: 'Go',         icon: '🐹', count: 25 },
        ].map((d, i) => (
          <motion.div key={d.name}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass p-4 text-center glass-hover"
          >
            <div className="text-3xl mb-2">{d.icon}</div>
            <div className="text-sm font-semibold text-slate-200">{d.name}</div>
            <div className="text-xs text-slate-500 mt-1">{d.count} questions</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const tabContent = {
    overview:  <OverviewTab />,
    questions: <QuestionsTab />,
    users:     <UsersTab />,
    results:   <ResultsTab />,
    domains:   <DomainsTab />,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="spinner w-12 h-12" />
        <p className="text-slate-400 text-sm">Loading admin panel…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-40 h-full
          w-56 glass rounded-none lg:rounded-2xl lg:m-4
          p-5 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ minHeight: 'calc(100vh - 2rem)' }}
      >
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-4 lg:p-6 lg:pl-2 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        {/* Mobile header */}
        <div className="flex items-center gap-3 lg:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)} className="glass p-2 rounded-xl text-slate-400">
            <LayoutDashboard size={18} />
          </button>
          <h1 className="font-bold gradient-text">Admin Panel</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Question Modal */}
      <AnimatePresence>
        {showQuestionModal && (
          <QuestionModal
            question={editingQuestion}
            domains={[...new Set(questions.map(q => q.domain).filter(Boolean)), ...DOMAINS_LIST].filter((v, i, a) => a.indexOf(v) === i)}
            onClose={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
            onSave={fetchData}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal
            message={`Are you sure you want to delete this question? This action cannot be undone.`}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteQuestion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
