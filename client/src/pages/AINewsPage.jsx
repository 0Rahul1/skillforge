import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Clock, Newspaper, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';

const NEWS_DATA = [
  { id: 1, source: 'OpenAI', sourceColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10', title: 'GPT-5 Achieves Human-Level Performance on Reasoning Benchmarks', description: 'OpenAI releases GPT-5 with unprecedented reasoning capabilities, scoring 98.7% on MMLU and introducing new chain-of-thought architectures that mimic human cognitive processes.', date: 'Jun 15, 2025', readTime: '4 min read', url: 'https://openai.com/blog', category: 'LLMs', gradient: 'from-emerald-950/20 to-emerald-900/10' },
  { id: 2, source: 'Google DeepMind', sourceColor: 'text-blue-400 border-blue-500/20 bg-blue-500/10', title: 'Gemini Ultra 2.0 Sets New State-of-the-Art on 32 AI Benchmarks', description: 'DeepMind announces Gemini Ultra 2.0 with native multimodal capabilities, processing video, audio, and code simultaneously with improved efficiency.', date: 'Jun 10, 2025', readTime: '5 min read', url: 'https://deepmind.google', category: 'Multimodal', gradient: 'from-blue-950/20 to-blue-900/10' },
  { id: 3, source: 'Anthropic', sourceColor: 'text-amber-400 border-amber-500/20 bg-amber-500/10', title: 'Claude 4 Introduces Constitutional AI 2.0 for Safer Alignment', description: 'Anthropic reveals Constitutional AI 2.0, a breakthrough in AI safety research that allows models to self-critique and align with human values more effectively.', date: 'Jun 8, 2025', readTime: '6 min read', url: 'https://anthropic.com', category: 'AI Safety', gradient: 'from-amber-950/20 to-amber-900/10' },
  { id: 4, source: 'Meta AI', sourceColor: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10', title: 'LLaMA 4 Released Open Source — 405B Parameters, Beats GPT-4', description: 'Meta releases LLaMA 4 as fully open source under research license. The 405B model outperforms GPT-4 on coding and mathematical reasoning tasks.', date: 'Jun 5, 2025', readTime: '4 min read', url: 'https://llama.meta.com', category: 'Open Source', gradient: 'from-indigo-950/20 to-indigo-900/10' },
  { id: 5, source: 'NVIDIA', sourceColor: 'text-green-400 border-green-500/20 bg-green-500/10', title: 'H200 Tensor Core GPU Delivers 4x Speed on Transformer Training', description: 'NVIDIA announces the H200 GPU with HBM3e memory, reducing large language model training time by 400% compared to H100, enabling faster AI research cycles.', date: 'Jun 1, 2025', readTime: '3 min read', url: 'https://nvidia.com/ai', category: 'Hardware', gradient: 'from-green-950/20 to-green-900/10' },
  { id: 6, source: 'Hugging Face', sourceColor: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10', title: 'SmolLM2 Outperforms Larger Models on Edge Devices', description: 'Hugging Face releases SmolLM2, a family of highly efficient small language models that achieve state-of-the-art performance on edge devices like phones and laptops.', date: 'May 28, 2025', readTime: '4 min read', url: 'https://huggingface.co/blog', category: 'Efficiency', gradient: 'from-yellow-950/20 to-yellow-900/10' },
  { id: 7, source: 'OpenAI', sourceColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10', title: 'Sora 2.0 Generates Photorealistic 4K Video from Text Prompts', description: 'OpenAI releases Sora 2.0 capable of generating 4K resolution, 2-minute videos from text descriptions with consistent physics simulation and character coherence.', date: 'May 25, 2025', readTime: '5 min read', url: 'https://openai.com/sora', category: 'Video AI', gradient: 'from-emerald-950/20 to-emerald-900/10' },
  { id: 8, source: 'Microsoft', sourceColor: 'text-sky-400 border-sky-500/20 bg-sky-500/10', title: 'Azure AI Studio Launches No-Code ML Pipeline Builder', description: 'Microsoft introduces a drag-and-drop ML pipeline builder in Azure AI Studio, enabling businesses to deploy custom AI models without writing code.', date: 'May 20, 2025', readTime: '3 min read', url: 'https://azure.microsoft.com/ai', category: 'MLOps', gradient: 'from-sky-950/20 to-sky-900/10' },
  { id: 9, source: 'Google DeepMind', sourceColor: 'text-blue-400 border-blue-500/20 bg-blue-500/10', title: 'AlphaFold 3 Predicts All Molecular Structures in Human Body', description: 'DeepMind extends AlphaFold 3 to predict DNA, RNA, and small molecule structures alongside proteins, completing the full molecular atlas of the human proteome.', date: 'May 15, 2025', readTime: '7 min read', url: 'https://alphafold.ebi.ac.uk', category: 'Science', gradient: 'from-blue-950/20 to-blue-900/10' },
  { id: 10, source: 'Meta AI', sourceColor: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10', title: 'SAM 2.5 Segments Any Object in Real-Time Video', description: 'Meta\'s Segment Anything Model 2.5 achieves real-time video segmentation at 60fps, enabling precise object tracking for robotics, AR, and medical imaging.', date: 'May 10, 2025', readTime: '4 min read', url: 'https://segment-anything.com', category: 'Computer Vision', gradient: 'from-indigo-950/20 to-indigo-900/10' },
  { id: 11, source: 'Anthropic', sourceColor: 'text-amber-400 border-amber-500/20 bg-amber-500/10', title: 'Claude API Adds Computer Use Feature for Autonomous Task Execution', description: 'Anthropic\'s Claude can now control computers autonomously — browsing the web, filling forms, and executing multi-step workflows without human intervention.', date: 'May 5, 2025', readTime: '5 min read', url: 'https://anthropic.com/api', category: 'AI Agents', gradient: 'from-amber-950/20 to-amber-900/10' },
  { id: 12, source: 'NVIDIA', sourceColor: 'text-green-400 border-green-500/20 bg-green-500/10', title: 'NIM Microservices Enable On-Premise LLM Deployment in Minutes', description: 'NVIDIA Inference Microservices (NIM) allows enterprises to deploy production-grade LLMs on-premise in under 10 minutes with enterprise-grade security and compliance.', date: 'Apr 30, 2025', readTime: '4 min read', url: 'https://developer.nvidia.com/nim', category: 'MLOps', gradient: 'from-green-950/20 to-green-900/10' },
];

export default function AINewsPage() {
  const [selectedSource, setSelectedSource] = useState('all');

  const filteredNews = NEWS_DATA.filter(
    (item) => selectedSource === 'all' || item.source.toLowerCase() === selectedSource.toLowerCase()
  );

  const sources = ['all', 'OpenAI', 'Google DeepMind', 'Anthropic', 'Meta AI', 'NVIDIA'];

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight mb-4"
          >
            Latest AI News & Breakthroughs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            Stay current with curated summaries and documentation of technical breakthroughs from top research labs.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                  selectedSource === src
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {src.replace('Google ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredNews.map((news) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={news.id}
                whileHover={{ y: -4 }}
                className={`backdrop-blur-md bg-gradient-to-br ${news.gradient} border border-white/5 hover:border-indigo-500/20 rounded-2xl p-6 transition-all relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  {/* Source + Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${news.sourceColor}`}
                    >
                      {news.source}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{news.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                    {news.description}
                  </p>
                </div>

                {/* Footer link */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {news.readTime}
                  </span>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Read official log
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
