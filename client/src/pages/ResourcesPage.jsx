import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Youtube, FileText, Wrench, GraduationCap, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';

const BOOKS = [
  { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', publisher: "O'Reilly Media", level: 'Intermediate', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/' },
  { title: 'Deep Learning', author: 'Goodfellow, Bengio, Courville', publisher: 'MIT Press', level: 'Advanced', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', url: 'https://www.deeplearningbook.org/' },
  { title: 'Pattern Recognition and ML', author: 'Christopher Bishop', publisher: 'Springer', level: 'Expert', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/20', url: 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf' },
  { title: 'Mathematics for Machine Learning', author: 'Deisenroth, Faisal, Ong', publisher: 'Cambridge', level: 'Intermediate', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', url: 'https://mml-book.github.io/' },
  { title: 'Python Machine Learning', author: 'Sebastian Raschka', publisher: 'Packt', level: 'Beginner', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20', url: 'https://github.com/rasbt/python-machine-learning-book' },
  { title: 'The Elements of Statistical Learning', author: 'Hastie, Tibshirani, Friedman', publisher: 'Springer', level: 'Expert', color: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/20', url: 'https://hastie.su.domains/ElemStatLearn/' },
];

const COURSES = [
  { title: 'Machine Learning Specialization', instructor: 'Andrew Ng', platform: 'Coursera', duration: '3 months', free: true, url: 'https://www.coursera.org/specializations/machine-learning-introduction', color: 'from-blue-500/10 to-blue-600/5' },
  { title: 'Deep Learning Specialization', instructor: 'Andrew Ng', platform: 'Coursera', duration: '5 months', free: true, url: 'https://www.coursera.org/specializations/deep-learning', color: 'from-purple-500/10 to-purple-600/5' },
  { title: 'Practical Deep Learning for Coders', instructor: 'Jeremy Howard', platform: 'fast.ai', duration: 'Self-paced', free: true, url: 'https://course.fast.ai/', color: 'from-emerald-500/10 to-emerald-600/5' },
  { title: 'CS50 AI with Python', instructor: 'David Malan', platform: 'Harvard edX', duration: '7 weeks', free: true, url: 'https://cs50.harvard.edu/ai/', color: 'from-red-500/10 to-red-600/5' },
  { title: 'Hugging Face NLP Course', instructor: 'HuggingFace Team', platform: 'Hugging Face', duration: 'Self-paced', free: true, url: 'https://huggingface.co/learn/nlp-course', color: 'from-amber-500/10 to-amber-600/5' },
  { title: 'Full Stack Deep Learning', instructor: 'FSDL Team', platform: 'fsdl.me', duration: 'Self-paced', free: true, url: 'https://fullstackdeeplearning.com/', color: 'from-indigo-500/10 to-indigo-600/5' },
  { title: 'MLOps Zoomcamp', instructor: 'DataTalks.Club', platform: 'DataTalks', duration: '4 months', free: true, url: 'https://github.com/DataTalksClub/mlops-zoomcamp', color: 'from-green-500/10 to-green-600/5' },
  { title: 'Google ML Crash Course', instructor: 'Google Brain', platform: 'Google', duration: '15 hours', free: true, url: 'https://developers.google.com/machine-learning/crash-course', color: 'from-cyan-500/10 to-cyan-600/5' },
];

const YOUTUBE = [
  { name: '3Blue1Brown', topic: 'Neural Networks & Linear Algebra', subs: '6.2M subscribers', url: 'https://youtube.com/@3blue1brown', emoji: '🔵' },
  { name: 'Sentdex', topic: 'Python & ML Tutorials', subs: '1.2M subscribers', url: 'https://youtube.com/@sentdex', emoji: '🐍' },
  { name: 'Andrej Karpathy', topic: 'Neural Networks Zero to Hero', subs: '650K subscribers', url: 'https://youtube.com/@AndrejKarpathy', emoji: '🧠' },
  { name: 'StatQuest with Josh Starmer', topic: 'Statistics & ML Concepts', subs: '1.1M subscribers', url: 'https://youtube.com/@statquest', emoji: '📊' },
  { name: 'Yannic Kilcher', topic: 'ML Research Papers', subs: '330K subscribers', url: 'https://youtube.com/@YannicKilcher', emoji: '📄' },
  { name: 'Two Minute Papers', topic: 'AI Research Summaries', subs: '1.5M subscribers', url: 'https://youtube.com/@TwoMinutePapers', emoji: '⏱️' },
];

const PAPERS = [
  { title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1706.03762', tags: ['Transformers', 'NLP'], color: 'from-purple-900/40 to-indigo-900/10' },
  { title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, venue: 'NAACL', url: 'https://arxiv.org/abs/1810.04805', tags: ['NLP', 'Transfer Learning'], color: 'from-blue-900/40 to-indigo-900/10' },
  { title: 'GPT-3: Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2005.14165', tags: ['LLMs', 'Few-shot'], color: 'from-emerald-900/40 to-teal-900/10' },
  { title: 'Deep Residual Learning for Image Recognition', authors: 'He et al.', year: 2015, venue: 'CVPR', url: 'https://arxiv.org/abs/1512.03385', tags: ['ResNet', 'CV'], color: 'from-sky-900/40 to-blue-900/10' },
  { title: 'Generative Adversarial Networks', authors: 'Goodfellow et al.', year: 2014, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1406.2661', tags: ['GANs', 'Generative'], color: 'from-pink-900/40 to-rose-900/10' },
  { title: 'Denoising Diffusion Probabilistic Models', authors: 'Ho et al.', year: 2020, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2006.11239', tags: ['Diffusion', 'Generative'], color: 'from-amber-900/40 to-orange-900/10' },
];

const TOOLS = [
  { name: 'TensorFlow', emoji: '🔶', desc: "Google's open-source ML framework", cat: 'Framework', url: 'https://tensorflow.org', color: 'from-orange-500/15 to-orange-600/5' },
  { name: 'PyTorch', emoji: '🔥', desc: "Meta's flexible deep learning framework", cat: 'Framework', url: 'https://pytorch.org', color: 'from-red-500/15 to-red-600/5' },
  { name: 'scikit-learn', emoji: '🤖', desc: 'Simple and efficient ML in Python', cat: 'ML Library', url: 'https://scikit-learn.org', color: 'from-blue-500/15 to-blue-600/5' },
  { name: 'Hugging Face', emoji: '🤗', desc: "The AI community's model hub", cat: 'Platform', url: 'https://huggingface.co', color: 'from-amber-500/15 to-amber-600/5' },
  { name: 'LangChain', emoji: '🔗', desc: 'Framework for LLM-powered apps', cat: 'LLM Framework', url: 'https://langchain.com', color: 'from-green-500/15 to-green-600/5' },
  { name: 'OpenCV', emoji: '👁️', desc: 'Computer vision library', cat: 'CV Library', url: 'https://opencv.org', color: 'from-sky-500/15 to-sky-600/5' },
  { name: 'Pandas', emoji: '🐼', desc: 'Data analysis and manipulation', cat: 'Data Library', url: 'https://pandas.pydata.org', color: 'from-purple-500/15 to-purple-600/5' },
  { name: 'NumPy', emoji: '🔢', desc: 'Numerical computing in Python', cat: 'Math Library', url: 'https://numpy.org', color: 'from-indigo-500/15 to-indigo-600/5' },
  { name: 'Kaggle', emoji: '🏆', desc: 'Data science competition platform', cat: 'Platform', url: 'https://kaggle.com', color: 'from-blue-500/15 to-cyan-600/5' },
  { name: 'Google Colab', emoji: '🌐', desc: 'Free GPU-powered Jupyter notebooks', cat: 'Platform', url: 'https://colab.google', color: 'from-orange-500/15 to-amber-600/5' },
  { name: 'MLflow', emoji: '📊', desc: 'ML experiment tracking and registry', cat: 'MLOps', url: 'https://mlflow.org', color: 'from-blue-500/15 to-sky-600/5' },
  { name: 'Weights & Biases', emoji: '🐝', desc: 'ML experiment monitoring platform', cat: 'MLOps', url: 'https://wandb.ai', color: 'from-yellow-500/15 to-amber-600/5' },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('books');

  const tabs = [
    { id: 'books', name: 'Books', icon: BookOpen },
    { id: 'courses', name: 'Courses', icon: GraduationCap },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'papers', name: 'Papers', icon: FileText },
    { id: 'tools', name: 'Tools', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Curated Resources</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            The best books, online courses, youtube playlists, research papers, and developer tools to master AI.
          </p>
        </div>

        {/* Tabs selector */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab contents */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === 'books' &&
              BOOKS.map((book, idx) => (
                <div
                  key={idx}
                  className={`backdrop-blur-md bg-gradient-to-br ${book.color} border ${book.border} rounded-2xl p-6 flex flex-col justify-between`}
                >
                  <div>
                    <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                      {book.level}
                    </span>
                    <h3 className="text-base font-bold text-white mt-4 mb-1">{book.title}</h3>
                    <p className="text-xs text-indigo-300 font-semibold mb-3">{book.author}</p>
                    <p className="text-[11px] text-slate-500">Publisher: {book.publisher}</p>
                  </div>
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
                  >
                    View Publication
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}

            {activeTab === 'courses' &&
              COURSES.map((course, idx) => (
                <div
                  key={idx}
                  className={`backdrop-blur-md bg-gradient-to-br ${course.color} border border-white/5 hover:border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between transition-colors`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold">
                        {course.platform}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{course.duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-xs text-slate-400">Instructor: {course.instructor}</p>
                  </div>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full mt-6 py-2 bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    Learn More
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}

            {activeTab === 'youtube' &&
              YOUTUBE.map((yt, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between transition-all"
                >
                  <div>
                    <span className="text-3xl mb-4 block">{yt.emoji}</span>
                    <h3 className="text-base font-bold text-white mb-1">{yt.name}</h3>
                    <p className="text-xs text-slate-400 mb-2">{yt.topic}</p>
                    <p className="text-[10px] text-slate-500">{yt.subs}</p>
                  </div>
                  <a
                    href={yt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full mt-6 py-2 bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    Watch Channel
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}

            {activeTab === 'papers' &&
              PAPERS.map((paper, idx) => (
                <div
                  key={idx}
                  className={`backdrop-blur-md bg-gradient-to-br ${paper.color} border border-white/5 rounded-2xl p-6 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase">{paper.venue}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{paper.year}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-3">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Authors: {paper.authors}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {paper.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] bg-white/5 text-slate-400 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
                  >
                    Read on arXiv
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}

            {activeTab === 'tools' &&
              TOOLS.map((tool, idx) => (
                <div
                  key={idx}
                  className={`backdrop-blur-md bg-gradient-to-br ${tool.color} border border-white/5 hover:border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between transition-all`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-3xl">{tool.emoji}</span>
                      <span className="text-[9px] font-bold bg-white/5 text-slate-400 px-2 py-0.5 rounded">
                        {tool.cat}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{tool.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tool.desc}</p>
                  </div>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full mt-6 py-2 bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    Visit Website
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
