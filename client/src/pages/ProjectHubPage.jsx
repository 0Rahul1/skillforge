import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Clock, Code, Zap, Filter, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';

const PROJECTS_DATA = [
  // BEGINNER
  { id: 'spam', name: 'Spam Email Classifier', desc: 'Build a machine learning model to classify emails as spam or ham using Naive Bayes and TF-IDF vectors in Python.', category: 'beginner', difficulty: 'Beginner', skills: ['Python', 'Scikit-Learn', 'NLP', 'Pandas'], time: '2-3 days', icon: '📧', color: '#10b981', github: 'https://github.com/topics/spam-classifier', tags: ['NLP', 'Classification'] },
  { id: 'house', name: 'House Price Prediction', desc: 'Predict real estate prices using regression techniques like Lasso, Ridge, and Random Forest on historical housing datasets.', category: 'beginner', difficulty: 'Beginner', skills: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'], time: '2-3 days', icon: '🏠', color: '#3b82f6', github: 'https://github.com/topics/house-price-prediction', tags: ['Regression', 'ML'] },
  { id: 'iris', name: 'Iris Flower Classifier', desc: 'Classic machine learning classification project introducing KNN, SVM, and decision trees on the famous Iris dataset.', category: 'beginner', difficulty: 'Beginner', skills: ['Python', 'Scikit-Learn', 'NumPy', 'Matplotlib'], time: '1-2 days', icon: '🌸', color: '#ec4899', github: 'https://github.com/topics/iris-classification', tags: ['Classification', 'ML'] },
  { id: 'titanic', name: 'Titanic Survival Prediction', desc: 'Predict passenger survival on the Titanic using classification models and feature engineering on Kaggle.', category: 'beginner', difficulty: 'Beginner', skills: ['Python', 'Pandas', 'Scikit-Learn', 'Seaborn'], time: '2-3 days', icon: '🚢', color: '#6366f1', github: 'https://github.com/topics/titanic-survival-prediction', tags: ['Classification', 'EDA'] },
  { id: 'movie-rating', name: 'Movie Rating Predictor', desc: 'Build a movie rating predictor using content-based features like genre, cast, and director metadata.', category: 'beginner', difficulty: 'Beginner', skills: ['Python', 'Pandas', 'Scikit-Learn', 'Matplotlib'], time: '3-4 days', icon: '🎬', color: '#f59e0b', github: 'https://github.com/topics/movie-rating-prediction', tags: ['Regression', 'EDA'] },
  // INTERMEDIATE
  { id: 'sentiment', name: 'Sentiment Analysis Engine', desc: 'Analyze Twitter or product review sentiment in real-time using deep learning models like LSTM or Hugging Face BERT.', category: 'intermediate', difficulty: 'Intermediate', skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI'], time: '5-7 days', icon: '💬', color: '#8b5cf6', github: 'https://github.com/topics/sentiment-analysis', tags: ['NLP', 'Deep Learning'] },
  { id: 'recommender', name: 'Movie Recommendation System', desc: 'Build a collaborative filtering movie recommender engine using matrix factorization and cosine similarity.', category: 'intermediate', difficulty: 'Intermediate', skills: ['Python', 'NumPy', 'Scikit-Learn', 'Flask'], time: '5-7 days', icon: '🎯', color: '#14b8a6', github: 'https://github.com/topics/recommendation-system', tags: ['ML', 'RecSys'] },
  { id: 'face', name: 'Face Detection System', desc: 'Detect and recognize faces in live webcam feeds or images using Haar Cascades, MTCNN, or DeepFace models in OpenCV.', category: 'intermediate', difficulty: 'Intermediate', skills: ['Python', 'OpenCV', 'TensorFlow', 'NumPy'], time: '4-6 days', icon: '👤', color: '#f97316', github: 'https://github.com/topics/face-detection', tags: ['CV', 'Deep Learning'] },
  { id: 'cnn', name: 'Image Classifier (CNN)', desc: 'Design and train a Convolutional Neural Network (CNN) from scratch on CIFAR-10 to classify images into 10 categories.', category: 'intermediate', difficulty: 'Intermediate', skills: ['Python', 'TensorFlow', 'Keras', 'NumPy'], time: '5-7 days', icon: '🖼️', color: '#0ea5e9', github: 'https://github.com/topics/image-classification', tags: ['CV', 'CNN'] },
  { id: 'ner', name: 'Named Entity Recognition', desc: 'Extract entities like organizations, locations, and names from text datasets using SpaCy and fine-tuned BERT models.', category: 'intermediate', difficulty: 'Intermediate', skills: ['Python', 'SpaCy', 'Transformers', 'Pandas'], time: '4-6 days', icon: '🏷️', color: '#a855f7', github: 'https://github.com/topics/named-entity-recognition', tags: ['NLP', 'BERT'] },
  // ADVANCED
  { id: 'yolo', name: 'Object Detection (YOLO)', desc: 'Implement a real-time object detector on custom datasets or video feeds using YOLOv8 or SSD models in PyTorch.', category: 'advanced', difficulty: 'Advanced', skills: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch'], time: '7-10 days', icon: '🎯', color: '#ef4444', github: 'https://github.com/ultralytics/ultralytics', tags: ['CV', 'YOLO'] },
  { id: 'resume', name: 'AI Resume Screener', desc: 'Build an automated resume parsing and scoring system using TF-IDF, Cosine Similarity, and transformer embeddings.', category: 'advanced', difficulty: 'Advanced', skills: ['Python', 'Transformers', 'FastAPI', 'React'], time: '7-10 days', icon: '📄', color: '#6366f1', github: 'https://github.com/topics/resume-screening', tags: ['NLP', 'AI App'] },
  { id: 'rag', name: 'RAG Chatbot', desc: 'Build a Retrieval-Augmented Generation chatbot that answers questions based on uploaded documents using LangChain and Pinecone.', category: 'advanced', difficulty: 'Advanced', skills: ['Python', 'LangChain', 'Pinecone', 'OpenAI API'], time: '5-8 days', icon: '🤖', color: '#8b5cf6', github: 'https://github.com/topics/rag-chatbot', tags: ['LLM', 'LangChain'] },
  { id: 'voice', name: 'AI Voice Assistant', desc: 'Create an offline/online voice assistant that uses OpenAI Whisper for speech-to-text and a local LLM via Ollama for answers.', category: 'advanced', difficulty: 'Advanced', skills: ['Python', 'Whisper', 'Ollama', 'TTS'], time: '7-10 days', icon: '🎙️', color: '#ec4899', github: 'https://github.com/topics/voice-assistant', tags: ['LLM', 'Speech'] },
  { id: 'fakenews', name: 'Fake News Detector', desc: 'Build a machine learning ensemble or transformer model to detect deceptive news articles with advanced classification techniques.', category: 'advanced', difficulty: 'Advanced', skills: ['Python', 'BERT', 'Transformers', 'FastAPI'], time: '6-9 days', icon: '📰', color: '#f59e0b', github: 'https://github.com/topics/fake-news-detection', tags: ['NLP', 'Classification'] },
  { id: 'emotion', name: 'Emotion Detection AI', desc: 'Real-time facial expression and emotion recognition utilizing custom CNNs deployed with a React dashboard.', category: 'advanced', difficulty: 'Advanced', skills: ['Python', 'TensorFlow', 'OpenCV', 'React'], time: '7-10 days', icon: '😊', color: '#22c55e', github: 'https://github.com/topics/emotion-detection', tags: ['CV', 'Deep Learning'] },
];

export default function ProjectHubPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || proj.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            AI Hands-On Project Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            Build your portfolio with guided models, documentation, and starter repositories.
          </motion.p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search projects by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>

          {/* Difficulty filter tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-full md:w-auto">
            {['all', 'beginner', 'intermediate', 'advanced'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Projects */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={proj.id}
                whileHover={{ y: -4 }}
                className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 rounded-2xl p-6 transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2.5px]"
                  style={{ backgroundColor: proj.color }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{proj.icon}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        proj.category === 'beginner'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : proj.category === 'intermediate'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      {proj.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{proj.name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                    {proj.desc}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-white/5 border border-white/5 text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Est: {proj.time}
                  </span>

                  <div className="flex gap-2">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-white/10 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => navigate('/resources')}
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                    >
                      View Docs
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
