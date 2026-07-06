import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Twitter, Linkedin, Github, CheckCircle } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: '#1d9bf0' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: '#0a66c2' },
  { icon: Github, label: 'GitHub', href: 'https://github.com', color: '#94a3b8' },
];

/* ─── Contact Section ────────────────────────────────────────── */
const ContactSection = () => {
  const [form, setForm] = useState({ email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-28 overflow-hidden bg-[#0f172a]">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] blur-3xl opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 70%)' }}
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
          <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            Get in Touch
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Contact <span className="gradient-text">Us</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Have questions, feedback, or partnership enquiries? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ─ Left: Info ─ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Info cards */}
            {[
              {
                icon: Mail,
                title: 'Email Us',
                value: 'hello@skillforge.io',
                color: '#6366f1',
                href: 'mailto:hello@skillforge.io',
              },
              {
                icon: MessageSquare,
                title: 'Live Chat',
                value: 'Available Mon–Fri, 9am–6pm IST',
                color: '#06b6d4',
                href: '#',
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="glass group p-6 flex items-center gap-5 no-underline transition-all duration-300 hover:border-indigo-500/30"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}22`, boxShadow: `0 0 12px ${item.color}22` }}
                >
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-0.5">{item.title}</p>
                  <p className="font-semibold text-slate-200">{item.value}</p>
                </div>
              </a>
            ))}

            {/* Social links */}
            <div>
              <p className="text-slate-500 text-sm mb-4">Follow us on social media</p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, label, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="glass w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110"
                    whileHover={{ y: -3 }}
                    style={{ '--hover-color': color }}
                  >
                    <Icon size={18} className="text-slate-400 hover:text-white transition-colors" style={{ color }} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─ Right: Form ─ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="glass h-full flex flex-col items-center justify-center text-center p-10 gap-5"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-500/20">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-slate-400 text-sm">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ email: '', message: '' }); }}
                  className="btn-secondary px-6 py-2.5 rounded-xl text-sm"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass p-8 flex flex-col gap-5">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className="input-field resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-primary justify-center py-3.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={!loading ? { scale: 1.03 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={17} />
                      Send Message
                    </span>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
