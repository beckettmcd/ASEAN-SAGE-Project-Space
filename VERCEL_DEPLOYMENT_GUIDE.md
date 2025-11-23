# Vercel Deployment Guide

Complete guide for deploying the SAGE TA Tracker backend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```
3. **PostgreSQL Database**: You'll need a PostgreSQL database (see options below)

## Quick Start

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set **Root Directory** to `backend`
   - Click **Deploy**

3. **Configure environment variables** (see below)

4. **Deploy!**

### Option 2: Deploy via CLI

```bash
cd backend
vercel login
vercel
```

Follow the prompts, then set environment variables:
```bash
vercel env add JWT_SECRET
vercel env add DATABASE_URL
# ... add other required variables
```

## Required Environment Variables

Set these in the Vercel dashboard (Settings → Environment Variables):

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-min-32-chars` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |

### Optional (but recommended)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | None (CORS disabled) |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `DB_SSL` | Enable SSL for database | `true` |

### Alternative Database Configuration

If you prefer individual database parameters instead of `DATABASE_URL`:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port (usually 5432) |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_SSL` | Enable SSL (`true`/`false`) |

## Database Setup Options

### Option 1: Vercel Postgres (Easiest) ⭐ Recommended

1. In Vercel dashboard, go to your project
2. Navigate to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Choose a plan (Hobby plan is free)
5. **`DATABASE_URL` is automatically added** to your environment variables!

**Pros:**
- Zero configuration
- Automatic connection pooling
- Integrated with Vercel
- Free tier available

**Cons:**
- Vercel-specific (vendor lock-in)
- Limited free tier

### Option 2: Supabase (Free PostgreSQL)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. Add as `DATABASE_URL` in Vercel

**Pros:**
- Generous free tier
- PostgreSQL-compatible
- Good developer experience
- Can use outside Vercel

**Cons:**
- Requires separate account
- Slightly more setup

### Option 3: Railway

1. Sign up at [railway.app](https://railway.app)
2. Create new project → **Provision PostgreSQL**
3. Copy the connection string
4. Add as `DATABASE_URL` in Vercel

**Pros:**
- Simple setup
- Good free tier
- PostgreSQL

**Cons:**
- Separate service

### Option 4: AWS RDS / Other Managed PostgreSQL

Use any PostgreSQL provider:
- AWS RDS
- Google Cloud SQL
- Azure Database
- DigitalOcean Managed Databases
- Heroku Postgres

Just add the connection string as `DATABASE_URL`.

## Database Migration

After setting up your PostgreSQL database, you need to create the schema and seed data.

### Option 1: Run Migration Locally (Recommended)

1. **Set up local environment** to connect to production database:
   ```bash
   cd backend
   # Create .env.production
   echo "DATABASE_URL=your-production-database-url" > .env.production
   echo "JWT_SECRET=your-jwt-secret" >> .env.production
   ```

2. **Run migrations**:
   ```bash
   NODE_ENV=production npm run seed
   ```

   Or if you have a migration script:
   ```bash
   NODE_ENV=production npm run migrate
   ```

### Option 2: Use Vercel CLI

```bash
cd backend
vercel env pull .env.production
NODE_ENV=production npm run seed
```

### Option 3: Manual SQL Import

1. Export schema from local SQLite (if you have it):
   ```bash
   sqlite3 sage_tracker.db .schema > schema.sql
   ```

2. Convert to PostgreSQL format (may need manual adjustments)

3. Import to PostgreSQL:
   ```bash
   psql $DATABASE_URL < schema.sql
   ```

## CORS Configuration

If your frontend is on a different domain, configure CORS:

1. **In Vercel dashboard**, add environment variable:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com
   ```

2. **For local development**, the backend already allows:
   - `http://localhost:5173`
   - `http://localhost:3000`
   - `http://localhost:5174`

## Deployment Checklist

Before deploying, ensure:

- [ ] Code is pushed to Git repository
- [ ] `DATABASE_URL` is set in Vercel environment variables
- [ ] `JWT_SECRET` is set (strong, random string)
- [ ] `ALLOWED_ORIGINS` is configured (if frontend on different domain)
- [ ] Database schema is migrated/seeded
- [ ] Test database connection works
- [ ] No hardcoded secrets in code

## Testing the Deployment

### 1. Check Health Endpoint

```bash
curl https://your-app.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test API Endpoints

```bash
# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sage.org","password":"admin123"}'
```

### 3. Check Function Logs

In Vercel dashboard:
1. Go to your project
2. Click **Deployments**
3. Click on a deployment
4. Click **Functions** tab
5. View logs for any errors

## Troubleshooting

### Error: FUNCTION_INVOCATION_FAILED

**Possible causes:**
1. **Database connection failed**
   - Check `DATABASE_URL` is correct
   - Verify database is accessible from internet
   - Check firewall/security groups

2. **Missing environment variables**
   - Verify `JWT_SECRET` is set
   - Check all required variables in Vercel dashboard

3. **Database not migrated**
   - Run migrations/seeding (see above)

4. **SQLite still being used**
   - Ensure `DATABASE_URL` is set
   - Check logs to see which database is being used

**Debug steps:**
1. Check Vercel function logs
2. Verify environment variables are set
3. Test database connection string locally
4. Check if database schema exists

### Error: Database Connection Timeout

**Solutions:**
1. **Check database allows connections**
   - Verify database is running
   - Check IP whitelist (if applicable)
   - Some databases require IP allowlisting

2. **Verify connection string format**
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

3. **Check SSL settings**
   - Most cloud databases require SSL
   - Set `DB_SSL=true` or include `?sslmode=require` in URL

### Error: CORS Issues

**Symptoms:** Frontend can't connect to API

**Solutions:**
1. Set `ALLOWED_ORIGINS` in Vercel environment variables
2. Include protocol in origins: `https://yourdomain.com` (not just `yourdomain.com`)
3. Check browser console for specific CORS error

### Cold Start Performance

First request after inactivity is slower (cold start).

**Optimizations:**
1. **Connection pooling**: Already configured in database.js
2. **Keep functions warm**: Use a cron job to ping `/health` endpoint
3. **Upgrade plan**: Vercel Pro has better cold start performance

## Monitoring & Logs

### View Logs

1. **Vercel Dashboard**:
   - Project → Deployments → [Deployment] → Functions → Logs

2. **Vercel CLI**:
   ```bash
   vercel logs [deployment-url]
   ```

### Set Up Monitoring

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Datadog** for APM
- **Vercel Analytics** for performance

## Updating the Deployment

### Automatic (Recommended)

Push to your main branch:
```bash
git push origin main
```

Vercel automatically deploys on push (if connected to Git).

### Manual

```bash
cd backend
vercel --prod
```

## Rollback

If something goes wrong:

1. Go to Vercel dashboard
2. Navigate to **Deployments**
3. Find the previous working deployment
4. Click **⋯** → **Promote to Production**

## Cost Considerations

### Vercel Pricing

- **Hobby (Free)**: 
  - 100GB bandwidth/month
  - Serverless function execution time limits
  - Good for development/small projects

- **Pro ($20/month)**:
  - More bandwidth
  - Better performance
  - Team features

### Database Pricing

- **Vercel Postgres**: Free tier available, then pay-as-you-go
- **Supabase**: Free tier (500MB), then $25/month
- **Railway**: $5/month + usage
- **AWS RDS**: Pay-as-you-go, varies by instance

## Security Best Practices

1. **Never commit secrets** to Git
2. **Use strong JWT_SECRET** (32+ random characters)
3. **Enable SSL** for database connections
4. **Restrict CORS** to specific origins
5. **Use environment variables** for all secrets
6. **Enable Vercel's DDoS protection** (automatic)
7. **Regularly rotate secrets**

## Next Steps

After successful deployment:

1. ✅ Test all API endpoints
2. ✅ Configure custom domain (optional)
3. ✅ Set up monitoring/alerts
4. ✅ Configure backups for database
5. ✅ Update frontend to use production API URL
6. ✅ Set up CI/CD for automated deployments

## Support

If you encounter issues:

1. Check Vercel function logs
2. Review this guide
3. Check [Vercel documentation](https://vercel.com/docs)
4. Review `VERCEL_SQLITE_FIX.md` for database-specific issues

---

**Happy Deploying! 🚀**

