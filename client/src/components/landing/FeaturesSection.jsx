import React from 'react';
import { motion } from 'framer-motion';
import { Camera, BarChart3, Layers, ShieldCheck, Zap, Trophy } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'AI Proctoring',
    description:
      'Real-time AI-powered webcam monitoring detects suspicious behaviour, ensuring every assessment is 100% authentic and tamper-proof.',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description:
      'Deep performance insights for both candidates and recruiters — skill breakdowns, percentile rankings, and trend analysis in one dashboard.',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    icon: Layers,
    title: '5 Skill Domains',
    description:
      'Comprehensive assessments spanning Software Engineering, Data Science, Product Management, Design, and Business Analysis.',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    icon: ShieldCheck,
    title: 'Fair Assessment',
    description:
      'Bias-free AI evaluation focuses purely on skill competency. No names, no photos — just your abilities, rated objectively.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description:
      'Receive detailed score reports and AI-generated feedback within seconds of completing your assessment — no waiting around.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description:
      'Compete globally and climb domain-specific leaderboards. Showcase your ranking to recruiters as a verified skill badge.',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.3)',
  },
];

/* ─── Feature Card ───────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, color, glow, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ y: -10, transition: { duration: 0.25 } }}
    className="glass group relative p-7 flex flex-col gap-5 cursor-default overflow-hidden"
  >
    {/* Hover glow overlay */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
      style={{ background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 70%)` }}
    />

    {/* Icon */}
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
      style={{
        background: `linear-gradient(135deg, ${color}30, ${color}12)`,
        boxShadow: `0 0 0 1px ${color}25, 0 4px 16px ${color}20`,
      }}
    >
      <Icon size={26} style={{ color }} />
    </div>

    {/* Text */}
    <div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>

    {/* Bottom accent line */}
    <div
      className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
      style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
    />
  </motion.div>
);

/* ─── Features Section ───────────────────────────────────────── */
const FeaturesSection = () => (
  <section id="features" className="relative py-28 overflow-hidden bg-[#020617]">
    {/* Grid bg */}
    <div className="absolute inset-0 bg-grid opacity-60" />

    {/* Blobs */}
    <div
      className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
      style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
    />
    <div
      className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
      style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
    />

    <div className="relative z-10 section-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">
          Platform Features
        </p>
        <h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Why{' '}
          <span className="gradient-text">SkillForge?</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Everything you need to prove your skills, stand out from the crowd, and land your dream role.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <FeatureCard key={f.title} {...f} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
