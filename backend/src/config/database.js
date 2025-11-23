import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Determine database configuration based on environment
// SQLite for local development, PostgreSQL for production/Vercel
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTION_NAME;
// Use PostgreSQL if: DATABASE_URL is set, OR we're in serverless, OR DB_TYPE is explicitly set to 'postgres'
// Otherwise default to SQLite for local development
const usePostgres = process.env.DATABASE_URL || isServerless || process.env.DB_TYPE === 'postgres';

let sequelize;

if (usePostgres) {
  // PostgreSQL configuration for production/Vercel
  // Supports DATABASE_URL (Vercel Postgres format) or individual connection params
  const config = {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.DB_SSL !== 'false' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  if (process.env.DATABASE_URL) {
    // Vercel Postgres or other providers that use DATABASE_URL
    sequelize = new Sequelize(process.env.DATABASE_URL, config);
  } else {
    // Individual connection parameters
    sequelize = new Sequelize(
      process.env.DB_NAME || 'sage_tracker',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        ...config
      }
    );
  }
  
  console.log('✓ Using PostgreSQL database');
} else {
  // SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sage_tracker.db',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
  
  console.log('✓ Using SQLite database (local development)');
}

export default sequelize;

