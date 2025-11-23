import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Determine database configuration based on environment
// SQLite for local development, PostgreSQL for production/Vercel
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTION_NAME;

// Log environment detection for debugging
console.log(`[Database Config] Serverless detected: ${isServerless}`);
console.log(`[Database Config] DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
console.log(`[Database Config] DB_TYPE: ${process.env.DB_TYPE || 'not set'}`);

// CRITICAL: In serverless environments, NEVER use SQLite (it requires native bindings that don't work)
// Force PostgreSQL in serverless mode
let sequelize;

if (isServerless) {
  // In serverless, we MUST use PostgreSQL - SQLite will not work
  if (!process.env.DATABASE_URL && process.env.DB_TYPE !== 'postgres' && !process.env.DB_HOST) {
    // No database configuration found - create a dummy instance that will fail gracefully
    const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║  ERROR: DATABASE_URL is required in serverless environment    ║
╚════════════════════════════════════════════════════════════════╝

Running in serverless mode (Vercel) but DATABASE_URL is not set.

SQLite cannot be used in serverless environments because it requires
native bindings that don't work in Vercel's serverless functions.

Please set DATABASE_URL in your Vercel environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add DATABASE_URL with your PostgreSQL connection string
   Example: postgresql://user:password@host:5432/database

Alternatively, you can set individual database parameters:
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- And set DB_TYPE=postgres

For local development, SQLite will be used automatically.
`;
    console.error(errorMessage);
    
    // Create a dummy sequelize instance that will fail gracefully on first use
    // This prevents the module from crashing during import
    class DummySequelize extends Sequelize {
      constructor() {
        super('dummy', 'dummy', 'dummy', {
          dialect: 'postgres',
          logging: false,
          retry: { max: 0 }
        });
        this._initializationError = new Error('DATABASE_URL is required in serverless environment. Please set DATABASE_URL in Vercel environment variables.');
      }
      async authenticate() {
        throw this._initializationError;
      }
    }
    
    sequelize = new DummySequelize();
  } else {
    // We have database configuration - use PostgreSQL
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
      },
      retry: {
        max: 3,
        match: [
          /ETIMEDOUT/,
          /EHOSTUNREACH/,
          /ECONNREFUSED/,
          /ECONNRESET/,
          /SequelizeConnectionError/
        ]
      }
    };

    if (process.env.DATABASE_URL) {
      // Vercel Postgres or other providers that use DATABASE_URL
      sequelize = new Sequelize(process.env.DATABASE_URL, config);
      console.log('✓ Using PostgreSQL database (DATABASE_URL)');
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
      console.log('✓ Using PostgreSQL database (individual parameters)');
    }
  }
} else {
  // Local development - use SQLite
  // Use PostgreSQL if: DATABASE_URL is set, OR DB_TYPE is explicitly set to 'postgres'
  // Otherwise default to SQLite for local development
  const usePostgres = process.env.DATABASE_URL || process.env.DB_TYPE === 'postgres';
  
  if (usePostgres) {
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
      sequelize = new Sequelize(process.env.DATABASE_URL, config);
      console.log('✓ Using PostgreSQL database (DATABASE_URL)');
    } else {
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
      console.log('✓ Using PostgreSQL database (individual parameters)');
    }
  } else {
    // SQLite for local development
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './sage_tracker.db',
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    });
    
    console.log('✓ Using SQLite database (local development)');
  }
}

export default sequelize;
