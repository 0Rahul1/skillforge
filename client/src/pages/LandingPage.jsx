import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Brain, Map, Rocket, Newspaper, Trophy, BookOpen, Code, ArrowRight, Star, Users, CheckCircle, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

// Animated counter component from 0 to target value
const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, ''); // "+", "K+", etc.

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  const formattedCount = count.toLocaleString('en-US');
  return <span>{formattedCount}{suffix}</span>;
};

// Interactive node connection system linked to cursor
const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const parent = canvas.parentElement || document.body;
    let width = (canvas.width = parent.offsetWidth || window.innerWidth);
    let height = (canvas.height = parent.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        const p = canvas.parentElement || document.body;
        width = canvas.width = p.offsetWidth || window.innerWidth;
        height = canvas.height = p.offsetHeight || window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 65;
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 170 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    const drawGridLines = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 70;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawGridLines();

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / mouse.radius) * 0.22;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            p1.x -= dx * 0.015;
            p1.y -= dy * 0.015;
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / connectionDistance) * 0.06;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

const STATS = [
  { value: '18+', label: 'Learning Domains', icon: Brain },
  { value: '1,000+', label: 'Quiz Questions', icon: Zap },
  { value: '16+', label: 'Guided Projects', icon: Code },
  { value: '10K+', label: 'Active Learners', icon: Users },
];

const FEATURES = [
  {
    title: 'Visual Learning Roadmaps',
    description: 'Follow a structured, progressive path designed by AI experts, from core Python foundations to advanced multi-agent systems.',
    icon: Map,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Adaptive AI Quizzes',
    description: 'Test your knowledge across 18 distinct domains with interactive code-debugging, MCQs, and detailed instant explanations.',
    icon: Brain,
    color: 'from-indigo-500 to-blue-600',
  },
  {
    title: 'Hands-on AI Projects',
    description: 'Build portfolio-ready projects like Spam Classifiers, Sentiment Analyzers, Object Detectors (YOLO), and RAG chatbots.',
    icon: Rocket,
    color: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Latest AI News Feed',
    description: 'Stay updated with curated breaking news directly from OpenAI, Google DeepMind, Anthropic, Meta, and Hugging Face.',
    icon: Newspaper,
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Global Leaderboards',
    description: 'Compete with fellow learners globally, track your weekly streak, and climb the ranks as you earn XP points.',
    icon: Trophy,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Curated Resource Hub',
    description: 'Access the best research papers (Attention Is All You Need, etc.), documentation, tools, books, and courses.',
    icon: BookOpen,
    color: 'from-cyan-500 to-sky-600',
  },
];

const REVIEWS = [
  {
    name: 'Priya Sharma',
    role: 'AI/ML Undergrad Student',
    content: 'The Roadmap page took me from struggling with math theory to training my first Convolutional Neural Network. Excellent UI!',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Software Developer',
    content: 'The Project Hub is fantastic. The guidance and GitHub references helped me build an offline RAG chatbot that wowed my team.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Data Science Intern',
    content: 'Adaptive quizzes are incredibly helpful for interview prep. The instant explanation feature is like having an AI tutor.',
    rating: 5,
  },
];

const DOMAINS_PREVIEW = [
  { name: 'Python Basics', icon: '🐍', slug: 'python', difficulty: 'Beginner', gradient: 'from-blue-500/20 to-indigo-500/10' },
  { name: 'Machine Learning', icon: '🧠', slug: 'machine-learning', difficulty: 'Advanced', gradient: 'from-indigo-500/20 to-purple-500/10' },
  { name: 'Deep Learning', icon: '⚡', slug: 'deep-learning', difficulty: 'Expert', gradient: 'from-purple-500/20 to-pink-500/10' },
  { name: 'Computer Vision', icon: '👁️', slug: 'computer-vision', difficulty: 'Advanced', gradient: 'from-sky-500/20 to-blue-500/10' },
  { name: 'Generative AI', icon: '✨', slug: 'generative-ai', difficulty: 'Advanced', gradient: 'from-pink-500/20 to-rose-500/10' },
  { name: 'Natural Language Processing', icon: '💬', slug: 'nlp', difficulty: 'Advanced', gradient: 'from-amber-500/20 to-orange-500/10' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06060c] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Wrapper */}
      <div className="w-full relative overflow-hidden border-b border-white/5">
        <InteractiveBackground />

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 flex flex-col items-center px-4 max-w-7xl mx-auto text-center z-10">
        {/* Animated Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[90px] rounded-full -z-10" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <Brain className="w-3.5 h-3.5" />
          The Ultimate AI Learning Platform
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8"
        >
          Master AI &{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Machine Learning
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-xl max-w-2xl leading-relaxed mb-12"
        >
          From coding foundations to building autonomous agents. Elevate your portfolio with 18 structured domains, hands-on guided projects, and real-time news.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link
            to="/register"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.03]"
          >
            Start Learning Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/roadmap"
            className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-xl transition-all"
          >
            Explore Roadmap
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl"
        >
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="backdrop-blur-md bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-3xl font-extrabold text-white mb-2">
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className="text-slate-400 text-xs font-medium tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </section>
      </div>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-slate-950/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why SkillForge?</h2>
            <p className="text-slate-400">Everything you need to go from amateur to industry-ready AI practitioner.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="backdrop-blur-xl bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-8 transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Decorative Glow */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-6`} />
                  <h3 className="text-xl font-bold text-white mb-4">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Domain Preview Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">18 Core Domains</h2>
            <p className="text-slate-400">Explore intermediate, advanced, and expert domains matching your learning goals.</p>
          </div>
          <Link
            to="/select-domain"
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold mt-4 md:mt-0 transition-colors"
          >
            Browse All Domains
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAINS_PREVIEW.map((dom, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`backdrop-blur-md bg-gradient-to-br ${dom.gradient} border border-white/5 hover:border-indigo-500/20 rounded-2xl p-6 transition-all relative group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{dom.icon}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                  {dom.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{dom.name}</h3>
              <p className="text-slate-400 text-xs mb-4">Learn core models, practice questions, and verify skills.</p>
              <Link
                to={`/select-domain`}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300"
              >
                Learn More
                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-950/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-slate-400">Join thousands of students building their careers in artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-6 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{rev.content}"</p>
                <div>
                  <h4 className="font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-slate-500">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 max-w-5xl mx-auto text-center relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 my-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/20 blur-[80px] rounded-full -z-10" />
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to Forge Your AI Future?
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Embark on structured roadmaps, build real-world products, and earn credentials to boost your career. Completely free.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 font-semibold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-[1.03]"
        >
          Create Free Account
          <ArrowRight className="w-5 h-5 text-slate-950" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
