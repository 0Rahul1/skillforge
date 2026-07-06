import express from 'express';
const router = express.Router();

const projects = [
  // BEGINNER
  {
    id: 'spam-classifier',
    name: 'Spam Email Classifier',
    description: 'Build a machine learning model to classify emails as spam or ham using Naive Bayes and TF-IDF vectors in Python.',
    category: 'beginner',
    difficulty: 'Beginner',
    skills: ['Python', 'Scikit-Learn', 'NLP', 'Pandas'],
    estimatedTime: '2-3 days',
    githubUrl: 'https://github.com/topics/spam-classifier',
    docsUrl: 'https://scikit-learn.org/stable/modules/naive_bayes.html',
    tags: ['NLP', 'Classification'],
    icon: '📧',
    color: '#10b981'
  },
  {
    id: 'house-price',
    name: 'House Price Prediction',
    description: 'Predict real estate prices using regression techniques like Lasso, Ridge, and Random Forest on historical housing datasets.',
    category: 'beginner',
    difficulty: 'Beginner',
    skills: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
    estimatedTime: '2-3 days',
    githubUrl: 'https://github.com/topics/house-price-prediction',
    docsUrl: 'https://scikit-learn.org/stable/modules/linear_model.html',
    tags: ['Regression', 'ML'],
    icon: '🏠',
    color: '#3b82f6'
  },
  {
    id: 'iris-classifier',
    name: 'Iris Flower Classifier',
    description: 'Classic machine learning classification project introducing KNN, SVM, and decision trees on the famous Iris dataset.',
    category: 'beginner',
    difficulty: 'Beginner',
    skills: ['Python', 'Scikit-Learn', 'NumPy', 'Matplotlib'],
    estimatedTime: '1-2 days',
    githubUrl: 'https://github.com/topics/iris-classification',
    docsUrl: 'https://scikit-learn.org/stable/auto_examples/datasets/plot_iris_dataset.html',
    tags: ['Classification', 'ML'],
    icon: '🌸',
    color: '#ec4899'
  },
  {
    id: 'titanic-survival',
    name: 'Titanic Survival Prediction',
    description: 'Predict passenger survival on the Titanic using classification models and feature engineering on Kaggle.',
    category: 'beginner',
    difficulty: 'Beginner',
    skills: ['Python', 'Pandas', 'Scikit-Learn', 'Seaborn'],
    estimatedTime: '2-3 days',
    githubUrl: 'https://github.com/topics/titanic-survival-prediction',
    docsUrl: 'https://www.kaggle.com/c/titanic',
    tags: ['Classification', 'EDA'],
    icon: '🚢',
    color: '#6366f1'
  },
  {
    id: 'movie-rating',
    name: 'Movie Rating Predictor',
    description: 'Build a movie rating predictor using content-based features like genre, cast, and director metadata.',
    category: 'beginner',
    difficulty: 'Beginner',
    skills: ['Python', 'Pandas', 'Scikit-Learn', 'Matplotlib'],
    estimatedTime: '3-4 days',
    githubUrl: 'https://github.com/topics/movie-rating-prediction',
    docsUrl: 'https://pandas.pydata.org/docs/',
    tags: ['Regression', 'EDA'],
    icon: '🎬',
    color: '#f59e0b'
  },
  // INTERMEDIATE
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis Engine',
    description: 'Analyze Twitter or product review sentiment in real-time using deep learning models like LSTM or Hugging Face BERT.',
    category: 'intermediate',
    difficulty: 'Intermediate',
    skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI'],
    estimatedTime: '5-7 days',
    githubUrl: 'https://github.com/topics/sentiment-analysis',
    docsUrl: 'https://huggingface.co/docs/transformers/index',
    tags: ['NLP', 'Deep Learning'],
    icon: '💬',
    color: '#8b5cf6'
  },
  {
    id: 'recommender-system',
    name: 'Movie Recommendation System',
    description: 'Build a collaborative filtering movie recommender engine using matrix factorization and cosine similarity.',
    category: 'intermediate',
    difficulty: 'Intermediate',
    skills: ['Python', 'NumPy', 'Scikit-Learn', 'Flask'],
    estimatedTime: '5-7 days',
    githubUrl: 'https://github.com/topics/recommendation-system',
    docsUrl: 'https://scikit-learn.org/stable/modules/metrics.html#pairwise-metrics',
    tags: ['ML', 'RecSys'],
    icon: '🎯',
    color: '#14b8a6'
  },
  {
    id: 'face-detection',
    name: 'Face Detection System',
    description: 'Detect and recognize faces in live webcam feeds or images using Haar Cascades, MTCNN, or DeepFace models in OpenCV.',
    category: 'intermediate',
    difficulty: 'Intermediate',
    skills: ['Python', 'OpenCV', 'TensorFlow', 'NumPy'],
    estimatedTime: '4-6 days',
    githubUrl: 'https://github.com/topics/face-detection',
    docsUrl: 'https://docs.opencv.org/master/',
    tags: ['CV', 'Deep Learning'],
    icon: '👤',
    color: '#f97316'
  },
  {
    id: 'image-classifier',
    name: 'Image Classifier (CNN)',
    description: 'Design and train a Convolutional Neural Network (CNN) from scratch on CIFAR-10 to classify images into 10 categories.',
    category: 'intermediate',
    difficulty: 'Intermediate',
    skills: ['Python', 'TensorFlow', 'Keras', 'NumPy'],
    estimatedTime: '5-7 days',
    githubUrl: 'https://github.com/topics/image-classification',
    docsUrl: 'https://www.tensorflow.org/tutorials/images/cnn',
    tags: ['CV', 'CNN'],
    icon: '🖼️',
    color: '#0ea5e9'
  },
  {
    id: 'ner-extractor',
    name: 'Named Entity Recognition',
    description: 'Extract entities like organizations, locations, and names from text datasets using SpaCy and fine-tuned BERT models.',
    category: 'intermediate',
    difficulty: 'Intermediate',
    skills: ['Python', 'SpaCy', 'Transformers', 'Pandas'],
    estimatedTime: '4-6 days',
    githubUrl: 'https://github.com/topics/named-entity-recognition',
    docsUrl: 'https://spacy.io/usage/linguistic-features#named-entities',
    tags: ['NLP', 'BERT'],
    icon: '🏷️',
    color: '#a855f7'
  },
  // ADVANCED
  {
    id: 'object-detection',
    name: 'Object Detection (YOLO)',
    description: 'Implement a real-time object detector on custom datasets or video feeds using YOLOv8 or SSD models in PyTorch.',
    category: 'advanced',
    difficulty: 'Advanced',
    skills: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch'],
    estimatedTime: '7-10 days',
    githubUrl: 'https://github.com/ultralytics/ultralytics',
    docsUrl: 'https://docs.ultralytics.com/',
    tags: ['CV', 'YOLO'],
    icon: '🎯',
    color: '#ef4444'
  },
  {
    id: 'resume-screener',
    name: 'AI Resume Screener',
    description: 'Build an automated resume parsing and scoring system using TF-IDF, Cosine Similarity, and transformer embeddings.',
    category: 'advanced',
    difficulty: 'Advanced',
    skills: ['Python', 'Transformers', 'FastAPI', 'React'],
    estimatedTime: '7-10 days',
    githubUrl: 'https://github.com/topics/resume-screening',
    docsUrl: 'https://fastapi.tiangolo.com/',
    tags: ['NLP', 'AI App'],
    icon: '📄',
    color: '#6366f1'
  },
  {
    id: 'rag-chatbot',
    name: 'RAG Chatbot',
    description: 'Build a Retrieval-Augmented Generation chatbot that answers questions based on uploaded documents using LangChain and Pinecone.',
    category: 'advanced',
    difficulty: 'Advanced',
    skills: ['Python', 'LangChain', 'Pinecone', 'OpenAI API'],
    estimatedTime: '5-8 days',
    githubUrl: 'https://github.com/topics/rag-chatbot',
    docsUrl: 'https://python.langchain.com/docs/get_started/introduction',
    tags: ['LLM', 'LangChain'],
    icon: '🤖',
    color: '#8b5cf6'
  },
  {
    id: 'voice-assistant',
    name: 'AI Voice Assistant',
    description: 'Create an offline/online voice assistant that uses OpenAI Whisper for speech-to-text and a local LLM via Ollama for answers.',
    category: 'advanced',
    difficulty: 'Advanced',
    skills: ['Python', 'Whisper', 'Ollama', 'TTS'],
    estimatedTime: '7-10 days',
    githubUrl: 'https://github.com/topics/voice-assistant',
    docsUrl: 'https://github.com/openai/whisper',
    tags: ['LLM', 'Speech'],
    icon: '🎙️',
    color: '#ec4899'
  },
  {
    id: 'fake-news',
    name: 'Fake News Detector',
    description: 'Build a machine learning ensemble or transformer model to detect deceptive news articles with advanced classification techniques.',
    category: 'advanced',
    difficulty: 'Advanced',
    skills: ['Python', 'BERT', 'Transformers', 'FastAPI'],
    estimatedTime: '6-9 days',
    githubUrl: 'https://github.com/topics/fake-news-detection',
    docsUrl: 'https://huggingface.co/docs/transformers/training',
    tags: ['NLP', 'Classification'],
    icon: '📰',
    color: '#f59e0b'
  },
  {
    id: 'emotion-detection',
    name: 'Emotion Detection AI',
    description: 'Real-time facial expression and emotion recognition utilizing custom CNNs deployed with a React dashboard.',
    category: 'advanced',
    difficulty: 'Advanced',
    skills: ['Python', 'TensorFlow', 'OpenCV', 'React'],
    estimatedTime: '7-10 days',
    githubUrl: 'https://github.com/topics/emotion-detection',
    docsUrl: 'https://www.tensorflow.org/tutorials/keras/classification',
    tags: ['CV', 'Deep Learning'],
    icon: '😊',
    color: '#22c55e'
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, projects });
});

export default router;
