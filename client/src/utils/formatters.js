// Format seconds into MM:SS
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

// Format date + time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// Get initials from name
export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

// Get skill rating color
export const getRatingColor = (rating) => {
  const colors = {
    Novice: 'text-slate-400',
    Beginner: 'text-blue-400',
    Intermediate: 'text-cyan-400',
    Advanced: 'text-violet-400',
    Expert: 'text-amber-400',
  };
  return colors[rating] || 'text-slate-400';
};

// Get score grade
export const getGrade = (percentage) => {
  if (percentage >= 90) return { grade: 'A+', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (percentage >= 80) return { grade: 'A', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (percentage >= 70) return { grade: 'B+', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
  if (percentage >= 60) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  if (percentage >= 50) return { grade: 'C', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  return { grade: 'F', color: 'text-red-400', bg: 'bg-red-500/20' };
};

// Format seconds to human readable duration
export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

// Capitalize first letter
export const capitalize = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

// Truncate text
export const truncate = (str = '', length = 80) =>
  str.length > length ? str.substring(0, length) + '...' : str;

// Get avatar color from name (deterministic)
export const getAvatarColor = (name = '') => {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-indigo-500 to-blue-600',
    'from-cyan-500 to-teal-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
