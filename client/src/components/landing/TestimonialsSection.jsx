import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Software Engineer',
    company: 'Google',
    rating: 5,
    text: 'SkillForge is the most transparent hiring platform I have used. The AI proctoring meant my score actually reflected my skills — and Google noticed.',
    avatarColor: '#6366f1',
  },
  {
    name: 'Priya Sharma',
    role: 'Data Scientist',
    company: 'Microsoft',
    rating: 5,
    text: 'Within two weeks of completing my Data Science assessment, I had 3 interview offers. The leaderboard ranking made my profile stand out immediately.',
    avatarColor: '#8b5cf6',
  },
  {
    name: 'Carlos Rivera',
    role: 'Product Manager',
    company: 'Airbnb',
    rating: 5,
    text: 'I was skeptical at first, but the assessment quality is genuinely world-class. Airbnb reached out to me within days of seeing my SkillForge report.',
    avatarColor: '#06b6d4',
  },
  {
    name: 'Anika Patel',
    role: 'UX Designer',
    company: 'Figma',
    rating: 5,
    text: 'The design domain assessment was challenging and real-world — exactly what companies need to see. Got hired at Figma within 3 weeks!',
    avatarColor: '#10b981',
  },
  {
    name: "Liam O'Brien",
    role: 'Business Analyst',
    company: 'McKinsey',
    rating: 5,
    text: 'Bias-free assessment was a game-changer for me. My results spoke for themselves and McKinsey trusted the platform\'s verification completely.',
    avatarColor: '#f59e0b',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Full-Stack Developer',
    company: 'Shopify',
    rating: 5,
    text: 'Instant feedback after the assessment helped me understand my weak points. I improved my score in the retake and landed my dream role at Shopify.',
    avatarColor: '#ef4444',
  },
];

/* ─── Star Rating ────────────────────────────────────────────── */
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
      />
    ))}
  </div>
);

/* ─── Avatar Circle ──────────────────────────────────────────── */
const Avatar = ({ name, color }) => (
  <div
    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0"
    style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, boxShadow: `0 0 12px ${color}44` }}
  >
    {name.charAt(0)}
  </div>
);

/* ─── Testimonial Card ───────────────────────────────────────── */
const TestimonialCard = ({ t, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="glass group p-7 flex flex-col gap-5 relative overflow-hidden cursor-default"
  >
    {/* Quote icon */}
    <div className="absolute top-5 right-5 opacity-[0.08] group-hover:opacity-[0.14] transition-opacity">
      <Quote size={48} />
    </div>

    {/* Rating */}
    <StarRating rating={t.rating} />

    {/* Text */}
    <p className="text-slate-300 text-sm leading-relaxed flex-1">
      "{t.text}"
    </p>

    {/* Divider */}
    <div className="divider" />

    {/* Author */}
    <div className="flex items-center gap-3">
      <Avatar name={t.name} color={t.avatarColor} />
      <div>
        <p className="font-semibold text-white text-sm">{t.name}</p>
        <p className="text-xs text-slate-500">
          {t.role} · <span style={{ color: t.avatarColor }}>{t.company}</span>
        </p>
      </div>
    </div>
  </motion.div>
);

/* ─── Testimonials Section ───────────────────────────────────── */
const TestimonialsSection = () => (
  <section id="testimonials" className="relative py-28 overflow-hidden bg-[#020617]">
    {/* Background */}
    <div className="absolute inset-0 bg-grid opacity-50" />
    <div
      className="absolute inset-0 opacity-10"
      style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(139,92,246,0.4), transparent)' }}
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
          Success Stories
        </p>
        <h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Loved by <span className="gradient-text">Thousands</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Real candidates, real results. Here's what our community says about SkillForge.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.name} t={t} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
