import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User, GraduationCap, Code2, Link2,
  ChevronRight, ChevronLeft, Check, X,
  Phone, MapPin, Github, Linkedin, Globe,
  Image, FileText, Plus, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/* ─────────────────────── Constants ─────────────────────── */
const STEPS = [
  { id: 1, label: 'Personal Info',      icon: User         },
  { id: 2, label: 'Education',          icon: GraduationCap },
  { id: 3, label: 'Skills & Exp',       icon: Code2         },
  { id: 4, label: 'Links & Upload',     icon: Link2         },
];

const DEGREES = [
  'B.Tech / B.E.',  'B.Sc', 'BCA', 'BBA',
  'M.Tech / M.E.', 'M.Sc', 'MCA', 'MBA',
  'Ph.D', 'Diploma', 'Other',
];

const BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science',
  'Artificial Intelligence & ML',
  'Biotechnology',
  'Chemical Engineering',
  'Other',
];

const GRAD_YEARS = Array.from({ length: 9 }, (_, i) => 2020 + i);

const EXPERIENCE_LEVELS = [
  { value: 'fresher',      label: 'Fresher',      desc: 'Just starting out',          color: 'from-slate-500 to-slate-600'   },
  { value: 'beginner',     label: 'Beginner',     desc: '< 1 year',                   color: 'from-blue-500 to-blue-600'     },
  { value: 'intermediate', label: 'Intermediate', desc: '1 – 3 years',                color: 'from-violet-500 to-violet-600' },
  { value: 'advanced',     label: 'Advanced',     desc: '3 – 5 years',                color: 'from-indigo-500 to-indigo-600' },
  { value: 'expert',       label: 'Expert',       desc: '5 + years',                  color: 'from-pink-500 to-pink-600'     },
];

const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java',
  'C++', 'TypeScript', 'SQL', 'MongoDB', 'Git',
  'Docker', 'AWS', 'Machine Learning', 'Data Analysis', 'CSS',
  'HTML', 'PHP', 'Ruby', 'Go', 'Rust',
];

/* ─────────────────────── Slide variants ─────────────────────── */
const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 30 },
  },
  exit: (dir) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2 },
  }),
};

/* ─────────────────────── Step Indicator ─────────────────────── */
const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEPS.map((step, idx) => {
      const Icon = step.icon;
      const done    = current > step.id;
      const active  = current === step.id;
      const last    = idx === STEPS.length - 1;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={{
                scale: active ? 1.15 : 1,
                boxShadow: active ? '0 0 20px rgba(99,102,241,0.6)' : '0 0 0 rgba(0,0,0,0)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                done    ? 'bg-indigo-500 border-indigo-500 text-white'
                : active ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                         : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {done ? <Check size={16} strokeWidth={2.5} /> : <Icon size={16} />}
            </motion.div>
            <span className={`text-[10px] font-medium hidden sm:block transition-colors duration-300 ${
              active ? 'text-indigo-400' : done ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {step.label}
            </span>
          </div>
          {!last && (
            <div className={`h-0.5 w-12 sm:w-16 mx-1 mb-5 rounded-full transition-colors duration-500 ${
              done ? 'bg-indigo-500' : 'bg-white/8'
            }`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ─────────────────────── Tag Input ─────────────────────── */
const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const addTag = (val) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 20) {
      setTags([...tags, trimmed]);
    }
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div
      className="input-field min-h-[48px] flex flex-wrap gap-2 items-start cursor-text"
      onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
    >
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          >
            {tag}
            <button
              type="button"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
              className="hover:text-red-400 transition-colors ml-0.5"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => addTag(input)}
        placeholder={tags.length === 0 ? 'Type a skill and press Enter…' : ''}
        className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600"
      />
    </div>
  );
};

/* ══════════════════════ MAIN PAGE ══════════════════════ */
export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step, setStep]             = useState(1);
  const [direction, setDirection]   = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills]         = useState([]);
  const [expLevel, setExpLevel]     = useState('fresher');

  /* Per-step form instances */
  const form1 = useForm({ defaultValues: { fullName: user?.fullName || '', phone: '', location: '' } });
  const form2 = useForm({ defaultValues: { college: '', degree: '', branch: '', gradYear: '' } });
  const form4 = useForm({ defaultValues: { github: '', linkedin: '', portfolio: '', avatarUrl: '', resumeUrl: '' } });

  /* Aggregated form data */
  const dataRef = useRef({});

  /* ── Navigate steps ── */
  const goNext = async () => {
    let valid = false;
    if (step === 1) valid = await form1.trigger();
    if (step === 2) valid = await form2.trigger();
    if (step === 3) { valid = true; }
    if (step === 4) valid = await form4.trigger();

    if (!valid) return;

    // Snapshot data — keep everything FLAT so the backend can destructure directly
    if (step === 1) dataRef.current = { ...dataRef.current, ...form1.getValues() };
    if (step === 2) {
      const edu = form2.getValues();
      dataRef.current = {
        ...dataRef.current,
        college:        edu.college,
        degree:         edu.degree,
        branch:         edu.branch,
        graduationYear: edu.gradYear,   // rename to match backend field name
      };
    }
    if (step === 3) dataRef.current = { ...dataRef.current, skills, experienceLevel: expLevel };

    if (step < 4) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  /* ── Final submit ── */
  const handleSubmit = async () => {
    const links = form4.getValues();

    // Build a completely flat payload — no nested objects
    const payload = {
      ...dataRef.current,   // fullName, phone, location, college, degree, branch, graduationYear, skills, experienceLevel
      github:     links.github     || undefined,
      linkedin:   links.linkedin   || undefined,
      portfolio:  links.portfolio  || undefined,
      avatarUrl:  links.avatarUrl  || undefined,
      resumeUrl:  links.resumeUrl  || undefined,
      profileComplete: true,   // backend uses this as a hint to set isProfileComplete
    };

    setSubmitting(true);
    try {
      const { data } = await api.put('/users/profile', payload);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile saved! Now choose your domain 🎯');
        // Small delay so the context update propagates before navigation
        setTimeout(() => navigate('/select-domain'), 100);
      } else {
        toast.error(data.message || 'Failed to save profile');
      }
    } catch (err) {
      console.error('[ProfileSetupPage] Save error:', err);
      toast.error(err?.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Progress ── */
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#020617] bg-grid flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="animated-blob w-96 h-96 bg-indigo-600/20 -top-20 -left-20" />
      <div className="animated-blob w-80 h-80 bg-violet-600/20 bottom-0 right-0" style={{ animationDelay: '3s' }} />
      <div className="animated-blob w-64 h-64 bg-cyan-600/15 top-1/2 left-1/2" style={{ animationDelay: '5s' }} />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <Sparkles size={14} />
            Complete your profile
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
            Setup Your Profile
          </h1>
          <p className="text-slate-500 text-sm">
            Step {step} of {STEPS.length} — {STEPS[step - 1].label}
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="progress-bar mb-6">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Card */}
        <div className="glass p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >

              {/* ────── STEP 1: Personal Info ────── */}
              {step === 1 && (
                <div className="space-y-5">
                  <SectionTitle icon={User} title="Personal Information" />

                  <div>
                    <label className="label-text">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        {...form1.register('fullName', { required: 'Full name is required' })}
                        className="input-field pl-10"
                        placeholder="Your full name"
                      />
                    </div>
                    <FieldError error={form1.formState.errors.fullName} />
                  </div>

                  <div>
                    <label className="label-text">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        {...form1.register('phone', {
                          pattern: { value: /^[0-9+\-\s()]{7,15}$/, message: 'Enter a valid phone number' }
                        })}
                        className="input-field pl-10"
                        placeholder="+91 98765 43210"
                        type="tel"
                      />
                    </div>
                    <FieldError error={form1.formState.errors.phone} />
                  </div>

                  <div>
                    <label className="label-text">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        {...form1.register('location')}
                        className="input-field pl-10"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ────── STEP 2: Education ────── */}
              {step === 2 && (
                <div className="space-y-5">
                  <SectionTitle icon={GraduationCap} title="Education Details" />

                  <div>
                    <label className="label-text">College / University *</label>
                    <input
                      {...form2.register('college', { required: 'College is required' })}
                      className="input-field"
                      placeholder="e.g. IIT Bombay"
                    />
                    <FieldError error={form2.formState.errors.college} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Degree *</label>
                      <select
                        {...form2.register('degree', { required: 'Degree is required' })}
                        className="input-field bg-[#0f172a] text-slate-200"
                      >
                        <option value="" disabled className="bg-[#0f172a]">Select degree</option>
                        {DEGREES.map((d) => (
                          <option key={d} value={d} className="bg-[#0f172a]">{d}</option>
                        ))}
                      </select>
                      <FieldError error={form2.formState.errors.degree} />
                    </div>

                    <div>
                      <label className="label-text">Graduation Year *</label>
                      <select
                        {...form2.register('gradYear', { required: 'Year is required' })}
                        className="input-field bg-[#0f172a] text-slate-200"
                      >
                        <option value="" disabled className="bg-[#0f172a]">Select year</option>
                        {GRAD_YEARS.map((y) => (
                          <option key={y} value={y} className="bg-[#0f172a]">{y}</option>
                        ))}
                      </select>
                      <FieldError error={form2.formState.errors.gradYear} />
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Branch / Specialization</label>
                    <select
                      {...form2.register('branch')}
                      className="input-field bg-[#0f172a] text-slate-200"
                    >
                      <option value="" className="bg-[#0f172a]">Select branch (optional)</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b} className="bg-[#0f172a]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ────── STEP 3: Skills & Experience ────── */}
              {step === 3 && (
                <div className="space-y-6">
                  <SectionTitle icon={Code2} title="Skills & Experience" />

                  {/* Tag input */}
                  <div>
                    <label className="label-text">
                      Your Skills
                      <span className="ml-2 text-slate-600 font-normal">({skills.length}/20)</span>
                    </label>
                    <TagInput tags={skills} setTags={setSkills} />
                    <p className="text-xs text-slate-600 mt-1.5">Type a skill and press Enter or comma to add</p>
                  </div>

                  {/* Popular skills quick-add */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2.5 font-medium uppercase tracking-wider">Popular Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SKILLS.map((skill) => {
                        const added = skills.includes(skill);
                        return (
                          <motion.button
                            key={skill}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (added) setSkills(skills.filter((s) => s !== skill));
                              else if (skills.length < 20) setSkills([...skills, skill]);
                            }}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                              added
                                ? 'bg-indigo-500/25 border-indigo-500/50 text-indigo-300'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/30 hover:text-slate-200'
                            }`}
                          >
                            {added ? <Check size={10} /> : <Plus size={10} />}
                            {skill}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Experience level */}
                  <div>
                    <label className="label-text">Experience Level</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <motion.button
                          key={lvl.value}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setExpLevel(lvl.value)}
                          className={`relative px-4 py-3 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                            expLevel === lvl.value
                              ? 'border-indigo-500/60 bg-indigo-500/15'
                              : 'border-white/8 bg-white/[0.03] hover:border-white/15'
                          }`}
                        >
                          {expLevel === lvl.value && (
                            <motion.div
                              layoutId="exp-active"
                              className={`absolute inset-0 bg-gradient-to-br ${lvl.color} opacity-10`}
                            />
                          )}
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              expLevel === lvl.value ? 'border-indigo-400 bg-indigo-400' : 'border-white/20'
                            }`}>
                              {expLevel === lvl.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-1.5 h-1.5 rounded-full bg-white"
                                />
                              )}
                            </div>
                            <span className="font-semibold text-sm text-slate-200">{lvl.label}</span>
                          </div>
                          <p className="text-xs text-slate-500 ml-5">{lvl.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ────── STEP 4: Links & Upload ────── */}
              {step === 4 && (
                <div className="space-y-5">
                  <SectionTitle icon={Link2} title="Links & Profile Media" />

                  {[
                    { name: 'github',    label: 'GitHub Profile URL',    icon: Github,   placeholder: 'https://github.com/username' },
                    { name: 'linkedin',  label: 'LinkedIn Profile URL',  icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
                    { name: 'portfolio', label: 'Portfolio Website',     icon: Globe,    placeholder: 'https://yourportfolio.com' },
                    { name: 'avatarUrl', label: 'Profile Picture URL',   icon: Image,    placeholder: 'https://example.com/photo.jpg' },
                    { name: 'resumeUrl', label: 'Resume URL',            icon: FileText, placeholder: 'https://drive.google.com/…' },
                  ].map(({ name, label, icon: Icon, placeholder }) => (
                    <div key={name}>
                      <label className="label-text">{label}</label>
                      <div className="relative">
                        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          {...form4.register(name, {
                            pattern: {
                              value: /^(https?:\/\/)?.+/,
                              message: 'Enter a valid URL',
                            },
                          })}
                          className="input-field pl-10"
                          placeholder={placeholder}
                          type="url"
                        />
                      </div>
                      <FieldError error={form4.formState.errors[name]} />
                    </div>
                  ))}

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-2">
                    <span className="mt-0.5">💡</span>
                    <span>All fields are optional. You can update links later from your profile settings.</span>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <motion.button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            whileTap={{ scale: 0.97 }}
            className={`btn-secondary gap-2 ${step === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft size={18} />
            Back
          </motion.button>

          <motion.button
            type="button"
            onClick={goNext}
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
            className="btn-primary gap-2 min-w-[130px]"
          >
            {submitting ? (
              <span className="spinner w-5 h-5" />
            ) : (
              <>
                {step === 4 ? 'Complete Setup' : 'Next'}
                {step < 4 ? <ChevronRight size={18} /> : <Check size={18} />}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Global style patch */}
      <style>{`
        .label-text { @apply block text-sm font-medium text-slate-400 mb-1.5; display: block; font-size: .875rem; font-weight: 500; color: #94a3b8; margin-bottom: .375rem; }
        option { background: #0f172a; }
      `}</style>
    </div>
  );
}

/* ── Small helpers ── */
function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06] mb-2">
      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
        <Icon size={18} className="text-indigo-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-100">{title}</h2>
    </div>
  );
}

function FieldError({ error }) {
  return error ? (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-400 mt-1"
    >
      {error.message}
    </motion.p>
  ) : null;
}
