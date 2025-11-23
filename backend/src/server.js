import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { sequelize } from './models/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import torRoutes from './routes/tors.js';
import assignmentRoutes from './routes/assignments.js';
import indicatorRoutes from './routes/indicators.js';
import budgetRoutes from './routes/budgets.js';
import riskRoutes from './routes/risks.js';
import evidenceRoutes from './routes/evidence.js';
import exportRoutes from './routes/exports.js';
import genericRoutes from './routes/generic.js';
import donorRoutes from './routes/donors.js';

dotenv.config();

// Detect serverless environment early (before validation)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTION_NAME;

// Global error handlers - MUST be set up early to catch unhandled errors
// These prevent the function from crashing on unhandled promise rejections
if (isServerless) {
  // In serverless mode, catch unhandled rejections but don't crash
  // Let the error handler middleware respond with proper HTTP status
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    // Don't exit - let the error handler respond
  });

  // Catch uncaught exceptions as a safety net
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // In serverless, we can't exit - the function will be terminated by the platform
    // Log the error so it appears in Vercel logs
  });
}

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('✗ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these variables in your .env file or Vercel environment variables');
  // In serverless, don't exit - let the error handler catch it
  // This allows Vercel to return a proper error response
  if (!isServerless) {
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'], // Default dev origins
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Startup validation middleware - check critical environment variables
// This runs BEFORE database connection to provide helpful error messages
app.use((req, res, next) => {
  // Skip validation for health endpoint
  if (req.path === '/health') {
    return next();
  }

  // Check for missing critical environment variables
  const errors = [];

  if (isServerless && !process.env.DATABASE_URL && !process.env.DB_HOST && process.env.DB_TYPE !== 'postgres') {
    errors.push({
      variable: 'DATABASE_URL',
      message: 'DATABASE_URL is required in serverless environment. Please set it in Vercel environment variables.',
      help: 'Go to Vercel Dashboard → Settings → Environment Variables → Add DATABASE_URL'
    });
  }

  if (!process.env.JWT_SECRET) {
    errors.push({
      variable: 'JWT_SECRET',
      message: 'JWT_SECRET is required for authentication.',
      help: 'Set JWT_SECRET in your environment variables'
    });
  }

  if (errors.length > 0) {
    return res.status(503).json({
      error: 'Service configuration error',
      message: 'Missing required environment variables',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  next();
});

// Database connection middleware (for serverless environments)
// Ensures database is connected before handling requests
// This must come BEFORE routes so connection is established before route handlers run
let dbConnected = false;
let dbConnecting = false; // Prevent concurrent connection attempts
let connectionPromise = null;

app.use(async (req, res, next) => {
  try {
    // Skip database check for health endpoint (allows health checks even if DB is down)
    if (req.path === '/health') {
      return next();
    }

    // If already connected, proceed immediately
    if (dbConnected) {
      return next();
    }

    // If connection is in progress, wait for it
    if (dbConnecting && connectionPromise) {
      await connectionPromise;
      return next();
    }

    // Start new connection attempt
    dbConnecting = true;
    connectionPromise = sequelize.authenticate()
      .then(() => {
        dbConnected = true;
        dbConnecting = false;
        console.log('✓ Database connection established (serverless)');
      })
      .catch((err) => {
        dbConnecting = false;
        dbConnected = false; // Reset on failure to allow retry
        throw err;
      });

    await connectionPromise;
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    // Provide more detailed error information
    const errorDetails = {
      name: error.name || 'DatabaseConnectionError',
      message: error.message || 'Failed to connect to database',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };
    console.error('Error details:', errorDetails);
    
    // Create a proper error object for the error handler
    const dbError = new Error('Database connection failed');
    dbError.name = error.name || 'SequelizeConnectionError';
    dbError.originalError = error;
    next(dbError);
  }
});

// Health check endpoint (doesn't require database connection)
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    serverless: !!isServerless
  };

  // Optionally check database connection (but don't fail if it's down)
  try {
    if (dbConnected) {
      await sequelize.authenticate();
      health.database = 'connected';
    } else {
      health.database = 'not_connected';
    }
  } catch (error) {
    health.database = 'error';
    health.databaseError = error.message;
  }

  res.json(health);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tors', torRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/indicators', indicatorRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api', genericRoutes);

// Catch-all for non-API routes (helpful for debugging)
app.use((req, res, next) => {
  // If it's not an API route and not the health endpoint, provide helpful message
  if (!req.path.startsWith('/api') && req.path !== '/health') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'This is the API server. API endpoints are available at /api/*',
      path: req.path,
      availableEndpoints: [
        '/api/auth/login',
        '/api/auth/register',
        '/api/dashboard',
        '/api/tors',
        '/api/assignments',
        '/api/indicators',
        '/api/budgets',
        '/api/risks',
        '/api/evidence',
        '/api/donors',
        '/health'
      ]
    });
  }
  next();
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
// Only start server if NOT in serverless environment (Vercel, AWS Lambda, etc.)
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync database without altering (schema already created by seed)
    await sequelize.sync();
    console.log('✓ Database models synchronized');

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

// Only start the server if not in a serverless environment
if (!isServerless) {
  startServer();
} else {
  // In serverless mode, just ensure database connection is ready
  // Connection will be established on first request via middleware
  console.log('✓ Running in serverless mode');
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ DATABASE_URL configured: ${!!process.env.DATABASE_URL}`);
  console.log(`✓ JWT_SECRET configured: ${!!process.env.JWT_SECRET}`);
}

export default app;

