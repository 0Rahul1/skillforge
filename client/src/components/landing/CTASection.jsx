import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';

/* ─── Animated Blob ─────────────────────────────────────────── */
const Blob = ({ style, duration, delay }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={style}
    animate={{ scale: [1, 1.4, 1.1, 1], x: [0, 40, -30, 0], y: [0, -30, 40, 0] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ─── CTA Section ────────────────────────────────────────────── */
const CTASection = () => (
  <section className="relative py-32 overflow-hidden bg-[#020617]">
    {/* Background blobs */}
    <Blob
      style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)', top: '-20%', left: '-10%' }}
      duration={10} delay={0}
    />
    <Blob
      style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)', bottom: '-10%', right: '-8%' }}
      duration={12} delay={1.5}
    />
    <Blob
      style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)', top: '60%', left: '50%' }}
      duration={8} delay={0.5}
    />

    {/* Grid bg */}
    <div className="absolute inset-0 bg-grid opacity-40" />

    <div className="relative z-10 section-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass max-w-4xl mx-auto p-12 md:p-16 text-center relative overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(99,102,241,0.15), 0 4px 24px rgba(0,0,0,0.3)' }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12), transparent 60%)' }}
        />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
          }}
        >
          <Rocket size={36} className="text-indigo-300" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Ready to Showcase{' '}
          <span className="gradient-text">Your Skills?</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Join over 10,000 candidates who have already proven their worth on SkillForge and landed
          roles at the world's best companies. Your future employer is waiting.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/register">
            <motion.span
              className="btn-primary text-base px-9 py-4 rounded-2xl inline-flex items-center gap-2"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </motion.span>
          </Link>
          <Link to="/login">
            <motion.span
              className="btn-secondary text-base px-9 py-4 rounded-2xl inline-flex items-center gap-2"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              Sign In
            </motion.span>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-xs text-slate-600"
        >
          No credit card required · Free for candidates · Results in minutes
        </motion.p>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
