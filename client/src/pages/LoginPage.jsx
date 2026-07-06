import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const pageVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const blobVariants = {
  animate1: {
    x: [0, 40, -20, 0],
    y: [0, -30, 20, 0],
    scale: [1, 1.08, 0.95, 1],
    transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
  },
  animate2: {
    x: [0, -30, 20, 0],
    y: [0, 25, -15, 0],
    scale: [1, 0.95, 1.06, 1],
    transition: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
  },
  animate3: {
    x: [0, 20, -40, 0],
    y: [0, -20, 10, 0],
    scale: [1, 1.05, 0.98, 1],
    transition: { duration: 26, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function LoginPage() {
  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '', rememberMe: false } });

  /* redirect if already logged in */
  useEffect(() => {
    if (!authLoading && user) {
      navigate(user?.isProfileComplete ? '/dashboard' : '/profile-setup', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      toast.success('Welcome back! 🎉');
      /* navigation happens via the useEffect above once auth state updates */
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
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
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-4 overflow-hidden">

      {/* ── Animated Background Blobs ── */}
      <motion.div
        variants={blobVariants}
        animate="animate1"
        className="absolute top-1/4 -left-24 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        variants={blobVariants}
        animate="animate2"
        className="absolute bottom-1/4 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        variants={blobVariants}
        animate="animate3"
        className="absolute top-3/4 left-1/3 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"
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
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500/60 focus:border-red-500' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-400"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-500/60 focus:border-red-500' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-400"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50 focus:ring-2 cursor-pointer accent-violet-500"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors select-none">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
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
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors hover:underline underline-offset-4"
            >
              Create one for free
            </Link>
          </p>
        </div>

        {/* Glow ring around card */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-cyan-500/10 to-violet-500/20 blur-xl -z-10 scale-105" />
      </motion.div>
    </div>
  );
}
