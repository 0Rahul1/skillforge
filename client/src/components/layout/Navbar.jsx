import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Search, Bell, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Domains', href: '/select-domain' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resources', href: '/resources' },
  { label: 'AI News', href: '/ai-news' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown and mobile menu on navigation
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to domain selection page or relevant page with query
      navigate(`/select-domain?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SkillForge
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.label} className="relative">
                  <Link
                    to={link.href}
                    className={`text-sm font-medium transition-colors hover:text-white ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-5 left-0 right-0 h-[2px] bg-indigo-500"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Toggle */}
            <div className="relative">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-white/10 border border-white/15 rounded-full px-3 py-1"
                  >
                    <input
                      type="text"
                      placeholder="Search domains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
                      autoFocus
                    />
                    <button type="submit">
                      <Search className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                    </button>
                  </motion.form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell */}
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md border border-white/10">
                    {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                          <Zap className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-white/5 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md border border-white/10 mr-2">
                {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {/* Search bar inside mobile menu */}
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-4">
                <input
                  type="text"
                  placeholder="Search domains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none w-full"
                />
                <button type="submit">
                  <Search className="w-4 h-4 text-slate-400" />
                </button>
              </form>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/5 pt-4">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <User className="w-5 h-5 text-purple-400" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-3">
                    <Link
                      to="/login"
                      className="text-center py-2 rounded-lg text-base font-medium text-slate-300 border border-white/10 hover:text-white hover:bg-white/5"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="text-center py-2 rounded-lg text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
