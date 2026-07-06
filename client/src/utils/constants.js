export const DOMAINS = [
  { slug: 'artificial-intelligence', name: 'Artificial Intelligence', icon: '🤖', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-700' },
  { slug: 'machine-learning', name: 'Machine Learning', icon: '🧠', color: '#6366f1', gradient: 'from-indigo-500 to-violet-600' },
  { slug: 'deep-learning', name: 'Deep Learning', icon: '⚡', color: '#a855f7', gradient: 'from-purple-500 to-pink-600' },
  { slug: 'data-science', name: 'Data Science', icon: '📊', color: '#10b981', gradient: 'from-emerald-500 to-teal-600' },
  { slug: 'computer-vision', name: 'Computer Vision', icon: '👁️', color: '#0ea5e9', gradient: 'from-sky-500 to-blue-600' },
  { slug: 'nlp', name: 'Natural Language Processing', icon: '💬', color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  { slug: 'generative-ai', name: 'Generative AI', icon: '✨', color: '#ec4899', gradient: 'from-pink-500 to-rose-600' },
  { slug: 'prompt-engineering', name: 'Prompt Engineering', icon: '🎯', color: '#14b8a6', gradient: 'from-teal-500 to-cyan-600' },
  { slug: 'ai-agents', name: 'AI Agents', icon: '🕵️', color: '#f97316', gradient: 'from-orange-500 to-red-600' },
  { slug: 'python', name: 'Python', icon: '🐍', color: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' },
  { slug: 'math-for-ai', name: 'Mathematics for AI', icon: '∑', color: '#8b5cf6', gradient: 'from-violet-600 to-indigo-700' },
  { slug: 'statistics', name: 'Statistics', icon: '📈', color: '#06b6d4', gradient: 'from-cyan-500 to-sky-600' },
  { slug: 'dsa', name: 'Data Structures & Algorithms', icon: '🌲', color: '#22c55e', gradient: 'from-green-500 to-emerald-600' },
  { slug: 'mlops', name: 'MLOps', icon: '⚙️', color: '#f59e0b', gradient: 'from-amber-500 to-yellow-600' },
  { slug: 'cloud-for-ai', name: 'Cloud for AI', icon: '☁️', color: '#0ea5e9', gradient: 'from-sky-400 to-blue-600' },
  { slug: 'frontend', name: 'Frontend Development', icon: '🎨', color: '#ec4899', gradient: 'from-pink-500 to-fuchsia-600' },
  { slug: 'backend', name: 'Backend Development', icon: '🔧', color: '#6366f1', gradient: 'from-indigo-500 to-blue-600' },
  { slug: 'git-github', name: 'Git & GitHub', icon: '🐙', color: '#64748b', gradient: 'from-slate-500 to-gray-700' },
];

export const EXPERIENCE_LEVELS = ['fresher', 'beginner', 'intermediate', 'advanced', 'expert'];
export const SKILL_RATINGS = ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
export const DEGREES = ['B.Tech', 'B.E.', 'B.Sc', 'BCA', 'MCA', 'M.Tech', 'M.Sc', 'MBA', 'Other'];
export const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Data Science', 'AI/ML', 'Other'];
export const POPULAR_SKILLS = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Machine Learning', 'Data Science', 'TypeScript', 'Next.js', 'Vue.js', 'Angular', 'Spring Boot', 'Django', 'FastAPI', 'Kubernetes'];

export const ASSESSMENT_DURATION = 30; // minutes
export const MAX_WARNINGS = 3;

export const VIOLATION_MESSAGES = {
  tab_switch: '⚠️ Tab switching detected! Please stay on the assessment.',
  fullscreen_exit: '⚠️ Please return to full-screen mode.',
  face_not_detected: '⚠️ Face not detected! Please position yourself in front of the camera.',
  multiple_faces: '⚠️ Multiple faces detected! Only you should be visible.',
  looking_away: '⚠️ Please focus on the screen.',
  camera_blocked: '⚠️ Camera blocked! Please uncover your camera.',
  focus_lost: '⚠️ Assessment window lost focus. Please return to the test.',
};
