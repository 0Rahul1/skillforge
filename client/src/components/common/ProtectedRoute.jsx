import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShieldX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * ProtectedRoute
 *
 * Props:
 *   children    – The component(s) to render if authorised
 *   adminOnly   – If true, only users with role === 'admin' may access
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* ── While auth state is resolving ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
            <div className="absolute inset-2 rounded-full bg-violet-500/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
            </div>
          </div>
          <p className="text-gray-400 text-sm animate-pulse">Verifying authentication…</p>
        </motion.div>
      </div>
    );
  }

  /* ── Not logged in → redirect to /login ── */
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* ── Admin-only guard ── */
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass border border-white/10 rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl shadow-black/40"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Access Denied</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            You don&apos;t have permission to access this page. Admin privileges are required.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary text-sm px-6 py-2"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── All checks passed ── */
  return children;
}
