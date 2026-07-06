import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Play, Users, Building2, TrendingUp, Sparkles, ChevronDown } from 'lucide-react';

/* ─── Floating Particle ─────────────────────────────────────── */
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: Math.random() * 4 + 3,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: Math.random() * 2,
    }}
  />
);

/* ─── Stats Floating Card ────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100 }}
    whileHover={{ y: -6, scale: 1.04 }}
    className={`glass px-5 py-4 flex items-center gap-3 cursor-default select-none ${className}`}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))' }}>
      <Icon size={20} className="text-indigo-300" />
    </div>
    <div>
      <p className="text-lg font-bold text-white leading-none">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  </motion.div>
);

/* ─── Animated Blob ──────────────────────────────────────────── */
const Blob = ({ className, style, duration = 8, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    style={style}
    animate={{
      scale: [1, 1.3, 1.1, 1],
      x: [0, 30, -20, 0],
      y: [0, -20, 30, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  />
);

/* ─── Main Hero Section ──────────────────────────────────────── */
const HeroSection = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      background: ['rgba(99,102,241,0.6)', 'rgba(139,92,246,0.6)', 'rgba(6,182,212,0.6)'][Math.floor(Math.random() * 3)],
    },
  }));

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617]">
      {/* ── Grid background ── */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* ── Animated blobs ── */}
      <Blob
        className="w-[600px] h-[600px] opacity-[0.18]"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', top: '-10%', left: '-10%' }}
        duration={10} delay={0}
      />
      <Blob
        className="w-[500px] h-[500px] opacity-[0.15]"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', top: '20%', right: '-8%' }}
        duration={12} delay={2}
      />
      <Blob
        className="w-[400px] h-[400px] opacity-[0.12]"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', bottom: '5%', left: '30%' }}
        duration={9} delay={1}
      />

      {/* ── Floating particles ── */}
      {particles.map((p) => (
        <Particle key={p.id} style={p.style} />
      ))}

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 section-container text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm text-indigo-300 font-medium">
            <Sparkles size={14} />
            AI-Powered Hiring Platform
            <Sparkles size={14} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] mb-6"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <span className="text-white">Prove Your Skills.</span>
          <br />
          <span className="gradient-text">Get Hired.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10"
        >
          SkillForge uses cutting-edge AI to deliver fair, bias-free skill assessments across
          5 domains — helping top candidates connect with world-class companies at scale.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/register">
            <motion.span
              className="btn-primary text-base px-8 py-4 rounded-2xl inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Assessment
              <ArrowRight size={18} />
            </motion.span>
          </Link>
          <motion.a
            href="#demo"
            className="btn-secondary text-base px-8 py-4 rounded-2xl inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={18} className="text-indigo-400" />
            View Demo
          </motion.a>
        </motion.div>

        {/* Floating stat cards */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <StatCard icon={Users} value="10K+" label="Candidates Assessed" delay={0.6} />
          <StatCard icon={Building2} value="500+" label="Partner Companies" delay={0.75} />
          <StatCard icon={TrendingUp} value="95%" label="Placement Rate" delay={0.9} />
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
