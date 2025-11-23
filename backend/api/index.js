// Vercel serverless function entry point
// This file is required for Vercel to properly handle Express app as a serverless function

// Import the app - if this fails at module load time, Vercel will show the error
// Runtime initialization errors are handled by error handlers in server.js
import app from '../src/server.js';

// Export the app - Vercel will handle it as a serverless function
// Any initialization errors will be caught by the error handler middleware in server.js
export default app;

