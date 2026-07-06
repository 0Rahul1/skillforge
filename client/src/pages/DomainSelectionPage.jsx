import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, BookOpen, Zap, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Navbar from '../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';

export default function DomainSelectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await api.get('/assessments/domains');
        if (response.data?.success) {
          setDomains(response.data.domains);
        }
      } catch (error) {
        console.error('Error fetching domains:', error);
        toast.error('Failed to load learning domains');
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  const handleStartQuizClick = (domain) => {
    setConfirmModal(domain);
  };

  const handleConfirmStart = async () => {
    if (!confirmModal) return;
    const domain = confirmModal;
    setConfirmModal(null);

    const loadingToast = toast.loading('Initializing quiz...');
    try {
      // Save selected domain to profile
      await api.put('/users/profile', { selectedDomain: domain._id });
      toast.success(`Starting ${domain.name} quiz!`, { id: loadingToast });
      
      // Navigate to assessment
      navigate('/assessment', {
        state: {
          domainId: domain._id,
          domainName: domain.name,
          domain: domain,
        },
      });
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to initialize quiz session', { id: loadingToast });
    }
  };

  // Filter domains based on search and selected difficulty tab
  const filteredDomains = domains.filter((domain) => {
    const matchesSearch = domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
      domain.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight mb-4"
          >
            Choose Your Learning Domain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            Select an area to test your comprehension. Score above 80% to earn certificates.
          </motion.p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>

          {/* Difficulty tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-full md:w-auto">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/[0.02] border border-white/5 rounded-2xl h-60" />
            ))}
          </div>
        ) : filteredDomains.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <p className="text-slate-400 text-sm">No domains matching your filters were found.</p>
          </div>
        ) : (
          /* Domains Grid */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDomains.map((domain) => (
              <motion.div
                layout
                key={domain._id}
                whileHover={{ y: -4 }}
                className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 rounded-2xl p-6 transition-all relative overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Top Bar decoration based on difficulty */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${
                    domain.gradient || 'from-indigo-500 to-purple-600'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{domain.icon || '🧠'}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        domain.difficulty === 'beginner'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : domain.difficulty === 'intermediate'
                          ? 'bg-blue-500/10 text-blue-400'
                          : domain.difficulty === 'advanced'
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {domain.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{domain.name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                    {domain.description}
                  </p>

                  {/* Topics chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {domain.topics?.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded-md">
                        {topic}
                      </span>
                    ))}
                    {domain.topics?.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-semibold pl-1">
                        +{domain.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Info & Button */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {domain.avgDuration || 30}m
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {domain.questionCount || 5} Qs
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuizClick(domain)}
                    className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white transition-all duration-300 shadow-md"
                  >
                    Start Quiz
                    <Zap className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative z-10 shadow-2xl"
            >
              <button
                onClick={() => setConfirmModal(null)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-5xl inline-block mb-4">{confirmModal.icon || '🧠'}</span>
                <h3 className="text-xl font-bold text-white mb-2">Begin {confirmModal.name} Quiz?</h3>
                <p className="text-slate-400 text-xs sm:text-sm">
                  You are about to start a monitored quiz containing {confirmModal.questionCount || 5} questions.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Duration:</span>
                  <span className="font-semibold">{confirmModal.avgDuration || 30} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Questions:</span>
                  <span className="font-semibold">{confirmModal.questionCount || 5} questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Difficulty Level:</span>
                  <span className="font-semibold capitalize text-indigo-400">{confirmModal.difficulty}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStart}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Start Attempt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
