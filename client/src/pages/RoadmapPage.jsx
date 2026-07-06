import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, Circle, ArrowDown, Zap, Clock, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';

const ROADMAP_NODES = [
  { id: 1, title: 'Python', subtitle: 'Foundation Language', icon: '🐍', slug: 'python', color: '#3b82f6', duration: '4 weeks', status: 'completed', description: 'Variables, loops, functions, OOP, decorators, generators, NumPy, Pandas' },
  { id: 2, title: 'Mathematics for AI', subtitle: 'Core Math Concepts', icon: '∑', slug: 'math-for-ai', color: '#8b5cf6', duration: '3 weeks', status: 'completed', description: 'Linear algebra, vectors, matrices, dot products, derivatives, optimization' },
  { id: 3, title: 'Statistics', subtitle: 'Data Understanding', icon: '📈', slug: 'statistics', color: '#06b6d4', duration: '3 weeks', status: 'active', description: 'Probability, distributions, CLT, hypothesis testing, p-values, regression' },
  { id: 4, title: 'Data Structures & Algorithms', subtitle: 'Problem Solving', icon: '🌲', slug: 'dsa', color: '#22c55e', duration: '4 weeks', status: 'locked', description: 'Big-O, arrays, linked lists, stacks, trees, graphs, sorting, searching' },
  { id: 5, title: 'Data Science', subtitle: 'Data Analysis', icon: '📊', slug: 'data-science', color: '#10b981', duration: '4 weeks', status: 'locked', description: 'EDA, data cleaning, feature engineering, visualizations, pipeline design' },
  { id: 6, title: 'Machine Learning', subtitle: 'Core ML Algorithms', icon: '🧠', slug: 'machine-learning', color: '#6366f1', duration: '6 weeks', status: 'locked', description: 'Supervised & unsupervised learning, decision trees, SVMs, PCA, Random Forest' },
  { id: 7, title: 'Deep Learning', subtitle: 'Neural Networks', icon: '⚡', slug: 'deep-learning', color: '#a855f7', duration: '6 weeks', status: 'locked', description: 'Backpropagation, ReLU, CNNs, RNNs & LSTMs, self-attention, Transformers' },
  { id: 8, title: 'Computer Vision', subtitle: 'Image & Video AI', icon: '👁️', slug: 'computer-vision', color: '#0ea5e9', duration: '5 weeks', status: 'locked', description: 'Image processing, convolution, OpenCV, YOLO, object detection, segmentation' },
  { id: 9, title: 'Natural Language Processing', subtitle: 'Language AI', icon: '💬', slug: 'nlp', color: '#f59e0b', duration: '5 weeks', status: 'locked', description: 'Tokenization, embeddings, Word2Vec, BERT pretraining, GPT generative steps' },
  { id: 10, title: 'Generative AI', subtitle: 'Creative AI Systems', icon: '✨', slug: 'generative-ai', color: '#ec4899', duration: '4 weeks', status: 'locked', description: 'GAN training stability, VAEs, diffusion models, LLM parameters, LoRA fine-tuning' },
  { id: 11, title: 'Prompt Engineering', subtitle: 'LLM Mastery', icon: '🎯', slug: 'prompt-engineering', color: '#14b8a6', duration: '2 weeks', status: 'locked', description: 'Zero-shot vs few-shot, Chain of Thought, role prompting, RAG context injection' },
  { id: 12, title: 'AI Agents', subtitle: 'Autonomous Systems', icon: '🕵️', slug: 'ai-agents', color: '#f97316', duration: '4 weeks', status: 'locked', description: 'ReAct framework, tool calling, agent memory, LangChain, multi-agent frameworks' },
];

export default function RoadmapPage() {
  const navigate = useNavigate();

  const handleNodeClick = (node) => {
    if (node.status !== 'locked') {
      navigate('/select-domain');
    }
  };

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Curriculum Path
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight mb-4"
          >
            AI Learning Roadmap
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            A structured visual guide from core foundations to production-grade autonomous agent systems.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-3xl mx-auto my-16">
          {/* Vertical Center Line */}
          <div className="absolute left-[30px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 -z-10" />

          {/* Timeline Nodes */}
          <div className="space-y-16">
            {ROADMAP_NODES.map((node, index) => {
              const isEven = index % 2 === 0;
              const isCompleted = node.status === 'completed';
              const isActive = node.status === 'active';
              const isLocked = node.status === 'locked';

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center relative ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Indicator Ring */}
                  <div
                    onClick={() => handleNodeClick(node)}
                    className={`absolute left-[30px] sm:left-1/2 w-10 h-10 rounded-full flex items-center justify-center -translate-x-1/2 transition-all duration-300 z-10 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 border-4 border-slate-900 shadow-lg shadow-emerald-500/20 scale-110'
                        : isActive
                        ? 'bg-indigo-500 border-4 border-slate-900 shadow-lg shadow-indigo-500/30 scale-110 animate-bounce'
                        : 'bg-slate-900 border-4 border-slate-950 text-slate-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-white fill-white" />
                    )}
                  </div>

                  {/* Spacer for Center Alignment */}
                  <div className="hidden sm:block w-1/2 px-12" />

                  {/* Roadmap Node Card */}
                  <div
                    onClick={() => handleNodeClick(node)}
                    className={`w-full sm:w-1/2 pl-16 sm:pl-0 ${
                      isEven ? 'sm:pr-12' : 'sm:pl-12'
                    } group cursor-pointer`}
                  >
                    <div
                      className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 relative ${
                        isCompleted
                          ? 'bg-emerald-500/[0.02] border-emerald-500/10 hover:border-emerald-500/20'
                          : isActive
                          ? 'bg-indigo-500/[0.03] border-indigo-500/25 hover:border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                          : 'bg-white/[0.01] border-white/5 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Node Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{node.icon}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          {node.duration}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {node.title}
                      </h3>
                      <p className="text-xs text-indigo-400 font-semibold mb-3">{node.subtitle}</p>
                      
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        {node.description}
                      </p>

                      {/* CTA Action button inside active nodes */}
                      {!isLocked && (
                        <div className="flex justify-end">
                          <button
                            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-all ${
                              isCompleted
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                : 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white'
                            }`}
                          >
                            Practice Quiz
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Full Curriculum Grid Footer */}
        <div className="border-t border-white/5 pt-12 mt-20 text-center max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-8">Also Explore remaining specialties</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Generative AI', emoji: '✨' },
              { name: 'Prompt Eng', emoji: '🎯' },
              { name: 'AI Agents', emoji: '🕵️' },
              { name: 'MLOps', emoji: '⚙️' },
              { name: 'Cloud for AI', emoji: '☁️' },
              { name: 'Git & GitHub', emoji: '🐙' },
            ].map((item, i) => (
              <div key={i} className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
                <span className="text-2xl block mb-2">{item.emoji}</span>
                <span className="text-xs text-slate-400 font-semibold block">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
