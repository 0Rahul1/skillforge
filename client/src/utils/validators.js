// Email validation
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// URL validation
export const isValidUrl = (url) => {
  if (!url) return true; // optional
  try { new URL(url); return true; } catch { return false; }
};

// GitHub URL validation
export const isValidGitHub = (url) => {
  if (!url) return true;
  return url.includes('github.com/') || isValidUrl(url);
};

// LinkedIn URL validation
export const isValidLinkedIn = (url) => {
  if (!url) return true;
  return url.includes('linkedin.com/') || isValidUrl(url);
};

// Password strength (0-4)
export const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const getPasswordStrengthLabel = (score) => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['text-red-400', 'text-orange-400', 'text-amber-400', 'text-cyan-400', 'text-emerald-400'];
  return { label: labels[score], color: colors[score] };
};

// Phone validation (flexible)
export const isValidPhone = (phone) => {
  if (!phone) return true;
  return /^[\d\s\-\+\(\)]{7,15}$/.test(phone);
};

// Graduation year
export const isValidGradYear = (year) => {
  const n = parseInt(year);
  return n >= 2015 && n <= 2030;
};
