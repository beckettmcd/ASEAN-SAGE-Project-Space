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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
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

startServer();

export default app;

