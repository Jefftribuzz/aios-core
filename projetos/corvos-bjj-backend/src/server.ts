import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth-routes';
import studentRoutes from './routes/student-routes';
import paymentRoutes from './routes/payment-routes';
import gradeRoutes from './routes/grade-routes';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/error';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 100);

// Middleware
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic rate limiting to mitigate abuse
app.use(rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/payments', paymentRoutes);
app.use('/grades', gradeRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (MUST be last)
app.use(errorHandler);

// Start server
let server: import('http').Server | null = null;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(Number(PORT), HOST, () => {
    const publicHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`✅ Server running on http://${publicHost}:${PORT}`);
    console.log(`📡 CORS enabled for: ${FRONTEND_URL}`);
    console.log(`🏥 Health check: http://${publicHost}:${PORT}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM signal received: closing HTTP server');
    server?.close(() => {
      console.log('📴 HTTP server closed');
      process.exit(0);
    });
  });
}

export default app;
export { server };
