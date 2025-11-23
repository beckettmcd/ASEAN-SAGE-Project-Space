# Quick Start Guide

## ✅ Current Status

Both servers are now running:
- **Backend API**: `http://localhost:5001` ✓
- **Frontend App**: `http://localhost:3000` ✓

## 🚀 Access Your Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📋 Starting the Servers

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

You should see:
```
✓ Using SQLite database (local development)
✓ Database connection established successfully
✓ Server running on port 5001
✓ API available at http://localhost:5001/api
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🔐 Login Credentials

After seeding the database, use these demo accounts:

- **Admin**: 
  - Email: `admin@sage.org`
  - Password: `admin123`

- **FCDO SRO**: 
  - Email: `sro@fcdo.gov.uk`
  - Password: `fcdo123`

- **Country Focal Point**: 
  - Email: `focal@edu.gov.th`
  - Password: `focal123`

- **Implementer**: 
  - Email: `impl@dai.com`
  - Password: `impl123`

## 🛠️ Troubleshooting

### Backend won't start

**Port 5001 already in use:**
```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9
```

**Missing JWT_SECRET:**
```bash
cd backend
# Add to .env file
echo "JWT_SECRET=your-super-secret-key-min-32-characters" >> .env
```

**Database connection error:**
- For local development, SQLite is used automatically
- Make sure `backend/sage_tracker.db` exists or run:
  ```bash
  cd backend
  npm run seed
  ```

### Frontend won't start

**Port 3000 already in use:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

**Dependencies not installed:**
```bash
cd frontend
npm install
```

**Can't connect to backend:**
- Verify backend is running on port 5001
- Check `frontend/vite.config.js` has correct proxy target
- Check browser console for CORS errors

### Connection Refused Errors

**Backend not responding:**
1. Check if backend process is running: `lsof -ti:5001`
2. Check backend logs for errors
3. Verify `.env` file exists with `JWT_SECRET`

**Frontend can't reach backend:**
1. Verify backend is running: `curl http://localhost:5001/health`
2. Check proxy configuration in `vite.config.js`
3. Check browser Network tab for failed requests

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Frontend
No environment variables needed for local development. The proxy in `vite.config.js` handles API routing.

## 🔍 Verify Everything Works

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5001/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend Proxy Test:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

3. **Open Browser:**
   - Navigate to `http://localhost:3000`
   - Should see login page
   - Try logging in with demo credentials

## 🎯 Next Steps

1. ✅ Both servers running
2. ✅ Open `http://localhost:3000` in browser
3. ✅ Login with demo credentials
4. ✅ Explore the application!

## 📚 Additional Resources

- **Vercel Deployment**: See `VERCEL_DEPLOYMENT_GUIDE.md`
- **SQLite Fix**: See `VERCEL_SQLITE_FIX.md`
- **API Documentation**: See `docs/API.md`
- **Setup Guide**: See `docs/SETUP.md`

---

**Happy Coding! 🚀**

