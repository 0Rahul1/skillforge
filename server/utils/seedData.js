import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Domain from '../models/Domain.js';
import Question from '../models/Question.js';
import User from '../models/User.js';

dotenv.config();

const domains = [
  {
    "name": "Artificial Intelligence",
    "slug": "artificial-intelligence",
    "icon": "\ud83e\udd16",
    "color": "#8b5cf6",
    "gradient": "from-violet-500 to-purple-700",
    "avgDuration": 35,
    "difficulty": "advanced",
    "topics": [
      "Search Algorithms",
      "Knowledge Representation",
      "Planning",
      "AI Ethics",
      "Intelligent Agents"
    ],
    "description": "Explore foundations of AI including search, planning, and intelligent systems."
  },
  {
    "name": "Machine Learning",
    "slug": "machine-learning",
    "icon": "\ud83e\udde0",
    "color": "#6366f1",
    "gradient": "from-indigo-500 to-violet-600",
    "avgDuration": 40,
    "difficulty": "advanced",
    "topics": [
      "Supervised Learning",
      "Unsupervised Learning",
      "Model Evaluation",
      "Feature Engineering",
      "Ensemble Methods"
    ],
    "description": "Master ML algorithms from linear regression to advanced ensemble techniques."
  },
  {
    "name": "Deep Learning",
    "slug": "deep-learning",
    "icon": "\u26a1",
    "color": "#a855f7",
    "gradient": "from-purple-500 to-pink-600",
    "avgDuration": 45,
    "difficulty": "expert",
    "topics": [
      "Neural Networks",
      "CNNs",
      "RNNs & LSTMs",
      "Transformers",
      "Optimization"
    ],
    "description": "Dive deep into neural networks, CNNs, RNNs, and modern transformer architectures."
  },
  {
    "name": "Data Science",
    "slug": "data-science",
    "icon": "\ud83d\udcca",
    "color": "#10b981",
    "gradient": "from-emerald-500 to-teal-600",
    "avgDuration": 35,
    "difficulty": "intermediate",
    "topics": [
      "EDA",
      "Pandas",
      "NumPy",
      "Visualization",
      "Feature Engineering"
    ],
    "description": "Learn the complete data science pipeline from EDA to model deployment."
  },
  {
    "name": "Computer Vision",
    "slug": "computer-vision",
    "icon": "\ud83d\udc41\ufe0f",
    "color": "#0ea5e9",
    "gradient": "from-sky-500 to-blue-600",
    "avgDuration": 40,
    "difficulty": "advanced",
    "topics": [
      "Image Processing",
      "Object Detection",
      "Segmentation",
      "OpenCV",
      "Vision Transformers"
    ],
    "description": "Build systems that see using OpenCV, CNNs, and modern vision transformers."
  },
  {
    "name": "Natural Language Processing",
    "slug": "nlp",
    "icon": "\ud83d\udcac",
    "color": "#f59e0b",
    "gradient": "from-amber-500 to-orange-600",
    "avgDuration": 40,
    "difficulty": "advanced",
    "topics": [
      "Tokenization",
      "Embeddings",
      "Transformers",
      "BERT",
      "Text Classification"
    ],
    "description": "Process human language with transformers, BERT, GPT, and modern NLP pipelines."
  },
  {
    "name": "Generative AI",
    "slug": "generative-ai",
    "icon": "\u2728",
    "color": "#ec4899",
    "gradient": "from-pink-500 to-rose-600",
    "avgDuration": 35,
    "difficulty": "advanced",
    "topics": [
      "GANs",
      "VAEs",
      "Diffusion Models",
      "LLMs",
      "Stable Diffusion"
    ],
    "description": "Master GANs, diffusion models, and large language models powering the AI revolution."
  },
  {
    "name": "Prompt Engineering",
    "slug": "prompt-engineering",
    "icon": "\ud83c\udfaf",
    "color": "#14b8a6",
    "gradient": "from-teal-500 to-cyan-600",
    "avgDuration": 25,
    "difficulty": "beginner",
    "topics": [
      "Zero-shot",
      "Few-shot",
      "Chain of Thought",
      "RAG",
      "System Prompts"
    ],
    "description": "Design effective prompts for GPT-4, Claude, Gemini and maximize AI output quality."
  },
  {
    "name": "AI Agents",
    "slug": "ai-agents",
    "icon": "\ud83d\udd75\ufe0f",
    "color": "#f97316",
    "gradient": "from-orange-500 to-red-600",
    "avgDuration": 40,
    "difficulty": "expert",
    "topics": [
      "ReAct Framework",
      "LangChain",
      "Tool Use",
      "Multi-Agent Systems",
      "Memory"
    ],
    "description": "Build autonomous AI agents using LangChain, AutoGPT, and multi-agent frameworks."
  },
  {
    "name": "Python",
    "slug": "python",
    "icon": "\ud83d\udc0d",
    "color": "#3b82f6",
    "gradient": "from-blue-500 to-indigo-600",
    "avgDuration": 30,
    "difficulty": "beginner",
    "topics": [
      "Core Python",
      "OOP",
      "NumPy",
      "Pandas",
      "Decorators"
    ],
    "description": "Master Python for AI/ML including OOP, scientific computing, and advanced patterns."
  },
  {
    "name": "Mathematics for AI",
    "slug": "math-for-ai",
    "icon": "\u2211",
    "color": "#8b5cf6",
    "gradient": "from-violet-600 to-indigo-700",
    "avgDuration": 35,
    "difficulty": "intermediate",
    "topics": [
      "Linear Algebra",
      "Calculus",
      "Probability",
      "Optimization",
      "Matrix Operations"
    ],
    "description": "Build intuition for the math that powers every ML algorithm \u2014 vectors, gradients, and more."
  },
  {
    "name": "Statistics",
    "slug": "statistics",
    "icon": "\ud83d\udcc8",
    "color": "#06b6d4",
    "gradient": "from-cyan-500 to-sky-600",
    "avgDuration": 30,
    "difficulty": "intermediate",
    "topics": [
      "Hypothesis Testing",
      "Bayesian Stats",
      "Regression",
      "Distributions",
      "A/B Testing"
    ],
    "description": "Master statistical inference, hypothesis testing, Bayesian methods, and probability theory."
  },
  {
    "name": "Data Structures & Algorithms",
    "slug": "dsa",
    "icon": "\ud83c\udf32",
    "color": "#22c55e",
    "gradient": "from-green-500 to-emerald-600",
    "avgDuration": 40,
    "difficulty": "intermediate",
    "topics": [
      "Arrays",
      "Trees & Graphs",
      "Dynamic Programming",
      "Sorting",
      "Complexity"
    ],
    "description": "Strengthen problem-solving with trees, graphs, dynamic programming, and algorithm analysis."
  },
  {
    "name": "MLOps",
    "slug": "mlops",
    "icon": "\u2699\ufe0f",
    "color": "#f59e0b",
    "gradient": "from-amber-500 to-yellow-600",
    "avgDuration": 35,
    "difficulty": "advanced",
    "topics": [
      "MLflow",
      "DVC",
      "Model Serving",
      "Monitoring",
      "CI/CD for ML"
    ],
    "description": "Deploy, monitor, and scale ML models in production using MLflow, DVC, and cloud platforms."
  },
  {
    "name": "Cloud for AI",
    "slug": "cloud-for-ai",
    "icon": "\u2601\ufe0f",
    "color": "#0ea5e9",
    "gradient": "from-sky-400 to-blue-600",
    "avgDuration": 30,
    "difficulty": "intermediate",
    "topics": [
      "AWS SageMaker",
      "Google Vertex AI",
      "Azure ML",
      "Cloud Storage",
      "Serverless AI"
    ],
    "description": "Leverage AWS SageMaker, Google Vertex AI, and Azure ML to train and deploy models at scale."
  },
  {
    "name": "Frontend Development",
    "slug": "frontend",
    "icon": "\ud83c\udfa8",
    "color": "#ec4899",
    "gradient": "from-pink-500 to-fuchsia-600",
    "avgDuration": 35,
    "difficulty": "intermediate",
    "topics": [
      "React",
      "Next.js",
      "TypeScript",
      "CSS/Tailwind",
      "API Integration"
    ],
    "description": "Build modern UIs with React, Next.js, and TypeScript that integrate seamlessly with AI APIs."
  },
  {
    "name": "Backend Development",
    "slug": "backend",
    "icon": "\ud83d\udd27",
    "color": "#6366f1",
    "gradient": "from-indigo-500 to-blue-600",
    "avgDuration": 35,
    "difficulty": "intermediate",
    "topics": [
      "Node.js",
      "FastAPI",
      "REST APIs",
      "Databases",
      "Authentication"
    ],
    "description": "Build scalable APIs and backend systems with Node.js, FastAPI, and databases."
  },
  {
    "name": "Git & GitHub",
    "slug": "git-github",
    "icon": "\ud83d\udc19",
    "color": "#64748b",
    "gradient": "from-slate-500 to-gray-700",
    "avgDuration": 20,
    "difficulty": "beginner",
    "topics": [
      "Git Basics",
      "Branching",
      "Pull Requests",
      "GitHub Actions",
      "Open Source"
    ],
    "description": "Master version control, branching strategies, and open source collaboration with GitHub."
  }
];

const getQuestions = (domainDocs) => {
  const domainMap = {};
  domainDocs.forEach(d => { domainMap[d.name] = d; });

  const rawQuestions = [
  {
    "question": "What is the primary search strategy used in the A* algorithm?",
    "options": [
      "Best-First Search guided by f(n) = g(n) + h(n)",
      "Depth-First Search",
      "Breadth-First Search",
      "Dijkstra's Algorithm without heuristics"
    ],
    "correctAnswer": "Best-First Search guided by f(n) = g(n) + h(n)",
    "domain": "Artificial Intelligence",
    "difficulty": "medium",
    "category": "Search Algorithms",
    "explanation": "A* search uses f(n) = g(n) + h(n) where g(n) is path cost and h(n) is heuristic estimate.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which framework is historically used for defining agent actions and plans in AI?",
    "options": [
      "STRIPS",
      "REST",
      "TensorFlow",
      "Docker"
    ],
    "correctAnswer": "STRIPS",
    "domain": "Artificial Intelligence",
    "difficulty": "medium",
    "category": "Planning",
    "explanation": "STRIPS (Stanford Research Institute Planning System) is a formal language for planning.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "In minimax search trees, what does alpha-beta pruning do?",
    "options": [
      "Reduces the number of nodes evaluated by minimax",
      "Speeds up sorting of nodes",
      "Performs random sampling of nodes",
      "Converts search trees into graphs"
    ],
    "correctAnswer": "Reduces the number of nodes evaluated by minimax",
    "domain": "Artificial Intelligence",
    "difficulty": "medium",
    "category": "Intelligent Agents",
    "explanation": "Alpha-beta pruning eliminates paths that cannot influence the final decision.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the goal of a heuristic function in search?",
    "options": [
      "To estimate cost from current state to goal",
      "To calculate exact cost of path",
      "To randomize path selection",
      "To verify correct node traversal"
    ],
    "correctAnswer": "To estimate cost from current state to goal",
    "domain": "Artificial Intelligence",
    "difficulty": "easy",
    "category": "Search Algorithms",
    "explanation": "Heuristics provide an estimated cost to reach the goal, prioritizing promising paths.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which AI representation format uses semantic nets of nodes and edges?",
    "options": [
      "Knowledge Graphs",
      "CSV tables",
      "Binary trees",
      "SQL databases"
    ],
    "correctAnswer": "Knowledge Graphs",
    "domain": "Artificial Intelligence",
    "difficulty": "easy",
    "category": "Knowledge Representation",
    "explanation": "Knowledge Graphs represent relations between entities using nodes and edges.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does the bias-variance tradeoff represent in machine learning?",
    "options": [
      "The balance between underfitting and overfitting",
      "The size of the dataset vs training speed",
      "The loss function choice",
      "The computational complexity"
    ],
    "correctAnswer": "The balance between underfitting and overfitting",
    "domain": "Machine Learning",
    "difficulty": "medium",
    "category": "Model Evaluation",
    "explanation": "High bias leads to underfitting, while high variance leads to overfitting.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which regularization method performs L1 regularization, potentially setting weights to zero?",
    "options": [
      "Lasso Regression",
      "Ridge Regression",
      "Elastic Net",
      "Linear Regression"
    ],
    "correctAnswer": "Lasso Regression",
    "domain": "Machine Learning",
    "difficulty": "medium",
    "category": "Supervised Learning",
    "explanation": "Lasso adds absolute value penalty to weights, leading to sparsity.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the purpose of K-Fold Cross-Validation?",
    "options": [
      "To get a robust estimate of model generalization",
      "To speed up model training",
      "To perform feature scaling",
      "To build ensemble classifiers"
    ],
    "correctAnswer": "To get a robust estimate of model generalization",
    "domain": "Machine Learning",
    "difficulty": "easy",
    "category": "Model Evaluation",
    "explanation": "K-Fold trains on K-1 folds and validates on the remaining fold K times to get a stable score.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which algorithm finds the hyperplane maximizing the margin between classes?",
    "options": [
      "Support Vector Machines",
      "Logistic Regression",
      "Naive Bayes",
      "K-Nearest Neighbors"
    ],
    "correctAnswer": "Support Vector Machines",
    "domain": "Machine Learning",
    "difficulty": "easy",
    "category": "Supervised Learning",
    "explanation": "SVMs find the optimal separating hyperplane that maximizes the margin.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is Principal Component Analysis (PCA) primarily used for?",
    "options": [
      "Dimensionality reduction",
      "Classification",
      "Regression",
      "Clustering"
    ],
    "correctAnswer": "Dimensionality reduction",
    "domain": "Machine Learning",
    "difficulty": "easy",
    "category": "Unsupervised Learning",
    "explanation": "PCA projects data onto orthogonal directions of maximum variance to reduce dimension.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the primary role of backpropagation in training neural networks?",
    "options": [
      "To calculate gradients of loss function with respect to weights",
      "To initialize weights randomly",
      "To scale dataset inputs",
      "To apply dropout regularization"
    ],
    "correctAnswer": "To calculate gradients of loss function with respect to weights",
    "domain": "Deep Learning",
    "difficulty": "medium",
    "category": "Neural Networks",
    "explanation": "Backpropagation uses the chain rule to compute gradients of the loss function.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which activation function is defined as f(x) = max(0, x)?",
    "options": [
      "ReLU",
      "Sigmoid",
      "Tanh",
      "Softmax"
    ],
    "correctAnswer": "ReLU",
    "domain": "Deep Learning",
    "difficulty": "easy",
    "category": "Neural Networks",
    "explanation": "ReLU (Rectified Linear Unit) output is 0 for negative x and x for positive x.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does Batch Normalization normalize in a neural network layer?",
    "options": [
      "The activations of the previous layer across a mini-batch",
      "The training dataset targets",
      "The learning rate of the optimizer",
      "The network weights directly"
    ],
    "correctAnswer": "The activations of the previous layer across a mini-batch",
    "domain": "Deep Learning",
    "difficulty": "medium",
    "category": "Optimization",
    "explanation": "Batch Norm normalizes layer inputs by mean and variance over the mini-batch.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the main mechanism that allows Transformers to process sequences in parallel?",
    "options": [
      "Self-Attention mechanism",
      "Recurrent LSTM cells",
      "Convolutional filters",
      "Fully connected feedforward layers"
    ],
    "correctAnswer": "Self-Attention mechanism",
    "domain": "Deep Learning",
    "difficulty": "hard",
    "category": "Transformers",
    "explanation": "Self-attention computes relations between all tokens in a sequence simultaneously.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What are the residual connections (skip connections) in ResNet used for?",
    "options": [
      "To mitigate the vanishing gradient problem in deep networks",
      "To speed up data loading",
      "To perform dimensional scaling",
      "To run convolution operations"
    ],
    "correctAnswer": "To mitigate the vanishing gradient problem in deep networks",
    "domain": "Deep Learning",
    "difficulty": "medium",
    "category": "Neural Networks",
    "explanation": "Skip connections allow gradients to flow directly through layers without attenuation.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which Pandas method is used to group data sharing common column values?",
    "options": [
      "groupby()",
      "merge()",
      "concat()",
      "pivot()"
    ],
    "correctAnswer": "groupby()",
    "domain": "Data Science",
    "difficulty": "easy",
    "category": "Pandas",
    "explanation": "groupby() groups rows sharing a common value for aggregation.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does correlation measure in statistics?",
    "options": [
      "The strength and direction of linear relationship between two variables",
      "The causal effect of one variable on another",
      "The variance of a single variable",
      "The absolute difference between columns"
    ],
    "correctAnswer": "The strength and direction of linear relationship between two variables",
    "domain": "Data Science",
    "difficulty": "easy",
    "category": "Statistics",
    "explanation": "Correlation measures linear association, but does not imply causation.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is EDA (Exploratory Data Analysis) used for?",
    "options": [
      "To summarize data main characteristics and discover patterns visually",
      "To deploy machine learning models",
      "To format databases for production",
      "To write API endpoints"
    ],
    "correctAnswer": "To summarize data main characteristics and discover patterns visually",
    "domain": "Data Science",
    "difficulty": "easy",
    "category": "EDA",
    "explanation": "EDA uses statistics and visualizations to understand the dataset structure.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the risk of using data from the validation/test set in feature engineering?",
    "options": [
      "Data leakage",
      "Overfitting on training set",
      "Vanishing gradients",
      "Memory overflow"
    ],
    "correctAnswer": "Data leakage",
    "domain": "Data Science",
    "difficulty": "medium",
    "category": "Fundamentals",
    "explanation": "Data leakage occurs when info from outside the training dataset is used to train the model.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which imputation method replaces missing values with the most frequent value?",
    "options": [
      "Mode Imputation",
      "Mean Imputation",
      "Median Imputation",
      "Zero Imputation"
    ],
    "correctAnswer": "Mode Imputation",
    "domain": "Data Science",
    "difficulty": "easy",
    "category": "Data Preprocessing",
    "explanation": "Mode represents the most frequent value, suitable for categorical data.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What mathematical operation is the core building block of CNNs?",
    "options": [
      "Convolution",
      "Matrix Inversion",
      "Eigenvalue Decomposition",
      "Fourier Transform"
    ],
    "correctAnswer": "Convolution",
    "domain": "Computer Vision",
    "difficulty": "easy",
    "category": "Image Processing",
    "explanation": "Convolution multiplies image pixels by a kernel to extract feature maps.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which architecture is famous for real-time, single-shot object detection?",
    "options": [
      "YOLO",
      "R-CNN",
      "AlexNet",
      "VGG"
    ],
    "correctAnswer": "YOLO",
    "domain": "Computer Vision",
    "difficulty": "medium",
    "category": "Object Detection",
    "explanation": "YOLO (You Only Look Once) processes the entire image in a single forward pass.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does IoU (Intersection over Union) measure in object detection?",
    "options": [
      "Overlap between predicted bounding box and ground truth",
      "The number of object classes",
      "The speed of frame processing",
      "The image resolution scale"
    ],
    "correctAnswer": "Overlap between predicted bounding box and ground truth",
    "domain": "Computer Vision",
    "difficulty": "medium",
    "category": "Object Detection",
    "explanation": "IoU is the ratio of intersection area to union area of boxes.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which library is the industry standard for image processing in Python?",
    "options": [
      "OpenCV",
      "SciPy",
      "Matplotlib",
      "BeautifulSoup"
    ],
    "correctAnswer": "OpenCV",
    "domain": "Computer Vision",
    "difficulty": "easy",
    "category": "OpenCV",
    "explanation": "OpenCV (Open Source Computer Vision) is widely used for real-time vision tasks.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does a pooling layer do in a CNN?",
    "options": [
      "Reduces spatial dimensions of feature maps",
      "Increases the number of channels",
      "Calculates class probabilities",
      "Normalizes feature gradients"
    ],
    "correctAnswer": "Reduces spatial dimensions of feature maps",
    "domain": "Computer Vision",
    "difficulty": "easy",
    "category": "Image Processing",
    "explanation": "Pooling (e.g. Max Pooling) downsamples feature maps to reduce computation and parameters.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is tokenization in NLP?",
    "options": [
      "Splitting text into words, subwords, or characters",
      "Converting text to dense vectors",
      "Extracting parts of speech",
      "Translating text to another language"
    ],
    "correctAnswer": "Splitting text into words, subwords, or characters",
    "domain": "Natural Language Processing",
    "difficulty": "easy",
    "category": "Tokenization",
    "explanation": "Tokenization breaks a sequence of text into smaller units (tokens).",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which model first introduced bidirectional context learning using masked language modeling?",
    "options": [
      "BERT",
      "GPT",
      "Word2Vec",
      "RNN"
    ],
    "correctAnswer": "BERT",
    "domain": "Natural Language Processing",
    "difficulty": "medium",
    "category": "BERT",
    "explanation": "BERT pretrains bidirectional representations by masking tokens.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does TF-IDF stand for?",
    "options": [
      "Term Frequency - Inverse Document Frequency",
      "Token Flow - Input Data Format",
      "Text Filtering - Intelligent Document Find",
      "Tensor Flow - Image Data Feed"
    ],
    "correctAnswer": "Term Frequency - Inverse Document Frequency",
    "domain": "Natural Language Processing",
    "difficulty": "easy",
    "category": "Tokenization",
    "explanation": "TF-IDF evaluates how important a word is to a document in a corpus.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which vector representation captures semantic relationships between words?",
    "options": [
      "Word Embeddings",
      "One-Hot Encoding",
      "Bag of Words",
      "ASCII Mapping"
    ],
    "correctAnswer": "Word Embeddings",
    "domain": "Natural Language Processing",
    "difficulty": "easy",
    "category": "Embeddings",
    "explanation": "Word embeddings represent words in dense vectors where semantic similarities align.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What metric is commonly used to evaluate machine translation output quality?",
    "options": [
      "BLEU Score",
      "F1 Score",
      "MSE",
      "Accuracy"
    ],
    "correctAnswer": "BLEU Score",
    "domain": "Natural Language Processing",
    "difficulty": "medium",
    "category": "Text Classification",
    "explanation": "BLEU (Bilingual Evaluation Understudy) compares candidate translations to references.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What are the two networks in a Generative Adversarial Network (GAN)?",
    "options": [
      "Generator and Discriminator",
      "Encoder and Decoder",
      "Actor and Critic",
      "Predictor and Classifier"
    ],
    "correctAnswer": "Generator and Discriminator",
    "domain": "Generative AI",
    "difficulty": "easy",
    "category": "GANs",
    "explanation": "GANs train a Generator to produce real-looking data and a Discriminator to verify it.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which technique is used to fine-tune LLMs with low-rank adapters?",
    "options": [
      "LoRA",
      "RLHF",
      "Quantization",
      "Pruning"
    ],
    "correctAnswer": "LoRA",
    "domain": "Generative AI",
    "difficulty": "medium",
    "category": "LLMs",
    "explanation": "LoRA (Low-Rank Adaptation) freezes model weights and injects trainable rank decomposition matrices.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does temperature control in generative language models?",
    "options": [
      "The randomness of token selection",
      "The model context window size",
      "The learning rate during fine-tuning",
      "The number of parameters activated"
    ],
    "correctAnswer": "The randomness of token selection",
    "domain": "Generative AI",
    "difficulty": "easy",
    "category": "LLMs",
    "explanation": "Higher temperature increases randomness; lower temperature makes choices more deterministic.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the primary role of diffusion models in image generation?",
    "options": [
      "Denoising random noise step-by-step to construct images",
      "Classifying images into categories",
      "Converting images to black-and-white",
      "Compacting image storage sizes"
    ],
    "correctAnswer": "Denoising random noise step-by-step to construct images",
    "domain": "Generative AI",
    "difficulty": "medium",
    "category": "Diffusion Models",
    "explanation": "Diffusion models generate data by reversing a progressive noise diffusion process.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does RAG stand for in the context of LLM applications?",
    "options": [
      "Retrieval-Augmented Generation",
      "Random Access Graph",
      "Recursive Agent Grouping",
      "Responsive Anchor Grid"
    ],
    "correctAnswer": "Retrieval-Augmented Generation",
    "domain": "Generative AI",
    "difficulty": "easy",
    "category": "LLMs",
    "explanation": "RAG fetches relevant documents from a database to augment the LLM prompt context.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is Few-Shot prompting?",
    "options": [
      "Providing a few examples of task outputs in the prompt",
      "Training the LLM on a small dataset",
      "Running the prompt in multiple short turns",
      "Restricting the context window size"
    ],
    "correctAnswer": "Providing a few examples of task outputs in the prompt",
    "domain": "Prompt Engineering",
    "difficulty": "easy",
    "category": "Few-shot",
    "explanation": "Few-shot prompting shows the model input-output examples before the actual task.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which prompting technique directs the model to explain its reasoning step-by-step?",
    "options": [
      "Chain of Thought prompting",
      "Zero-Shot prompting",
      "System prompting",
      "ReAct prompting"
    ],
    "correctAnswer": "Chain of Thought prompting",
    "domain": "Prompt Engineering",
    "difficulty": "easy",
    "category": "Chain of Thought",
    "explanation": "Chain of Thought prompts the model to output intermediate reasoning steps.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is prompt injection?",
    "options": [
      "Inserting malicious instructions to bypass LLM safety guardrails",
      "Injecting database vectors into prompt templates",
      "Automating prompt creation with scripts",
      "Speeding up API response times"
    ],
    "correctAnswer": "Inserting malicious instructions to bypass LLM safety guardrails",
    "domain": "Prompt Engineering",
    "difficulty": "medium",
    "category": "System Prompts",
    "explanation": "Prompt injection overrides system instructions with user-entered text.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does a 'system prompt' do in an LLM chat setup?",
    "options": [
      "Defines the model role, behavior, and constraints globally",
      "Saves chat history to the server database",
      "Translates user inputs to English",
      "Configures the API network settings"
    ],
    "correctAnswer": "Defines the model role, behavior, and constraints globally",
    "domain": "Prompt Engineering",
    "difficulty": "easy",
    "category": "System Prompts",
    "explanation": "System prompts set rules and guidelines the model must follow during the session.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the benefit of defining output schemas (like JSON) in prompts?",
    "options": [
      "Ensures structured, parseable responses for applications",
      "Speeds up token generation times",
      "Reduces model API cost",
      "Prevents model hallucinations entirely"
    ],
    "correctAnswer": "Ensures structured, parseable responses for applications",
    "domain": "Prompt Engineering",
    "difficulty": "easy",
    "category": "System Prompts",
    "explanation": "Specifying schemas makes LLM outputs reliable to parse with code.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does the ReAct framework in AI agents stand for?",
    "options": [
      "Reasoning and Acting",
      "Re-evaluating Action trees",
      "Recurrent Agent control",
      "Response Action tracking"
    ],
    "correctAnswer": "Reasoning and Acting",
    "domain": "AI Agents",
    "difficulty": "medium",
    "category": "ReAct Framework",
    "explanation": "ReAct combines reasoning (thoughts) and acting (calling tools) in a loop.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "How do autonomous AI agents interact with external systems?",
    "options": [
      "Through Tool Calling (APIs, execution environments)",
      "By retraining their base models",
      "By accessing database files directly",
      "Through screen sharing protocols"
    ],
    "correctAnswer": "Through Tool Calling (APIs, execution environments)",
    "domain": "AI Agents",
    "difficulty": "easy",
    "category": "Tool Use",
    "explanation": "Agents call tools (APIs, search engines, compilers) to interact with systems.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which library is widely used to coordinate LLMs, tools, and agents in Python?",
    "options": [
      "LangChain",
      "Django",
      "NumPy",
      "PyTest"
    ],
    "correctAnswer": "LangChain",
    "domain": "AI Agents",
    "difficulty": "easy",
    "category": "LangChain",
    "explanation": "LangChain is a popular framework for building LLM applications and agents.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What kind of memory allows agents to recall instructions and past interactions in the current session?",
    "options": [
      "Short-term / Conversational Memory",
      "Vector Database Storage",
      "Base model parameters",
      "Git commit history"
    ],
    "correctAnswer": "Short-term / Conversational Memory",
    "domain": "AI Agents",
    "difficulty": "easy",
    "category": "Memory",
    "explanation": "Short-term memory stores recent messages to maintain context in the chat.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is a multi-agent system?",
    "options": [
      "A setup where multiple specialized agents collaborate to solve tasks",
      "A server running multiple copies of an LLM",
      "An agent using multiple API keys",
      "A chatbot supporting multiple languages"
    ],
    "correctAnswer": "A setup where multiple specialized agents collaborate to solve tasks",
    "domain": "AI Agents",
    "difficulty": "medium",
    "category": "Multi-Agent Systems",
    "explanation": "Multi-agent systems divide work among agents with different roles and tools.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which Python feature is used to build a generator function?",
    "options": [
      "The yield keyword",
      "The lambda operator",
      "Class definitions",
      "List comprehensions"
    ],
    "correctAnswer": "The yield keyword",
    "domain": "Python",
    "difficulty": "easy",
    "category": "Core Python",
    "explanation": "The yield keyword returns a generator iterator that yields values lazily.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is a decorator in Python?",
    "options": [
      "A function that modifies the behavior of another function",
      "A GUI design tool",
      "A comment block detailing code structure",
      "An array initialization method"
    ],
    "correctAnswer": "A function that modifies the behavior of another function",
    "domain": "Python",
    "difficulty": "medium",
    "category": "Decorators",
    "explanation": "Decorators wrap another function to extend its behavior without editing it.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which NumPy feature allows arithmetic operations on arrays of different shapes?",
    "options": [
      "Broadcasting",
      "Slicing",
      "Vectorization",
      "Concatenation"
    ],
    "correctAnswer": "Broadcasting",
    "domain": "Python",
    "difficulty": "medium",
    "category": "NumPy",
    "explanation": "Broadcasting stretches the smaller array to match the shape of the larger array.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does the double asterisk (**) operator represent in Python?",
    "options": [
      "Exponentiation",
      "Multiplication",
      "Pointer dereferencing",
      "Bitwise XOR"
    ],
    "correctAnswer": "Exponentiation",
    "domain": "Python",
    "difficulty": "easy",
    "category": "Core Python",
    "explanation": "The double asterisk (**) raises a number to the power of another.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which Python module is used to write asynchronous concurrent code?",
    "options": [
      "asyncio",
      "threading",
      "multiprocessing",
      "requests"
    ],
    "correctAnswer": "asyncio",
    "domain": "Python",
    "difficulty": "medium",
    "category": "Core Python",
    "explanation": "asyncio is a library to write concurrent code using async/await syntax.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the dot product of orthogonal vectors?",
    "options": [
      "Zero",
      "One",
      "The product of their magnitudes",
      "Negative one"
    ],
    "correctAnswer": "Zero",
    "domain": "Mathematics for AI",
    "difficulty": "easy",
    "category": "Linear Algebra",
    "explanation": "Orthogonal vectors are at 90 degrees; their dot product is always zero.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does the gradient of a multivariable function represent?",
    "options": [
      "The direction of steepest ascent",
      "The local minimum coordinate",
      "The rate of change along the X-axis",
      "The curve curvature value"
    ],
    "correctAnswer": "The direction of steepest ascent",
    "domain": "Mathematics for AI",
    "difficulty": "easy",
    "category": "Calculus",
    "explanation": "The gradient vector points in the direction of greatest rate of increase of the function.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which rule is fundamental to computing gradients in backpropagation?",
    "options": [
      "Chain Rule",
      "Product Rule",
      "L'Hopital's Rule",
      "Quotient Rule"
    ],
    "correctAnswer": "Chain Rule",
    "domain": "Mathematics for AI",
    "difficulty": "medium",
    "category": "Calculus",
    "explanation": "The chain rule computes derivative of composite functions, vital for backprop.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What are the scalar values lambda associated with a matrix transformation Av = lambda v?",
    "options": [
      "Eigenvalues",
      "Determinants",
      "Singular Values",
      "Jacobians"
    ],
    "correctAnswer": "Eigenvalues",
    "domain": "Mathematics for AI",
    "difficulty": "medium",
    "category": "Linear Algebra",
    "explanation": "Eigenvalues are scalars lambda where matrix multiplication equals scalar scaling.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What norm is defined as the sum of absolute values of vector elements?",
    "options": [
      "L1 Norm",
      "L2 Norm",
      "Infinity Norm",
      "Frobenius Norm"
    ],
    "correctAnswer": "L1 Norm",
    "domain": "Mathematics for AI",
    "difficulty": "easy",
    "category": "Linear Algebra",
    "explanation": "L1 norm (Manhattan distance) sums absolute coordinate values.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does a p-value represent in hypothesis testing?",
    "options": [
      "Probability of observing test results under the null hypothesis",
      "Probability that the null hypothesis is true",
      "The significance level threshold",
      "The effect size magnitude"
    ],
    "correctAnswer": "Probability of observing test results under the null hypothesis",
    "domain": "Statistics",
    "difficulty": "medium",
    "category": "Hypothesis Testing",
    "explanation": "A p-value measures evidence against the null hypothesis; smaller means stronger evidence.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which theorem describes updating probability estimates based on new evidence?",
    "options": [
      "Bayes Theorem",
      "Central Limit Theorem",
      "Law of Large Numbers",
      "Chebyshev Theorem"
    ],
    "correctAnswer": "Bayes Theorem",
    "domain": "Statistics",
    "difficulty": "easy",
    "category": "Bayesian Stats",
    "explanation": "Bayes theorem calculates posterior probability using prior and likelihood.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does the Central Limit Theorem state about sample means?",
    "options": [
      "Sample means will follow normal distribution as sample size grows",
      "Sample variance equals population variance",
      "The mean of any sample is exactly zero",
      "Samples must be selected randomly"
    ],
    "correctAnswer": "Sample means will follow normal distribution as sample size grows",
    "domain": "Statistics",
    "difficulty": "medium",
    "category": "Distributions",
    "explanation": "CLT guarantees sample means approach normality regardless of population distribution shape.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is a Type I error in statistics?",
    "options": [
      "Rejecting a true null hypothesis (false positive)",
      "Failing to reject a false null hypothesis",
      "Measuring standard deviation incorrectly",
      "Using a sample size that is too small"
    ],
    "correctAnswer": "Rejecting a true null hypothesis (false positive)",
    "domain": "Statistics",
    "difficulty": "medium",
    "category": "Hypothesis Testing",
    "explanation": "Type I error is a false alarm \u2014 claiming an effect exists when it does not.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What statistical method measures the relationship between a dependent and independent variable?",
    "options": [
      "Regression analysis",
      "Hypothesis testing",
      "Principal component analysis",
      "Bayesian update"
    ],
    "correctAnswer": "Regression analysis",
    "domain": "Statistics",
    "difficulty": "easy",
    "category": "Regression",
    "explanation": "Regression models dependencies between targets and features.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the time complexity of searching in a sorted array using Binary Search?",
    "options": [
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "O(1)"
    ],
    "correctAnswer": "O(log n)",
    "domain": "Data Structures & Algorithms",
    "difficulty": "easy",
    "category": "Complexity",
    "explanation": "Binary search halves the search space each step, leading to logarithmic complexity.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which data structure operates on a First-In-First-Out (FIFO) basis?",
    "options": [
      "Queue",
      "Stack",
      "Binary Tree",
      "Max Heap"
    ],
    "correctAnswer": "Queue",
    "domain": "Data Structures & Algorithms",
    "difficulty": "easy",
    "category": "Arrays",
    "explanation": "Queues process elements in order of insertion (FIFO). Stacks are LIFO.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which algorithm is used to find the shortest path in a weighted graph with positive weights?",
    "options": [
      "Dijkstra's Algorithm",
      "Kruskal's Algorithm",
      "Bellman-Ford Algorithm",
      "Floyd-Warshall Algorithm"
    ],
    "correctAnswer": "Dijkstra's Algorithm",
    "domain": "Data Structures & Algorithms",
    "difficulty": "medium",
    "category": "Trees & Graphs",
    "explanation": "Dijkstra finds single-source shortest paths efficiently using a priority queue.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the core difference between memoization and tabulation in dynamic programming?",
    "options": [
      "Memoization is top-down (caching); Tabulation is bottom-up (table filling)",
      "Memoization is slower; Tabulation uses recursion",
      "Memoization uses trees; Tabulation uses stacks",
      "Memoization applies to arrays; Tabulation applies to graphs"
    ],
    "correctAnswer": "Memoization is top-down (caching); Tabulation is bottom-up (table filling)",
    "domain": "Data Structures & Algorithms",
    "difficulty": "medium",
    "category": "Dynamic Programming",
    "explanation": "Memoization solves recursively caching results. Tabulation builds iterative table.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the average time complexity of insertion in a Hash Table?",
    "options": [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n log n)"
    ],
    "correctAnswer": "O(1)",
    "domain": "Data Structures & Algorithms",
    "difficulty": "easy",
    "category": "Complexity",
    "explanation": "Hash tables offer constant time complexity O(1) for lookups and insertions on average.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the purpose of experiment tracking tools like MLflow?",
    "options": [
      "To log model parameters, metrics, and artifacts during training",
      "To scale computing cluster sizes automatically",
      "To perform feature engineering on datasets",
      "To generate web frontend dashboards"
    ],
    "correctAnswer": "To log model parameters, metrics, and artifacts during training",
    "domain": "MLOps",
    "difficulty": "easy",
    "category": "MLflow",
    "explanation": "MLflow tracks training runs, facilitating reproducibility and model comparisons.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is 'data drift' in production ML systems?",
    "options": [
      "A change in input data distribution over time",
      "Loss of database connection",
      "Duplicate records in the training set",
      "Slower database query execution"
    ],
    "correctAnswer": "A change in input data distribution over time",
    "domain": "MLOps",
    "difficulty": "medium",
    "category": "Monitoring",
    "explanation": "Data drift means model inputs diverge from training distributions, degrading accuracy.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which tool is standard for versioning datasets in ML projects?",
    "options": [
      "DVC (Data Version Control)",
      "Git",
      "Docker",
      "Kubernetes"
    ],
    "correctAnswer": "DVC (Data Version Control)",
    "domain": "MLOps",
    "difficulty": "easy",
    "category": "DVC",
    "explanation": "DVC tracks large files and datasets using Git pointer files, keeping repositories clean.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does a Model Registry do in MLOps?",
    "options": [
      "Stores, versions, and manages the lifecycle of trained models",
      "Downloads datasets automatically from Kaggle",
      "Compresses model weights to reduce disk space",
      "Encrypts models for security compliance"
    ],
    "correctAnswer": "Stores, versions, and manages the lifecycle of trained models",
    "domain": "MLOps",
    "difficulty": "easy",
    "category": "Model Serving",
    "explanation": "Model registries manage stages (staging, production, archived) of models.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What deployment strategy involves routeing a small fraction of traffic to the new model?",
    "options": [
      "Canary Deployment",
      "Blue-Green Deployment",
      "Re-create Deployment",
      "Serverless Deployment"
    ],
    "correctAnswer": "Canary Deployment",
    "domain": "MLOps",
    "difficulty": "medium",
    "category": "Model Serving",
    "explanation": "Canary deployment exposes the new version to a small subset of users to test stability.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which AWS service is a fully-managed platform to build, train, and deploy ML models?",
    "options": [
      "Amazon SageMaker",
      "Amazon EC2",
      "Amazon S3",
      "Amazon Lambda"
    ],
    "correctAnswer": "Amazon SageMaker",
    "domain": "Cloud for AI",
    "difficulty": "easy",
    "category": "AWS SageMaker",
    "explanation": "SageMaker provides hosted environments, distributed training, and model endpoints.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the Google Cloud equivalent of AWS SageMaker for end-to-end ML?",
    "options": [
      "Vertex AI",
      "Google App Engine",
      "Compute Engine",
      "BigQuery ML"
    ],
    "correctAnswer": "Vertex AI",
    "domain": "Cloud for AI",
    "difficulty": "easy",
    "category": "Google Vertex AI",
    "explanation": "Vertex AI is Google Cloud's unified platform for managing ML pipelines and models.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Why are Cloud Spot Instances frequently used in training deep learning models?",
    "options": [
      "They offer up to 90% cost savings compared to on-demand instances",
      "They have higher GPU memory limits",
      "They cannot be interrupted during training",
      "They run code twice as fast"
    ],
    "correctAnswer": "They offer up to 90% cost savings compared to on-demand instances",
    "domain": "Cloud for AI",
    "difficulty": "medium",
    "category": "Cost Optimization",
    "explanation": "Spot instances utilize spare cloud capacity at low cost, perfect for fault-tolerant training.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What cloud service is typically used to store large raw datasets?",
    "options": [
      "Object Storage (like Amazon S3)",
      "Relational Database (like AWS RDS)",
      "In-memory cache (like Redis)",
      "Block storage volumes"
    ],
    "correctAnswer": "Object Storage (like Amazon S3)",
    "domain": "Cloud for AI",
    "difficulty": "easy",
    "category": "Cloud Storage",
    "explanation": "Object storage like S3 is durable, cheap, and scales to petabytes of training data.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is serverless AI inference?",
    "options": [
      "Running model predictions on request without managing persistent servers",
      "Running models locally on the user's laptop",
      "Training models without cloud compute units",
      "Deploying models to edge microchips only"
    ],
    "correctAnswer": "Running model predictions on request without managing persistent servers",
    "domain": "Cloud for AI",
    "difficulty": "medium",
    "category": "Serverless AI",
    "explanation": "Serverless inference (e.g. AWS Lambda or SageMaker Serverless) scales computing dynamically.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the role of virtual DOM reconciliation in React?",
    "options": [
      "Comparing virtual DOM with real DOM and updating changed elements only",
      "Structuring HTML templates in files",
      "Saving component states to local storage",
      "Loading external css frameworks"
    ],
    "correctAnswer": "Comparing virtual DOM with real DOM and updating changed elements only",
    "domain": "Frontend Development",
    "difficulty": "easy",
    "category": "React",
    "explanation": "Reconciliation (diffing) minimizes real DOM reflows and repaints, boosting UI speed.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which React hook is used to cache calculations between component re-renders?",
    "options": [
      "useMemo",
      "useCallback",
      "useEffect",
      "useRef"
    ],
    "correctAnswer": "useMemo",
    "domain": "Frontend Development",
    "difficulty": "medium",
    "category": "React",
    "explanation": "useMemo returns a memoized value, preventing recalculation on every render.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the primary difference between Client-Side Rendering (CSR) and Server-Side Rendering (SSR)?",
    "options": [
      "SSR sends pre-rendered HTML to the browser; CSR sends minimal HTML and JS",
      "CSR is faster on initial page load",
      "SSR requires more client-side processing",
      "CSR is better for search engine indexing"
    ],
    "correctAnswer": "SSR sends pre-rendered HTML to the browser; CSR sends minimal HTML and JS",
    "domain": "Frontend Development",
    "difficulty": "medium",
    "category": "Next.js",
    "explanation": "SSR renders the page on the server first, improving initial paint and SEO.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which CSS layout model is designed for 1-dimensional layouts (row or column)?",
    "options": [
      "Flexbox",
      "CSS Grid",
      "Absolute positioning",
      "Block flow"
    ],
    "correctAnswer": "Flexbox",
    "domain": "Frontend Development",
    "difficulty": "easy",
    "category": "CSS/Tailwind",
    "explanation": "Flexbox arranges elements in a single dimension; Grid is for 2D layouts.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "In TypeScript, what is a generic type used for?",
    "options": [
      "Creating reusable components that work with a variety of types",
      "Declaring local variables inside functions",
      "Exporting classes to other files",
      "Formatting error logs in the compiler"
    ],
    "correctAnswer": "Creating reusable components that work with a variety of types",
    "domain": "Frontend Development",
    "difficulty": "medium",
    "category": "TypeScript",
    "explanation": "Generics allow defining code templates that accept arbitrary types parameterically.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which HTTP status code represents an authentication credentials failure?",
    "options": [
      "401 Unauthorized",
      "403 Forbidden",
      "404 Not Found",
      "400 Bad Request"
    ],
    "correctAnswer": "401 Unauthorized",
    "domain": "Backend Development",
    "difficulty": "easy",
    "category": "Authentication",
    "explanation": "401 represents credentials missing or invalid; 403 means authenticated but access denied.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What problem occurs when a query fetches parent records and triggers separate queries for each child?",
    "options": [
      "N+1 Query Problem",
      "Memory leak",
      "Circular reference",
      "Deadlock"
    ],
    "correctAnswer": "N+1 Query Problem",
    "domain": "Backend Development",
    "difficulty": "medium",
    "category": "Databases",
    "explanation": "N+1 queries happen when fetching related objects sequentially instead of using joins.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Where is a JWT (JSON Web Token) signature verified?",
    "options": [
      "On the server using a secret key",
      "In the client-side browser",
      "In a public blockchain",
      "Inside the MongoDB collection"
    ],
    "correctAnswer": "On the server using a secret key",
    "domain": "Backend Development",
    "difficulty": "easy",
    "category": "Authentication",
    "explanation": "The server signs the token on creation and verifies the signature using its secret key.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does database indexing improve?",
    "options": [
      "Query read performance",
      "Data insertion write speeds",
      "Database storage volume sizes",
      "API network throughput"
    ],
    "correctAnswer": "Query read performance",
    "domain": "Backend Development",
    "difficulty": "easy",
    "category": "Databases",
    "explanation": "Indexes speed up data retrieval searches at the cost of disk space and write speed.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which framework is a popular high-performance Python choice for building APIs?",
    "options": [
      "FastAPI",
      "Express.js",
      "Django Templates",
      "Flask Admin"
    ],
    "correctAnswer": "FastAPI",
    "domain": "Backend Development",
    "difficulty": "easy",
    "category": "FastAPI",
    "explanation": "FastAPI is a modern, fast, ASGI framework for building Python APIs.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the purpose of Git rebase compared to Git merge?",
    "options": [
      "To integrate changes from one branch into another with a clean linear history",
      "To push commits to the remote repository",
      "To delete local file histories",
      "To download files from GitHub"
    ],
    "correctAnswer": "To integrate changes from one branch into another with a clean linear history",
    "domain": "Git & GitHub",
    "difficulty": "medium",
    "category": "Branching",
    "explanation": "Rebase moves the base of the branch, creating a flat commit history instead of a merge node.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "Which command saves uncommitted local edits temporarily without committing them?",
    "options": [
      "git stash",
      "git checkout",
      "git reset",
      "git commit --amend"
    ],
    "correctAnswer": "git stash",
    "domain": "Git & GitHub",
    "difficulty": "easy",
    "category": "Git Basics",
    "explanation": "git stash records the current state of the working directory and index, reverting to clean.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "How are merge conflicts resolved in Git?",
    "options": [
      "By manually editing conflicting lines and committing the result",
      "By force pushing changes immediately",
      "By running git delete-conflict",
      "By creating a new repository"
    ],
    "correctAnswer": "By manually editing conflicting lines and committing the result",
    "domain": "Git & GitHub",
    "difficulty": "easy",
    "category": "Git Basics",
    "explanation": "Users open the flagged files, pick the desired lines, remove conflict markers, and commit.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What does a pull request (PR) facilitate?",
    "options": [
      "Code review and discussion before merging changes into a branch",
      "Downloading external package dependencies",
      "Configuring CI/CD servers",
      "Hosting static websites"
    ],
    "correctAnswer": "Code review and discussion before merging changes into a branch",
    "domain": "Git & GitHub",
    "difficulty": "easy",
    "category": "Pull Requests",
    "explanation": "PRs let developers notify team members about completed features for review.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  },
  {
    "question": "What is the purpose of a .gitignore file?",
    "options": [
      "To specify files Git should track and index",
      "To store repository credentials securely",
      "To configure the default editor",
      "To list patterns of files Git should ignore"
    ],
    "correctAnswer": "To list patterns of files Git should ignore",
    "domain": "Git & GitHub",
    "difficulty": "easy",
    "category": "Git Basics",
    "explanation": ".gitignore specifies untracked files (like node_modules or env files) that Git should ignore.",
    "marks": 1,
    "isActive": true,
    "usageCount": 0
  }
];

  return rawQuestions.map(q => ({
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    domain: q.domain,
    domainId: domainMap[q.domain]._id,
    difficulty: q.difficulty,
    category: q.category,
    explanation: q.explanation,
    marks: 1
  }));
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    await Domain.deleteMany({});
    await Question.deleteMany({});
    console.log('🗑️ Cleared existing domains and questions');

    const createdDomains = await Domain.insertMany(domains);
    console.log(`✅ Seeded ${createdDomains.length} domains`);

    const questionsToInsert = getQuestions(createdDomains);
    const createdQuestions = await Question.insertMany(questionsToInsert);
    print('✅ Seeded', createdQuestions.length, 'questions');

    for (const domain of createdDomains) {
      const count = createdQuestions.filter(q => q.domain === domain.name).length;
      await Domain.findByIdAndUpdate(domain._id, { questionCount: count });
    }

    const existingAdmin = await User.findOne({ email: 'admin@skillforge.com' });
    if (!existingAdmin) {
      await User.create({
        fullName: 'SkillForge Admin',
        email: 'admin@skillforge.com',
        password: 'Admin@123',
        role: 'admin',
        isProfileComplete: true,
      });
      console.log('✅ Created default admin: admin@skillforge.com / Admin@123');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
