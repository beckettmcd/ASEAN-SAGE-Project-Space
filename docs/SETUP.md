# SAGE TA Tracker - Setup Guide

This guide provides detailed instructions for setting up the SAGE TA Tracker on your local machine or server.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from https://www.postgresql.org/download/
   - Verify installation: `psql --version`

3. **npm** or **yarn**
   - Comes with Node.js
   - Verify: `npm --version`

### System Requirements

- **RAM:** Minimum 4GB (8GB recommended)
- **Storage:** 2GB free space
- **OS:** Windows 10+, macOS 10.15+, or Linux

## Installation Steps

### 1. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sage_tracker;

# Create user (optional, for production)
CREATE USER sage_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sage_tracker TO sage_user;

# Exit psql
\q
```

#### Alternative: Using GUI Tools

If you prefer GUI tools like pgAdmin or DBeaver:
1. Open your tool and connect to PostgreSQL
2. Create a new database named `sage_tracker`
3. Note the connection details (host, port, username, password)

### 2. Backend Setup

#### Clone and Install

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

#### Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your preferred editor
nano .env  # or vim, code, etc.
```

#### Update .env File

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sage_tracker
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-use-long-random-string
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Important:** 
- Change `JWT_SECRET` to a long, random string in production
- Use strong passwords for database users
- Never commit `.env` to version control

#### Seed the Database

```bash
# This will create tables and populate sample data
npm run seed
```

Expected output:
```
🌱 Starting database seed...
✓ Database synced
✓ Organisations created
✓ Users created
✓ Countries created
✓ Programmes created
✓ Workstreams created
✓ Consultants created
✓ ToRs created
✓ Assignments created
...
🎉 Database seeded successfully!
```

#### Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API should now be running on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

#### Configure (Optional)

The frontend is pre-configured to proxy API requests to `http://localhost:5000`. If you need to change this:

```javascript
// Edit vite.config.js
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://your-backend-url:5000',
        changeOrigin: true
      }
    }
  }
});
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

### 4. Verify Installation

1. **Open browser** and navigate to `http://localhost:3000`
2. **Login** with demo credentials:
   - Email: `admin@sage.org`
   - Password: `admin123`
3. **Check dashboard** loads with sample data
4. **Navigate** through different modules

## Troubleshooting

### Issue: Database Connection Error

**Error:** `Unable to connect to the database`

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   
   # Mac
   brew services list | grep postgresql
   
   # Linux
   systemctl status postgresql
   ```

2. Check connection settings in `.env`
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

4. Test connection:
   ```bash
   psql -U postgres -d sage_tracker
   ```

### Issue: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Find and kill the process:
   ```bash
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. Or change the port in `.env`:
   ```env
   PORT=5001
   ```

### Issue: Frontend Won't Start

**Error:** Various npm errors

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node version:
   ```bash
   node --version  # Should be 18+
   ```

3. Try with `--legacy-peer-deps`:
   ```bash
   npm install --legacy-peer-deps
   ```

### Issue: Authentication Not Working

**Symptoms:** Login fails or token errors

**Solutions:**
1. Clear browser localStorage and cookies
2. Verify `JWT_SECRET` is set in `.env`
3. Check backend logs for errors
4. Re-seed database if needed:
   ```bash
   cd backend
   npm run seed
   ```

### Issue: No Data Showing

**Symptoms:** Empty tables or missing data

**Solutions:**
1. Check backend console for API errors
2. Open browser DevTools Network tab to check API calls
3. Re-seed the database:
   ```bash
   cd backend
   npm run seed
   ```

## Production Deployment

### 1. Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized static files.

### 2. Serve Frontend

Option 1: Serve from Express backend
```javascript
// In backend/src/server.js
app.use(express.static('../frontend/dist'));
```

Option 2: Use a web server (nginx, Apache, etc.)

### 3. Environment Configuration

Create production `.env`:
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_NAME=sage_tracker_prod
DB_USER=sage_user
DB_PASSWORD=strong-password
JWT_SECRET=very-long-random-string-at-least-32-characters
```

### 4. Database Migration

```bash
# Backup existing data
pg_dump sage_tracker > backup.sql

# Run migrations (if any)
npm run migrate

# Or create fresh database
npm run seed
```

### 5. Start Production Server

```bash
cd backend
NODE_ENV=production npm start
```

Or use a process manager like PM2:
```bash
npm install -g pm2
pm2 start src/server.js --name sage-api
pm2 startup
pm2 save
```

## Docker Deployment (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: sage_tracker
      POSTGRES_USER: sage_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_NAME: sage_tracker
      DB_USER: sage_user
      DB_PASSWORD: your_password
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific domains
- [ ] Set up database backups
- [ ] Enable PostgreSQL SSL connections
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerting
- [ ] Review and restrict user permissions
- [ ] Enable audit logging
- [ ] Configure firewall rules
- [ ] Set up intrusion detection

## Maintenance

### Database Backups

```bash
# Manual backup
pg_dump -U sage_user sage_tracker > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U sage_user sage_tracker < backup_20240101.sql
```

### Automated Backups (Cron)

```bash
# Add to crontab
0 2 * * * pg_dump -U sage_user sage_tracker > /backups/sage_$(date +\%Y\%m\%d).sql
```

### Log Management

```bash
# View backend logs
cd backend
tail -f server.log

# With PM2
pm2 logs sage-api
```

### Updates

```bash
# Update dependencies
cd backend && npm update
cd ../frontend && npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

## Support

For issues not covered in this guide:
1. Check the main README.md
2. Review API documentation in docs/API.md
3. Check GitHub issues
4. Contact the development team

## Next Steps

After successful installation:
1. Review the [API Documentation](./API.md)
2. Explore user roles and permissions
3. Configure workstreams and programmes
4. Import your organization's data
5. Train users on the system
6. Set up monitoring and backups

