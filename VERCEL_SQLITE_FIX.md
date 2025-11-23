# Vercel FUNCTION_INVOCATION_FAILED Error - SQLite Database Fix

## 1. The Fix

### Problem Identified
Your application was using **SQLite** (a file-based database) which is incompatible with Vercel's serverless environment. Vercel functions have a **read-only filesystem** (except `/tmp`), so SQLite cannot create or access database files.

### Changes Made

1. **Updated `backend/src/config/database.js`**:
   - Added intelligent database selection logic
   - Uses **SQLite for local development** (when no serverless environment detected)
   - Automatically switches to **PostgreSQL for Vercel/serverless** environments
   - Supports both `DATABASE_URL` (Vercel Postgres) and individual connection parameters

2. **Fixed Port Conflict**:
   - Changed default backend port from `5000` to `5001` (macOS ControlCenter uses port 5000)
   - Frontend already configured for port 5001

### Key Code Changes

**Before (Problematic):**
```javascript
// Always used SQLite - fails on Vercel
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sage_tracker.db',  // ❌ Can't write files on Vercel
});
```

**After (Fixed):**
```javascript
// Smart database selection
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const usePostgres = process.env.DATABASE_URL || isServerless || process.env.DB_TYPE === 'postgres';

if (usePostgres) {
  // ✅ PostgreSQL for Vercel/production
  sequelize = new Sequelize(process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    // ... PostgreSQL config
  });
} else {
  // ✅ SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sage_tracker.db',
  });
}
```

## 2. Root Cause Analysis

### What Was Happening vs. What Was Needed

**What the code was doing:**
- Trying to use SQLite database file (`./sage_tracker.db`)
- Attempting to read/write to the filesystem
- Assuming file-based storage works everywhere

**What Vercel needed:**
- A database that works in serverless environments
- No file system dependencies
- Network-accessible database (PostgreSQL, MySQL, etc.)

### Why This Error Occurred

1. **Filesystem Limitations**:
   - Vercel serverless functions have **ephemeral, read-only filesystems**
   - Only `/tmp` is writable, and it's cleared between invocations
   - SQLite requires persistent file storage

2. **The Specific Trigger**:
   - When Vercel tried to invoke your function, it imported `database.js`
   - Sequelize tried to access `./sage_tracker.db`
   - The file doesn't exist in the deployment (and can't be created)
   - Database connection failed → Function invocation failed

3. **The Misconception**:
   - Assumed SQLite works everywhere (it's "portable")
   - Didn't account for serverless filesystem restrictions
   - Thought file-based databases are simpler for deployment (they're not for serverless)

## 3. Understanding the Concept

### Why This Error Exists

**Serverless Filesystem Constraints:**
- **Traditional Server**: 
  - Persistent filesystem
  - Can read/write files anywhere
  - Files persist between requests
  - SQLite works perfectly

- **Serverless Function**:
  - Ephemeral filesystem (cleared after execution)
  - Read-only except `/tmp`
  - Each invocation may be on a different container
  - SQLite **cannot work** (needs persistent storage)

### The Mental Model

Think of serverless functions as **stateless, ephemeral processes**:

```
Traditional Server:
[Request] → [Server Process] → [SQLite File] → [Response]
              ↑ (persistent)      ↑ (persistent)

Serverless Function:
[Request] → [Function Invocation] → [❌ No persistent storage]
              ↑ (ephemeral)         ↑ (read-only filesystem)
              ↓
              [✅ Network Database] → [Response]
```

**Key Principle**: Serverless = Stateless. Any persistent data must be external (database, object storage, etc.).

### Framework Design

This is a fundamental difference in deployment models:

1. **Traditional Deployment**: 
   - Your code + data files live together
   - Filesystem is your friend
   - SQLite is perfect

2. **Serverless Deployment**:
   - Your code is isolated
   - Filesystem is ephemeral
   - Must use external services for persistence

Vercel enforces this separation to ensure:
- **Scalability**: Functions can run on any container
- **Isolation**: No state leakage between invocations
- **Reliability**: Failed functions don't corrupt data

## 4. Warning Signs & Prevention

### Red Flags to Watch For

1. **File-based databases in serverless code**
   ```javascript
   // ❌ BAD - Will fail on Vercel
   const db = new Sequelize({
     dialect: 'sqlite',
     storage: './database.db'
   });
   
   // ✅ GOOD - Use environment-aware config
   const db = usePostgres 
     ? new Sequelize(DATABASE_URL)
     : new Sequelize({ dialect: 'sqlite', storage: './database.db' });
   ```

2. **File system writes in serverless**
   ```javascript
   // ❌ BAD - Can't write to filesystem
   fs.writeFileSync('./data.json', json);
   
   // ✅ GOOD - Use cloud storage or database
   await s3.putObject({ Bucket: 'my-bucket', Key: 'data.json', Body: json });
   ```

3. **Assuming files persist**
   ```javascript
   // ❌ BAD - Files don't persist
   let cache = {};
   fs.readFileSync('./cache.json');
   
   // ✅ GOOD - Use external cache
   const cache = await redis.get('cache-key');
   ```

### Code Smells

- **File paths in serverless code**: `./database.db`, `./uploads/`, `./logs/`
- **Synchronous file operations**: `fs.readFileSync()`, `fs.writeFileSync()`
- **Local file storage**: Any code that assumes files exist between requests
- **SQLite without environment checks**: Using SQLite without checking if it's supported

### Similar Mistakes

1. **File uploads**: Can't save to local filesystem (use S3, Cloudinary, etc.)
2. **Logging to files**: Use cloud logging (Vercel logs, CloudWatch, etc.)
3. **Session storage**: In-memory sessions don't persist (use Redis, database)
4. **Temporary files**: Only `/tmp` is writable, and it's cleared
5. **Configuration files**: Don't read from local files (use environment variables)

## 5. Alternative Approaches

### Option 1: Environment-Aware Database (Current Fix) ✅
**How it works:**
- Detects serverless environment
- Uses SQLite locally, PostgreSQL on Vercel
- Single codebase, works everywhere

**Pros:**
- Works for both local dev and production
- No code duplication
- Easy to maintain
- Automatic detection

**Cons:**
- Slightly more complex logic
- Need to test both database types
- Requires PostgreSQL setup for production

**Best for:** Projects that need to work locally and on Vercel

### Option 2: Always Use PostgreSQL
**How it works:**
- Remove SQLite entirely
- Always use PostgreSQL (local and production)
- Use Docker or local PostgreSQL for development

**Pros:**
- Simpler code (one database type)
- Production-like local environment
- No environment detection needed

**Cons:**
- Requires PostgreSQL setup for local dev
- More complex local setup
- Heavier development environment

**Best for:** Teams comfortable with PostgreSQL, production-focused

### Option 3: Use Vercel Postgres
**How it works:**
- Use Vercel's managed PostgreSQL
- Connect via `DATABASE_URL` environment variable
- Works seamlessly with Vercel deployments

**Pros:**
- Native Vercel integration
- Automatic connection pooling
- Easy setup in Vercel dashboard
- Free tier available

**Cons:**
- Vercel-specific (vendor lock-in)
- Still need local PostgreSQL for dev
- Costs money at scale

**Best for:** Projects exclusively on Vercel

### Option 4: Use Serverless-Compatible Database
**Alternatives:**
- **PlanetScale** (MySQL-compatible, serverless)
- **Supabase** (PostgreSQL, serverless)
- **FaunaDB** (NoSQL, serverless-native)
- **DynamoDB** (NoSQL, AWS serverless)

**Pros:**
- Built for serverless
- Auto-scaling
- Global distribution
- Pay-per-use pricing

**Cons:**
- May require code changes
- Different query languages
- Learning curve
- Vendor-specific

**Best for:** New projects or major refactors

## 6. Setup Instructions

### For Local Development (SQLite)

No changes needed! The fix automatically uses SQLite when:
- Not in serverless environment
- No `DATABASE_URL` set
- `DB_TYPE` not set to 'postgres'

### For Vercel Deployment (PostgreSQL)

**Option A: Use Vercel Postgres (Recommended)**

1. In Vercel dashboard, go to your project
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Copy the `DATABASE_URL` (automatically added to environment variables)
4. Deploy - it will automatically use PostgreSQL!

**Option B: Use External PostgreSQL**

1. Set up PostgreSQL (AWS RDS, Railway, Supabase, etc.)
2. In Vercel dashboard, add environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
   OR
   ```
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=sage_tracker
   DB_USER=your-user
   DB_PASSWORD=your-password
   DB_SSL=true
   ```
3. Deploy

### Migrating Data from SQLite to PostgreSQL

If you have existing SQLite data:

1. **Export from SQLite:**
   ```bash
   sqlite3 sage_tracker.db .dump > dump.sql
   ```

2. **Convert to PostgreSQL format:**
   - Remove SQLite-specific syntax
   - Update data types if needed
   - Use a migration tool like `pgloader`

3. **Import to PostgreSQL:**
   ```bash
   psql $DATABASE_URL < dump.sql
   ```

Or use Sequelize migrations to recreate the schema.

## 7. Testing the Fix

### Local Testing
```bash
cd backend
npm run dev
# Should see: "✓ Using SQLite database (local development)"
# Server should start on port 5001
```

### Vercel Testing
1. Deploy to Vercel
2. Check function logs in Vercel dashboard
3. Should see: "✓ Using PostgreSQL database"
4. Test API endpoints

### Verify Database Connection
```bash
# Local (SQLite)
curl http://localhost:5001/health

# Vercel (PostgreSQL)
curl https://your-app.vercel.app/health
```

## Summary

The error occurred because **SQLite requires file system access**, which **Vercel serverless functions don't provide**. The fix automatically detects the environment and uses the appropriate database:
- **SQLite** for local development (simple, no setup)
- **PostgreSQL** for Vercel/production (serverless-compatible)

This pattern of **environment-aware configuration** is essential for serverless deployments where filesystem access is restricted.

