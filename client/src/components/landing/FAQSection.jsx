import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What is SkillForge and how does it work?',
    a: 'SkillForge is an AI-powered hiring platform that lets candidates prove their skills through rigorous, bias-free assessments. After completing your assessment, your verified score is shared with partner companies who reach out for interviews. The entire pipeline — from sign-up to interview — typically takes under 7 days.',
  },
  {
    q: 'Is the AI proctoring invasive? What data do you collect?',
    a: 'Our proctoring uses your webcam to detect suspicious behaviour such as looking away from the screen or having another person present. We process all video locally on your device — no raw footage is stored on our servers. Only anonymised behaviour signals are logged for audit purposes. Your privacy is our priority.',
  },
  {
    q: 'Which skill domains are available on SkillForge?',
    a: 'We currently offer assessments in 5 domains: Software Engineering (full-stack, backend, frontend), Data Science & ML, Product Management, UI/UX Design, and Business Analysis. Each domain has beginner, intermediate, and advanced tiers.',
  },
  {
    q: 'How long does a typical assessment take?',
    a: 'Most assessments are between 60 and 90 minutes. The adaptive algorithm adjusts question difficulty in real time based on your answers, so every minute is spent precisely benchmarking your skill level — no wasted time on questions that are too easy or too hard.',
  },
  {
    q: 'Can I retake an assessment if I am not happy with my score?',
    a: 'Yes! You can retake any assessment after a mandatory 7-day cooldown period. This gives you time to review the AI-generated feedback report and identify areas for improvement. Your profile will display your highest score.',
  },
  {
    q: 'How do companies access my results?',
    a: 'With your consent, your anonymised skill report (score, percentile, domain breakdown) is shared on our secure recruiter portal. Personal details are only revealed when a company expresses interest and you accept the connection. You stay in full control.',
  },
  {
    q: 'Is SkillForge free for candidates?',
    a: 'The core platform is completely free for candidates — sign-up, profile creation, and one assessment per domain every 30 days are free forever. We operate a freemium model where companies pay for access to the talent pool.',
  },
  {
    q: 'How quickly can I expect to hear from companies?',
    a: 'Top-percentile candidates (top 20%) typically receive interview invitations within 3–5 business days of completing an assessment. Average placement time from first assessment to signed offer is 21 days.',
  },
];

/* ─── FAQ Item ───────────────────────────────────────────────── */
const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.07 }}
    className={`glass overflow-hidden transition-all duration-300 ${isOpen ? 'border-indigo-500/30' : ''}`}
  >
    {/* Question row */}
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
    >
      <span className={`font-semibold text-base transition-colors duration-200 ${isOpen ? 'text-indigo-300' : 'text-slate-200 group-hover:text-white'}`}>
        {faq.q}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 0 : 0 }}
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'
        }`}
      >
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </motion.div>
    </button>

    {/* Answer */}
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="px-6 pb-5">
            <div className="divider mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ─── FAQ Section ────────────────────────────────────────────── */
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="relative py-28 overflow-hidden bg-[#0f172a]">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #6366f1, transparent 70%)' }}
      />

      <div className="relative z-10 section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            FAQs
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to know before taking the leap. Can't find your answer?{' '}
            <a href="#contact" className="text-indigo-400 hover:underline">Contact us</a>.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
