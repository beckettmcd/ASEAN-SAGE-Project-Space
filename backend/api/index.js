// Vercel serverless function entry point
// This file is required for Vercel to properly handle Express app as a serverless function
import app from '../src/server.js';

// Export the app - Vercel will handle it as a serverless function
// Any initialization errors will be caught by the error handler middleware in server.js
export default app;

