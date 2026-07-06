import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Zap, Loader2, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

const pageVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-4 overflow-hidden">

      {/* Background blobs */}
      <motion.div
        animate={{ x: [0, 30, -15, 0], y: [0, -20, 12, 0], scale: [1, 1.06, 0.97, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -25, 18, 0], y: [0, 22, -10, 0], scale: [1, 0.95, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"
      />

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

          <AnimatePresence mode="wait">
            {!submitted ? (
              /* ── Reset Request Form ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-violet-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 0 24px rgba(139,92,246,0.4)' } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="btn-primary w-full py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending link…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reset Link
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── Success State ── */
              <motion.div
                key="success"
                variants={successVariants}
                initial="hidden"
                animate="visible"
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  We sent a password reset link to
                </p>
                <p className="text-violet-400 font-medium mb-6 text-sm break-all">{submittedEmail}</p>
                <p className="text-gray-500 text-xs leading-relaxed mb-8">
                  Didn&apos;t receive the email? Check your spam folder, or{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-violet-400 hover:text-violet-300 hover:underline underline-offset-4 transition-colors"
                  >
                    try a different address
                  </button>
                  .
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-cyan-500/10 to-violet-500/20 blur-xl -z-10 scale-105" />
      </motion.div>
    </div>
  );
}
