import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Github, Linkedin, Globe, Edit3, Save, X, Award, Zap, BookOpen, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Navbar from '../components/layout/Navbar.jsx';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login } = useAuth(); // use login to update token/user state locally if needed
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        if (response.data?.success) {
          const u = response.data.user;
          setDbUser(u);
          setFullName(u.fullName || '');
          setPhone(u.profile?.phone || '');
          setLocation(u.profile?.location || '');
          setGithub(u.profile?.github || '');
          setLinkedin(u.profile?.linkedin || '');
          setPortfolio(u.profile?.portfolio || '');
          setSkills(u.profile?.skills || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [editMode]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving profile changes...');
    try {
      const payload = {
        fullName,
        phone,
        location,
        github,
        linkedin,
        portfolio,
        skills,
      };
      
      const response = await api.put('/users/profile', payload);
      if (response.data?.success) {
        toast.success('Profile updated successfully!', { id: loadingToast });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes', { id: loadingToast });
    }
  };

  const totalQuizzes = dbUser?.assessmentHistory?.length || 0;
  const uniqueDomains = dbUser?.assessmentHistory ? new Set(dbUser.assessmentHistory.map(item => item.domainName)).size : 0;
  const totalXP = dbUser?.totalScore || 0;

  // Badges lists
  const achievements = [
    { name: 'First Milestone', desc: 'Completed first assessment', icon: '🎯', earned: totalQuizzes >= 1 },
    { name: 'Explorer', desc: 'Completed 3+ domains', icon: '🗺️', earned: uniqueDomains >= 3 },
    { name: 'High Scorer', desc: 'Scored 80%+ on any quiz', icon: '⭐', earned: dbUser?.assessmentHistory?.some(item => item.percentage >= 80) },
    { name: 'AI Scholar', desc: 'Completed 5+ assessments', icon: '🎓', earned: totalQuizzes >= 5 },
    { name: 'Trailblazer', desc: 'Attempted 3 distinct domains', icon: '🚀', earned: uniqueDomains >= 3 },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <Navbar />

      {loading ? (
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="spinner mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading profile details...</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Profile Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-xl mx-auto mb-4 border border-white/10">
                {fullName ? fullName.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <h2 className="text-xl font-bold text-white">{fullName}</h2>
              <p className="text-xs text-slate-500 mt-1 capitalize">{dbUser?.role || 'User'}</p>
              
              <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-4 my-6 text-center">
                <div>
                  <p className="text-sm font-black text-white">{totalXP}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">XP</p>
                </div>
                <div>
                  <p className="text-sm font-black text-white">{totalQuizzes}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Quizzes</p>
                </div>
                <div>
                  <p className="text-sm font-black text-white">{uniqueDomains}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Domains</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3 text-left">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-slate-400 hover:text-white text-xs transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="truncate">{github.replace('https://github.com/', '')}</span>
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-slate-400 hover:text-white text-xs transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="truncate">{linkedin.replace('https://www.linkedin.com/in/', '')}</span>
                  </a>
                )}
                {portfolio && (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-slate-400 hover:text-white text-xs transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{portfolio.replace('https://', '')}</span>
                  </a>
                )}
              </div>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center justify-center gap-2 mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Right Panel: Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/5 pb-2">
              {['overview', 'achievements', 'certificates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-semibold capitalize pb-2 px-1 relative transition-colors ${
                    activeTab === tab ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                {editMode ? (
                  /* Edit Mode Form */
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">Location</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. London, UK"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">GitHub Profile URL</label>
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">Portfolio Website URL</label>
                        <input
                          type="url"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="https://mywebsite.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 text-white"
                        />
                      </div>
                    </div>

                    {/* Skill inputs */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Manage Skills</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Add skill tag (e.g. PyTorch)..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-slate-300 text-xs rounded-full border border-white/5"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-slate-500 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-white/5 pt-6">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="flex-1 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
                      >
                        Save Profile
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Read Mode Details */
                  <div className="space-y-6">
                    {/* Education details */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Academic Details
                      </h3>
                      <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">College:</span>
                          <span className="font-semibold text-white">
                            {dbUser?.profile?.college || 'Not Specified'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Degree & Branch:</span>
                          <span className="font-semibold text-white">
                            {dbUser?.profile?.degree} ({dbUser?.profile?.branch || 'General'})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Graduation Year:</span>
                          <span className="font-semibold text-white">
                            {dbUser?.profile?.graduationYear || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Experience Level:</span>
                          <span className="font-bold text-indigo-400 capitalize">
                            {dbUser?.profile?.experienceLevel || 'Beginner'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skill tags */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Skills & Technologies
                      </h3>
                      {skills.length === 0 ? (
                        <p className="text-slate-500 text-xs italic">No skills listed yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white/5 text-slate-300 text-xs rounded-full border border-white/5"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Your Achievements</h3>
                  <span className="text-xs font-extrabold bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-md">
                    {earnedAchievements.length} Earned
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((a, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                        a.earned
                          ? 'bg-white/[0.02] border-indigo-500/20 shadow-md shadow-indigo-500/5'
                          : 'bg-white/[0.01] border-white/5 opacity-40'
                      }`}
                    >
                      <span className="text-4xl">{a.icon}</span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{a.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto mb-4 border border-indigo-500/20 animate-pulse">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Certificates Issued Yet</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                  Certificates are automatically generated when you score 80% or higher on any domain quiz.
                </p>
                <Link
                  to="/select-domain"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 border-b border-indigo-500/30 pb-0.5"
                >
                  Start a Quiz Attempt <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
