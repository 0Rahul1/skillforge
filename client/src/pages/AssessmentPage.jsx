import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  SkipForward,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Menu,
  X,
  LayoutGrid,
  Eye,
  Shield,
  Maximize2,
} from 'lucide-react';

import api from '../services/api.js';
import { useTimer } from '../hooks/useTimer.js';
import FaceMonitor from '../components/proctoring/FaceMonitor.jsx';

// ─── Constants ─────────────────────────────────────────────────────────────────
const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// ─── Utility: derive palette status for a question ─────────────────────────────
const getQuestionStatus = (answer, currentIndex, qIndex) => {
  if (qIndex === currentIndex) return 'current';
  if (answer?.isMarkedForReview) return 'review';
  if (answer?.selectedAnswer != null) return 'answered';
  return 'unanswered';
};

const paletteBtnClass = (status) => {
  const base = 'question-palette-btn';
  switch (status) {
    case 'current':    return `${base} palette-current`;
    case 'answered':   return `${base} palette-answered`;
    case 'review':     return `${base} palette-review`;
    default:           return `${base} palette-unanswered`;
  }
};

const difficultyBadgeClass = (level) => {
  switch ((level || '').toLowerCase()) {
    case 'easy':   return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard':   return 'badge-error';
    default:       return 'badge-info';
  }
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

/** Question palette side-bar panel */
const QuestionPalette = ({ questions, answers, currentIndex, onJump, timerDisplay, isWarning, isCritical }) => (
  <div className="flex flex-col h-full p-4 gap-4">
    {/* Timer display in sidebar */}
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-lg font-bold
      transition-all duration-300
      ${isCritical
        ? 'bg-red-500/15 border-red-500/40 text-red-400 animate-pulse'
        : isWarning
        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
        : 'bg-white/5 border-white/10 text-slate-200'}
    `}>
      <Clock size={16} className="shrink-0" />
      <span className="tabular-nums">{timerDisplay}</span>
    </div>

    {/* Question grid */}
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
        Question Palette
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((_, idx) => {
          const ans = answers[idx];
          const status = getQuestionStatus(ans, currentIndex, idx);
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onJump(idx)}
              className={paletteBtnClass(status)}
            >
              {idx + 1}
            </motion.button>
          );
        })}
      </div>
    </div>

    {/* Legend */}
    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
      <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Legend</p>
      {[
        { cls: 'palette-current',    label: 'Current' },
        { cls: 'palette-answered',   label: 'Answered' },
        { cls: 'palette-review',     label: 'Marked for review' },
        { cls: 'palette-unanswered', label: 'Not answered' },
      ].map(({ cls, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`question-palette-btn ${cls} w-6 h-6 text-[10px]`}>&bull;</div>
          <span className="text-[11px] text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

/** Confirmation modal */
const ConfirmModal = ({ onConfirm, onCancel, answeredCount, unansweredCount, markedCount }) => (
  <motion.div
    key="confirm-modal"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[8000] flex items-center justify-center p-4"
    style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass rounded-2xl p-8 max-w-md w-full border border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
          <AlertTriangle size={24} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Confirm Submission</h3>
          <p className="text-slate-400 text-sm">This action cannot be undone.</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-400" />
            <span className="text-sm text-slate-300">Answered</span>
          </div>
          <span className="font-bold text-emerald-400">{answeredCount}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2">
            <XCircle size={15} className="text-red-400" />
            <span className="text-sm text-slate-300">Unanswered</span>
          </div>
          <span className="font-bold text-red-400">{unansweredCount}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2">
            <Flag size={15} className="text-amber-400" />
            <span className="text-sm text-slate-300">Marked for review</span>
          </div>
          <span className="font-bold text-amber-400">{markedCount}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1">
          Go Back
        </button>
        <button onClick={onConfirm} className="btn-primary flex-1 bg-gradient-to-r from-red-500 to-rose-600">
          <Send size={15} />
          Final Submit
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/** Review screen shown before final submit */
const ReviewScreen = ({ questions, answers, onGoBack, onSubmit, domain }) => {
  const answered  = answers.filter((a) => a?.selectedAnswer != null).length;
  const marked    = answers.filter((a) => a?.isMarkedForReview).length;
  const unanswered = questions.length - answered;

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-[#020617] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-4">
          <button onClick={onGoBack} className="btn-ghost">
            <ChevronLeft size={18} />
            Back to Exam
          </button>
          <h2 className="text-xl font-bold gradient-text flex-1">Review Answers — {domain}</h2>
        </div>

        <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Answered', value: answered, color: 'emerald', icon: CheckCircle },
              { label: 'Unanswered', value: unanswered, color: 'red', icon: XCircle },
              { label: 'Marked', value: marked, color: 'amber', icon: Flag },
            ].map(({ label, value, color, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`glass rounded-2xl p-5 border border-${color}-500/20 bg-${color}-500/5`}
              >
                <Icon size={20} className={`text-${color}-400 mb-2`} />
                <p className={`text-3xl font-black text-${color}-400`}>{value}</p>
                <p className="text-slate-400 text-sm mt-1">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Question table */}
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Question</th>
                  <th className="text-center px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Answer</th>
                  <th className="text-center px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {questions.map((q, idx) => {
                  const ans = answers[idx];
                  const isAnswered = ans?.selectedAnswer != null;
                  const isMarked = ans?.isMarkedForReview;
                  return (
                    <tr key={q._id || idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-500 font-mono">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-300 max-w-[280px] truncate">
                        {q.question || q.text}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isAnswered ? (
                          <span className="font-bold text-primary-400">
                            {OPTION_LETTERS[q.options.indexOf(ans.selectedAnswer)] || '—'}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isMarked ? (
                          <span className="badge badge-warning">
                            <Flag size={10} /> Review
                          </span>
                        ) : isAnswered ? (
                          <span className="badge badge-success">
                            <CheckCircle size={10} /> Done
                          </span>
                        ) : (
                          <span className="badge badge-error">
                            <XCircle size={10} /> Skipped
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer action bar */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-white/[0.06] bg-[#020617]/90 backdrop-blur-xl flex items-center justify-between">
          <button onClick={onGoBack} className="btn-secondary">
            <ChevronLeft size={16} />
            Go Back
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #ef4444, #e11d48)' }}
          >
            <Send size={16} />
            Final Submit
          </button>
        </div>
      </motion.div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            answeredCount={answered}
            unansweredCount={unanswered}
            markedCount={marked}
            onConfirm={onSubmit}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Main AssessmentPage ────────────────────────────────────────────────────────
const AssessmentPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Router state ─────────────────────────────────────────────────────────────────────────────
  // Support both explicit keys (domainId, domainName) and nested domain object
  const domainId   = location.state?.domainId   || location.state?.domain?._id;
  const domainName = location.state?.domainName || location.state?.domain?.name || 'Assessment';

  // ── Assessment data ───────────────────────────────────────────────────────────
  const [assessmentId, setAssessmentId] = useState(null);
  const [questions, setQuestions]       = useState([]);
  const [duration, setDuration]         = useState(30);          // minutes
  const [isLoading, setIsLoading]       = useState(true);
  const [loadError, setLoadError]       = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  // ── Navigation & UI state ─────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [sidebarOpen, setSidebarOpen]     = useState(true);       // desktop sidebar
  const [showReview, setShowReview]       = useState(false);

  // ── Answer state ──────────────────────────────────────────────────────────────
  // answers[i] = { questionId, selectedAnswer (index or null), isMarkedForReview, timeSpent }
  const [answers, setAnswers] = useState([]);
  const questionStartTimeRef  = useRef(Date.now());

  // ── Proctoring state ──────────────────────────────────────────────────────────
  const [violations, setViolations]          = useState(0);
  const [tabSwitches, setTabSwitches]        = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const violationTimerRef = useRef(null);

  // ── Refs ──────────────────────────────────────────────────────────────────────
  const autoSaveIntervalRef = useRef(null);
  const assessmentIdRef     = useRef(null);
  const answersRef          = useRef([]);
  const violationsRef       = useRef(0);
  const tabSwitchesRef      = useRef(0);
  const submittedRef        = useRef(false);

  // Keep refs in sync
  useEffect(() => { assessmentIdRef.current = assessmentId; }, [assessmentId]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { violationsRef.current = violations; }, [violations]);
  useEffect(() => { tabSwitchesRef.current = tabSwitches; }, [tabSwitches]);
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);

  // ── Timer ─────────────────────────────────────────────────────────────────────
  const { seconds, formatTime, startTimer, stopTimer, resetTimer, isWarning, isCritical } =
    useTimer(duration * 60, () => {
      if (!submittedRef.current) {
        toast('⏰ Time\'s up! Auto-submitting...', { duration: 3000 });
        handleSubmit(true);
      }
    });

  // ─── Redirect if no domain ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!domainId) {
      navigate('/select-domain', { replace: true });
    }
  }, [domainId, navigate]);

  // ─── Start assessment API call ─────────────────────────────────────────────────
  useEffect(() => {
    if (!domainId) return;

    const startAssessment = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.post('/assessments/start', { domainId });

        // The server wraps the assessment inside data.assessment
        const assessmentData = data.assessment || data;
        const { _id, questions: qs, duration: dur, startTime } = assessmentData;

        if (!qs || qs.length === 0) {
          throw new Error('No questions available for this domain. Please contact an admin.');
        }

        setAssessmentId(_id);
        setQuestions(qs);
        setDuration(dur || 30);

        // Initialise blank answer array
        const blankAnswers = qs.map((q) => ({
          questionId: q._id || q.id,
          selectedAnswer: null,
          isMarkedForReview: false,
          timeSpent: 0,
        }));
        setAnswers(blankAnswers);

        // Compute remaining time if resuming
        if (startTime) {
          const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
          const remaining = Math.max(0, (dur || 30) * 60 - elapsed);
          resetTimer(remaining);
        } else {
          resetTimer((dur || 30) * 60);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('[AssessmentPage] Start failed:', err);
        const msg = err?.response?.data?.message || err?.message || 'Failed to start assessment. Please try again.';
        setLoadError(msg);
        setIsLoading(false);
      }
    };

    startAssessment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainId]);

  // ─── Start timer once loaded ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && questions.length > 0 && !submitted) {
      startTimer();
    }
  }, [isLoading, questions.length, submitted, startTimer]);

  // ─── Fullscreen management ─────────────────────────────────────────────────────
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen?.();
      } catch {
        // Fullscreen may be blocked; not critical
      }
    };

    if (!isLoading && questions.length > 0) {
      requestFullscreen();
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submittedRef.current) {
        setViolations((v) => v + 1);
        triggerViolationWarning('⚠️ Exiting fullscreen detected! Return to exam window.');
        // Attempt to re-enter fullscreen
        setTimeout(() => {
          document.documentElement.requestFullscreen?.().catch(() => {});
        }, 1000);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, questions.length]);

  // ─── Visibility / tab-switch detection ────────────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submittedRef.current) {
        setTabSwitches((t) => t + 1);
        setViolations((v) => v + 1);
        triggerViolationWarning('⚠️ Tab switch detected! This activity has been logged.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ─── Browser security: keyboard shortcuts & right-click ───────────────────────
  useEffect(() => {
    const preventShortcuts = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+A
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
        (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const preventContextMenu = (e) => e.preventDefault();

    const preventCopyPaste = (e) => {
      if (e.ctrlKey && ['c', 'C', 'v', 'V', 'x', 'X', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', preventShortcuts, true);
    document.addEventListener('keydown', preventCopyPaste, true);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('keydown', preventShortcuts, true);
      document.removeEventListener('keydown', preventCopyPaste, true);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  // ─── Auto-save every 30 seconds ───────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || !assessmentId || submitted) return;

    const save = async () => {
      try {
        await api.put(`/assessments/${assessmentIdRef.current}/save`, {
          answers: answersRef.current,
        });
      } catch {
        // Silent fail — auto-save is best-effort
      }
    };

    autoSaveIntervalRef.current = setInterval(save, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveIntervalRef.current);
  }, [isLoading, assessmentId, submitted]);

  // ─── Violation warning toast helper ───────────────────────────────────────────
  const triggerViolationWarning = useCallback((msg) => {
    toast.error(msg, {
      duration: 5000,
      style: {
        background: 'rgba(239,68,68,0.9)',
        color: '#fff',
        border: '1px solid rgba(239,68,68,0.5)',
        backdropFilter: 'blur(16px)',
        fontWeight: '600',
      },
      icon: '⚠️',
    });

    setShowViolationWarning(true);
    clearTimeout(violationTimerRef.current);
    violationTimerRef.current = setTimeout(() => setShowViolationWarning(false), 4000);
  }, []);

  // ─── Answer & navigation handlers ─────────────────────────────────────────────
  const selectAnswer = useCallback((optionText) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        selectedAnswer: optionText,
      };
      return next;
    });
  }, [currentIndex]);

  const toggleMarkForReview = useCallback(() => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        isMarkedForReview: !next[currentIndex]?.isMarkedForReview,
      };
      return next;
    });
  }, [currentIndex]);

  const accumulateTimeSpent = useCallback(() => {
    const elapsed = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        timeSpent: (next[currentIndex]?.timeSpent || 0) + elapsed,
      };
      return next;
    });
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  const goToQuestion = useCallback((idx) => {
    accumulateTimeSpent();
    setCurrentIndex(idx);
    questionStartTimeRef.current = Date.now();
  }, [accumulateTimeSpent]);

  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) goToQuestion(currentIndex + 1);
  }, [currentIndex, questions.length, goToQuestion]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  }, [currentIndex, goToQuestion]);

  const skipQuestion = useCallback(() => {
    accumulateTimeSpent();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
    questionStartTimeRef.current = Date.now();
  }, [currentIndex, questions.length, accumulateTimeSpent]);

  // ─── Submit handler ────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (submittedRef.current || isSubmitting) return;

    accumulateTimeSpent();
    stopTimer();
    clearInterval(autoSaveIntervalRef.current);
    setIsSubmitting(true);

    const proctoringData = {
      violations: violationsRef.current,
      tabSwitches: tabSwitchesRef.current,
      submittedAt: new Date().toISOString(),
      autoSubmitted: isAutoSubmit,
    };

    try {
      const { data } = await api.post(`/assessments/${assessmentIdRef.current}/submit`, {
        answers: answersRef.current,
        proctoringData,
      });

      setSubmitted(true);
      // Exit fullscreen before navigating
      document.exitFullscreen?.().catch(() => {});

      navigate(`/results/${data.resultId || data._id}`, {
        replace: true,
        state: { resultData: data },
      });
    } catch (err) {
      console.error('[AssessmentPage] Submit failed:', err);
      toast.error('Submission failed. Please try again.');
      setIsSubmitting(false);
      // Re-start timer if submit failed
      startTimer();
    }
  }, [isSubmitting, accumulateTimeSpent, stopTimer, startTimer, navigate]);

  // ─── Keyboard navigation ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (showReview) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
      // 1-4 to select option
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1;
        const optionVal = currentQuestion?.options?.[optionIdx];
        if (optionVal) selectAnswer(optionVal);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showReview, goNext, goPrev, selectAnswer]);

  // ─── Derived stats ─────────────────────────────────────────────────────────────
  const answeredCount  = useMemo(() => answers.filter((a) => a?.selectedAnswer != null).length, [answers]);
  const markedCount    = useMemo(() => answers.filter((a) => a?.isMarkedForReview).length, [answers]);
  const unansweredCount = questions.length - answeredCount;
  const progress        = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const currentQuestion = questions[currentIndex];
  const currentAnswer   = answers[currentIndex];

  // ─── Fullscreen request button ─────────────────────────────────────────────────
  const reEnterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {
      toast('Could not enter fullscreen. Please press F11.', { icon: 'ℹ️' });
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER STATES
  // ═══════════════════════════════════════════════════════════════════════════════

  // ── Loading skeleton ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="spinner mx-auto" style={{ width: 40, height: 40 }} />
          <p className="text-slate-400 font-medium">Preparing your assessment…</p>
          <p className="text-slate-600 text-sm">{domainName}</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <XCircle size={40} className="text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Failed to Start</h2>
          <p className="text-slate-400 text-sm">{loadError}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/select-domain')} className="btn-secondary flex-1">
              Go Back
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary flex-1">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Review screen ──────────────────────────────────────────────────────────────
  if (showReview) {
    return (
      <ReviewScreen
        questions={questions}
        answers={answers}
        domain={domainName}
        onGoBack={() => setShowReview(false)}
        onSubmit={() => handleSubmit(false)}
      />
    );
  }

  // ── No questions guard ─────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={40} className="text-amber-400 mx-auto mb-3" />
          <p className="text-slate-300">No questions available for this assessment.</p>
          <button onClick={() => navigate('/select-domain')} className="btn-secondary mt-4">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // MAIN EXAM UI
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div
      className="min-h-screen bg-[#020617] bg-grid flex flex-col select-none overflow-hidden"
      style={{ userSelect: 'none' }}
    >
      {/* ── Violation Warning Banner ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showViolationWarning && (
          <motion.div
            key="violation-banner"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="proctoring-warning"
          >
            <AlertTriangle size={18} />
            <span>Violation detected! {violations} total violation{violations !== 1 ? 's' : ''} logged.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════════════
          TOP BAR
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#020617]/90 backdrop-blur-xl z-40 shrink-0">
        {/* Sidebar toggle (desktop) */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="hidden md:flex btn-ghost p-2"
          title="Toggle question palette"
        >
          <LayoutGrid size={18} />
        </button>

        {/* Domain + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-primary-400 shrink-0" />
            <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider truncate">
              {domainName}
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-slate-500 text-xs">
              Q {currentIndex + 1} / {questions.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="progress-bar w-full max-w-xs hidden sm:block">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Timer (top-center) */}
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-base
          transition-all duration-300
          ${isCritical
            ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
            : isWarning
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
            : 'bg-white/5 border-white/10 text-slate-200'}
        `}>
          <Clock size={15} className="shrink-0" />
          <span className="tabular-nums">{formatTime()}</span>
        </div>

        {/* Fullscreen re-enter */}
        <button
          onClick={reEnterFullscreen}
          className="btn-ghost p-2"
          title="Enter fullscreen"
        >
          <Maximize2 size={16} />
        </button>

        {/* Answered stats */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle size={12} /> {answeredCount}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <XCircle size={12} /> {unansweredCount}
          </span>
          {markedCount > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <Flag size={12} /> {markedCount}
            </span>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={() => setShowReview(true)}
          disabled={isSubmitting}
          className="btn-primary text-sm py-2 px-4"
          style={{ background: 'linear-gradient(135deg, #ef4444, #e11d48)' }}
        >
          <Send size={14} />
          <span className="hidden sm:inline">Submit</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          BODY (Sidebar + Question + Proctoring)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="hidden md:block shrink-0 border-r border-white/[0.06] overflow-hidden bg-[#020617]/50"
              style={{ minWidth: 0 }}
            >
              <div className="w-[220px] h-full overflow-hidden">
                <QuestionPalette
                  questions={questions}
                  answers={answers}
                  currentIndex={currentIndex}
                  onJump={goToQuestion}
                  timerDisplay={formatTime()}
                  isWarning={isWarning}
                  isCritical={isCritical}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── CENTER: QUESTION CARD ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
          <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-4">

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="glass rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
              >
                {/* Question header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    {/* Question number badge */}
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 font-bold text-sm shrink-0">
                      {currentIndex + 1}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Question {currentIndex + 1} of {questions.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Difficulty badge */}
                    {currentQuestion?.difficulty && (
                      <span className={`badge ${difficultyBadgeClass(currentQuestion.difficulty)}`}>
                        {currentQuestion.difficulty}
                      </span>
                    )}
                    {/* Marked for review badge */}
                    {currentAnswer?.isMarkedForReview && (
                      <span className="badge badge-warning">
                        <Flag size={10} /> Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <div>
                  <p className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed">
                    {currentQuestion?.question || currentQuestion?.text || 'Question text unavailable.'}
                  </p>
                  {currentQuestion?.code && (
                    <pre className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] text-sm text-slate-300 font-mono overflow-x-auto">
                      <code>{currentQuestion.code}</code>
                    </pre>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {(currentQuestion?.options || []).map((opt, idx) => {
                    const isSelected = currentAnswer?.selectedAnswer === opt;
                    return (
                      <motion.button
                        key={idx}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => selectAnswer(opt)}
                        className={`option-btn ${isSelected ? 'option-selected' : ''}`}
                      >
                        {/* Letter badge */}
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0
                          transition-all duration-200
                          ${isSelected
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 text-slate-400 border border-white/10'}
                        `}>
                          {OPTION_LETTERS[idx]}
                        </div>
                        {/* Option text */}
                        <span className={`text-sm sm:text-base ${isSelected ? 'text-primary-200' : 'text-slate-300'}`}>
                          {typeof opt === 'string' ? opt : opt?.text || opt?.value || String(opt)}
                        </span>
                        {/* Selected checkmark */}
                        {isSelected && (
                          <CheckCircle size={16} className="text-primary-400 ml-auto shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── BOTTOM NAVIGATION BAR ──────────────────────────────────────── */}
          <div className="sticky bottom-0 px-4 py-3 border-t border-white/[0.06] bg-[#020617]/90 backdrop-blur-xl flex items-center gap-2 z-30">
            {/* Previous */}
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="btn-secondary py-2 px-3 sm:px-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <div className="flex-1 flex items-center justify-center gap-2">
              {/* Mark for Review */}
              <button
                onClick={toggleMarkForReview}
                className={`
                  btn-ghost py-2 px-3 text-sm transition-all duration-200
                  ${currentAnswer?.isMarkedForReview
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl'
                    : ''}
                `}
              >
                <Flag size={15} />
                <span className="hidden sm:inline">
                  {currentAnswer?.isMarkedForReview ? 'Unmark' : 'Mark Review'}
                </span>
              </button>

              {/* Skip */}
              <button
                onClick={skipQuestion}
                disabled={currentIndex === questions.length - 1}
                className="btn-ghost py-2 px-3 text-sm disabled:opacity-40"
              >
                <SkipForward size={15} />
                <span className="hidden sm:inline">Skip</span>
              </button>
            </div>

            {/* Next / Submit */}
            {currentIndex < questions.length - 1 ? (
              <button onClick={goNext} className="btn-primary py-2 px-3 sm:px-4">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowReview(true)}
                className="btn-primary py-2 px-3 sm:px-4"
                style={{ background: 'linear-gradient(135deg, #ef4444, #e11d48)' }}
              >
                <Send size={16} />
                <span className="hidden sm:inline">Review & Submit</span>
              </button>
            )}
          </div>
        </main>

        {/* ── RIGHT: PROCTORING PANEL ────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col items-center gap-3 px-4 py-6 border-l border-white/[0.06] bg-[#020617]/30 shrink-0 w-[200px]">
          <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold w-full text-center">
            Proctoring
          </p>
          <FaceMonitor violations={violations} />

          {/* Violation summary */}
          <div className="w-full space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Tab switches</span>
              <span className={`font-bold ${tabSwitches > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                {tabSwitches}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total violations</span>
              <span className={`font-bold ${violations > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {violations}
              </span>
            </div>
          </div>

          <div className="divider" />

          {/* Progress summary */}
          <div className="w-full space-y-2">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold text-center">Progress</p>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-center text-xs text-slate-500">
              {answeredCount} / {questions.length} answered
            </p>
          </div>
        </aside>
      </div>

      {/* ── Mobile bottom sheet: question palette ────────────────────────────── */}
      {/* Mobile palette toggle button */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="md:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full btn-primary shadow-lg"
        style={{ boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}
      >
        <LayoutGrid size={18} />
      </button>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              key="mob-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a] border-t border-white/[0.08] rounded-t-3xl max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h3 className="font-semibold text-white">Question Palette</h3>
                <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-1.5">
                  <X size={18} />
                </button>
              </div>
              <QuestionPalette
                questions={questions}
                answers={answers}
                currentIndex={currentIndex}
                onJump={(idx) => { goToQuestion(idx); setSidebarOpen(false); }}
                timerDisplay={formatTime()}
                isWarning={isWarning}
                isCritical={isCritical}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile proctoring (bottom right corner) ──────────────────────────── */}
      <div className="lg:hidden fixed bottom-24 right-4 z-40">
        <FaceMonitor violations={violations} />
      </div>
    </div>
  );
};

export default AssessmentPage;
