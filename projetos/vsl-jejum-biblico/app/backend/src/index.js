import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { initDatabase } from './config/database.js';
import { initRedis } from './config/redis.js';
import { errorMiddleware } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import plansRoutes from './routes/plans.js';
import contentRoutes from './routes/content.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/content', contentRoutes);

// API Docs placeholder
app.get('/api/docs', (req, res) => {
  res.json({ 
    message: 'API Documentation',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login',
      plans: '/api/plans (POST, GET), /api/plans/:id (GET, PATCH)',
      content: '/api/content/prayers, /api/content/meditations, /api/content/meals'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: { 
      code: 'NOT_FOUND', 
      message: 'Endpoint not found' 
    } 
  });
});

// Error handling
app.use(errorMiddleware);

// Initialize and start server
async function start() {
  try {
    logger.info('Initializing database...');
    await initDatabase();
    logger.info('✅ Database connected');

    logger.info('Initializing Redis...');
    await initRedis();
    logger.info('✅ Redis connected');

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
