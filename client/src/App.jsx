import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext.jsx';
import { Suspense, lazy } from 'react';

// Lazy-load pages for performance
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const ProfileSetupPage = lazy(() => import('./pages/ProfileSetupPage.jsx'));
const DomainSelectionPage = lazy(() => import('./pages/DomainSelectionPage.jsx'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage.jsx'));
const ResultsPage = lazy(() => import('./pages/ResultsPage.jsx'));
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage.jsx'));
const ProjectHubPage = lazy(() => import('./pages/ProjectHubPage.jsx'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage.jsx'));
const AINewsPage = lazy(() => import('./pages/AINewsPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="spinner" style={{ width: 40, height: 40 }} />
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false, requireProfile = true }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (requireProfile && !user?.isProfileComplete) return <Navigate to="/profile-setup" replace />;
  return children;
};

// Redirect if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (!user.isProfileComplete) return <Navigate to="/profile-setup" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected User Routes */}
          <Route path="/profile-setup" element={<ProtectedRoute requireProfile={false}><ProfileSetupPage /></ProtectedRoute>} />
          <Route path="/select-domain" element={<ProtectedRoute><DomainSelectionPage /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
          <Route path="/results/:resultId" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute requireProfile={false}><RoadmapPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute requireProfile={false}><ProjectHubPage /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute requireProfile={false}><ResourcesPage /></ProtectedRoute>} />
          <Route path="/ai-news" element={<ProtectedRoute requireProfile={false}><AINewsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute requireProfile={false}><ProfilePage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
