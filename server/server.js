import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging & Parsing
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'SkillForge API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/projects', projectRoutes);

// Convenience alias: GET /api/domains → same as GET /api/assessments/domains
// so the frontend can call either endpoint
import { getDomains } from './controllers/assessmentController.js';
import { protect as _protect } from './middleware/authMiddleware.js';
app.get('/api/domains', _protect, getDomains);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 SkillForge Server running on http://localhost:' + PORT);
  console.log('📡 Health check: http://localhost:' + PORT + '/api/health');
  console.log('🌱 To seed DB: node utils/seedData.js\n');
});
