import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Twitter, Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react';

const PLATFORM_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Domains', href: '#domains' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const RESOURCE_LINKS = [
  { label: 'Documentation', href: '#' },
  { label: 'API Reference', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Changelog', href: '#' },
  { label: 'Status', href: '#' },
];

const COMPANY_LINKS = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#', badge: 'Hiring' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact', href: '#' },
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@skillforge.ai', label: 'Email' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const colVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12"
        >
          {/* ── Col 1: Logo + Description ── */}
          <motion.div variants={colVariants} className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold gradient-text">SkillForge</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered hiring platform that connects exceptional talent with innovative companies. Forge your path to success.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-lg glass border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-gray-400 hover:text-violet-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Col 2: Platform ── */}
          <motion.div variants={colVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Platform</h3>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1 group w-fit"
                  >
                    <span className="group-hover:underline underline-offset-4">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 3: Resources ── */}
          <motion.div variants={colVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Resources</h3>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1 group w-fit"
                  >
                    <span className="group-hover:underline underline-offset-4">{label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 4: Company ── */}
          <motion.div variants={colVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ label, href, badge }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group w-fit"
                  >
                    <span className="group-hover:underline underline-offset-4">{label}</span>
                    {badge && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-medium">
                        {badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* ── Copyright ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {year} <span className="gradient-text font-semibold">SkillForge</span>. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Built with ❤️ for the future of hiring
          </p>
        </div>
      </div>
    </footer>
  );
}
