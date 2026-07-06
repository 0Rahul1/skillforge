import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Building2, ClipboardList, TrendingUp } from 'lucide-react';

/* ─── Animated Counter ──────────────────────────────────────── */
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, suffix, label, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.94 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 90 }}
    whileHover={{ y: -8, transition: { duration: 0.25 } }}
    className="glass glass-hover p-8 flex flex-col items-center text-center group"
  >
    {/* Icon */}
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
      style={{ background: `linear-gradient(135deg, ${color}33, ${color}15)`, boxShadow: `0 0 20px ${color}22` }}
    >
      <Icon size={28} style={{ color }} />
    </div>

    {/* Number */}
    <p
      className="text-5xl font-extrabold mb-2 leading-none"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      <AnimatedCounter end={value} suffix={suffix} />
    </p>

    {/* Label */}
    <p className="text-lg font-semibold text-slate-200 mb-1">{label}</p>
    <p className="text-sm text-slate-500">{description}</p>
  </motion.div>
);

/* ─── Stats Section ─────────────────────────────────────────── */
const stats = [
  {
    icon: Users,
    value: 10000,
    suffix: '+',
    label: 'Candidates Assessed',
    description: 'Skilled professionals vetted through our platform',
    color: '#6366f1',
  },
  {
    icon: Building2,
    value: 500,
    suffix: '+',
    label: 'Partner Companies',
    description: 'Top-tier companies trust SkillForge to find talent',
    color: '#8b5cf6',
  },
  {
    icon: ClipboardList,
    value: 50000,
    suffix: '+',
    label: 'Assessments Taken',
    description: 'Rigorous skill evaluations completed to date',
    color: '#06b6d4',
  },
  {
    icon: TrendingUp,
    value: 95,
    suffix: '%',
    label: 'Success Rate',
    description: 'Candidates hired within 60 days of assessment',
    color: '#10b981',
  },
];

const StatsSection = () => (
  <section className="relative py-28 overflow-hidden">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-[#0f172a]" />
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99,102,241,0.25), transparent)',
      }}
    />
    <div className="absolute inset-0 bg-dots opacity-40" />

    <div className="relative z-10 section-container">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
          By the Numbers
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Trusted by Thousands
        </h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto">
          SkillForge's track record speaks for itself. Join a growing ecosystem of talent and opportunity.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.12} />
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
