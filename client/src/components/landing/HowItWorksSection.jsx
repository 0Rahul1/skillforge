import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, FileText, ClipboardCheck, Briefcase } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Register',
    description:
      'Create your free SkillForge account in under 60 seconds. No credit card required.',
    color: '#6366f1',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Complete Profile',
    description:
      'Showcase your background, select your target domain, and set career preferences.',
    color: '#8b5cf6',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Take Assessment',
    description:
      'Complete an AI-proctored, adaptive skill assessment that benchmarks you against industry standards.',
    color: '#06b6d4',
  },
  {
    number: '04',
    icon: Briefcase,
    title: 'Get Hired',
    description:
      'Your verified score is shared with partner companies. Top performers receive interview invitations.',
    color: '#10b981',
  },
];

/* ─── Step Card ─────────────────────────────────────────────── */
const StepCard = ({ step, index, isLast }) => {
  const Icon = step.icon;
  return (
    <div className="flex flex-col items-center relative">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: index * 0.18, type: 'spring', stiffness: 80 }}
        whileHover={{ y: -8 }}
        className="glass group w-full max-w-xs p-8 flex flex-col items-center text-center relative overflow-hidden cursor-default"
      >
        {/* Glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${step.color}22, transparent 60%)` }}
        />

        {/* Step number badge */}
        <div
          className="absolute top-4 right-4 text-xs font-mono font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}40` }}
        >
          {step.number}
        </div>

        {/* Icon circle */}
        <motion.div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
            boxShadow: `0 0 0 1px ${step.color}30, 0 8px 24px ${step.color}20`,
          }}
          whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
        >
          <Icon size={32} style={{ color: step.color }} />
        </motion.div>

        {/* Text */}
        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
        />
      </motion.div>

      {/* Connector arrow (hidden on last step) */}
      {!isLast && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.18 + 0.35 }}
          className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-10 items-center z-20"
        >
          <div className="w-16 h-[2px]" style={{ background: `linear-gradient(90deg, ${step.color}, ${steps[index + 1]?.color})` }} />
          <div
            className="w-0 h-0"
            style={{
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: `8px solid ${steps[index + 1]?.color ?? step.color}`,
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

/* ─── How It Works Section ──────────────────────────────────── */
const HowItWorksSection = () => (
  <section id="how-it-works" className="relative py-28 overflow-hidden bg-[#0f172a]">
    {/* Background */}
    <div className="absolute inset-0 bg-dots opacity-30" />
    <div
      className="absolute inset-0 opacity-20"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.3), transparent)' }}
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
        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
          The Process
        </p>
        <h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          How It <span className="gradient-text">Works</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          From sign-up to job offer — our streamlined process gets you hired faster than traditional methods.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
        ))}
      </div>

      {/* Bottom CTA nudge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-14"
      >
        <p className="text-slate-500 text-sm">
          Average time from sign-up to first interview invitation:{' '}
          <span className="text-indigo-400 font-semibold">less than 7 days</span>
        </p>
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;
