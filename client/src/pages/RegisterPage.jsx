import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Zap, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const pageVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const blobVariants = {
  animate1: {
    x: [0, -40, 25, 0],
    y: [0, 30, -20, 0],
    scale: [1, 1.08, 0.94, 1],
    transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
  },
  animate2: {
    x: [0, 35, -15, 0],
    y: [0, -25, 18, 0],
    scale: [1, 0.96, 1.07, 1],
    transition: { duration: 24, repeat: Infinity, ease: 'easeInOut' },
  },
  animate3: {
    x: [0, -20, 35, 0],
    y: [0, 18, -12, 0],
    scale: [1, 1.04, 0.97, 1],
    transition: { duration: 28, repeat: Infinity, ease: 'easeInOut' },
  },
};

/* Password strength calculation */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Weak', color: 'bg-red-500' },
    { score: 2, label: 'Fair', color: 'bg-yellow-500' },
    { score: 3, label: 'Good', color: 'bg-blue-500' },
    { score: 4, label: 'Strong', color: 'bg-emerald-500' },
  ];
  return levels[score] || levels[0];
}

const strengthLabelColor = {
  Weak: 'text-red-400',
  Fair: 'text-yellow-400',
  Good: 'text-blue-400',
  Strong: 'text-emerald-400',
};

export default function RegisterPage() {
  const { user, register: registerUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const watchedPassword = watch('password', '');
  const strength = getPasswordStrength(watchedPassword);

  /* redirect if already logged in */
  useEffect(() => {
    if (!authLoading && user) {
      navigate(user?.isProfileComplete ? '/dashboard' : '/profile-setup', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created! Let\'s set up your profile 🚀');
      navigate('/profile-setup', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* ── Animated Background Blobs ── */}
      <motion.div
        variants={blobVariants}
        animate="animate1"
        className="absolute top-1/3 -right-20 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        variants={blobVariants}
        animate="animate2"
        className="absolute bottom-1/3 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        variants={blobVariants}
        animate="animate3"
        className="absolute top-1/5 left-2/3 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* ── Card ── */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <div className="glass border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/40 group-hover:shadow-violet-500/60 transition-shadow">
                <Zap className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold gradient-text">SkillForge</span>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Join thousands of professionals on SkillForge</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`input-field pl-10 ${errors.name ? 'border-red-500/60' : ''}`}
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
              </div>
              {errors.name && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-400">
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500/60' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-500/60' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              <AnimatePresence>
                {watchedPassword.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2.5"
                  >
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strengthLabelColor[strength.label] || 'text-gray-500'}`}>
                      {strength.label ? `Password strength: ${strength.label}` : ''}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.password && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'border-red-500/60' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watchedPassword || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </motion.p>
              )}
              {!errors.confirmPassword && watch('confirmPassword') && watch('confirmPassword') === watchedPassword && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Passwords match
                </motion.p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border border-white/20 bg-white/5 focus:ring-violet-500/50 focus:ring-2 cursor-pointer accent-violet-500 flex-shrink-0"
                  {...register('terms', { required: 'You must accept the terms to continue' })}
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors select-none leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-violet-400 hover:text-violet-300 hover:underline underline-offset-4">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-violet-400 hover:text-violet-300 hover:underline underline-offset-4">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-400 ml-7">
                  {errors.terms.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 0 24px rgba(139,92,246,0.45)' } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="btn-primary w-full py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-cyan-500/10 to-violet-500/20 blur-xl -z-10 scale-105" />
      </motion.div>
    </div>
  );
}
