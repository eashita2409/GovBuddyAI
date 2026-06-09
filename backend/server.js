/**
 * server.js
 * ---------
 * GovBuddy AI — Express Backend Entry Point
 *
 * This file:
 *  1. Loads environment variables from .env
 *  2. Creates the Express app
 *  3. Applies middleware (JSON parsing, CORS)
 *  4. Mounts API routes
 *  5. Starts the HTTP server
 */

// -----------------------------------------------
// 1. Load environment variables FIRST (before anything else)
// -----------------------------------------------
require('dotenv').config();

const express = require('express');
const cors    = require('cors');

// Import the chat routes
const chatRoutes = require('./routes/chat');

// -----------------------------------------------
// 2. Create Express Application
// -----------------------------------------------
const app = express();

// -----------------------------------------------
// 3. Middleware
// -----------------------------------------------

/**
 * CORS — Cross-Origin Resource Sharing
 * Allows our React frontend (running on localhost:5174)
 * to make requests to this backend (localhost:5000).
 * Without this, the browser would block the request.
 */
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

/**
 * JSON Body Parser
 * Allows Express to read JSON from request bodies.
 * e.g. { "message": "..." }
 */
app.use(express.json());

/**
 * URL-encoded Body Parser
 * Allows Express to read form data if needed.
 */
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------
// 4. Request Logger (simple, beginner-friendly)
// -----------------------------------------------
app.use((req, _res, next) => {
  const time = new Date().toLocaleTimeString('en-IN');
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// -----------------------------------------------
// 5. API Routes
// -----------------------------------------------

/**
 * Root health check — visit http://localhost:5000/
 * to confirm the server is running.
 */
app.get('/', (_req, res) => {
  res.status(200).json({
    message: '🏛️ GovBuddy AI Backend is running!',
    version: '1.0.0',
    endpoints: {
      chat:   'POST /api/chat',
      health: 'GET  /api/chat/health',
    },
  });
});

/**
 * Chat API — all /api/chat/* routes are handled
 * by the chatRoutes router.
 */
app.use('/api/chat', chatRoutes);

// -----------------------------------------------
// 6. 404 Handler — catches unknown routes
// -----------------------------------------------
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    details: 'This endpoint does not exist. Check the URL and try again.',
  });
});

// -----------------------------------------------
// 7. Global Error Handler
// Catches any errors thrown inside route handlers
// that weren't caught by a try/catch block.
// -----------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[GovBuddy] Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message || 'An unexpected error occurred.',
  });
});

// -----------------------------------------------
// 8. Start the Server
// -----------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('🏛️  GovBuddy AI Backend');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅  Server running at  http://localhost:${PORT}`);
  console.log(`🤖  Chat endpoint:     POST /api/chat`);
  console.log(`🩺  Health check:      GET  /api/chat/health`);
  console.log(`🌐  Frontend origin:   ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Warn if API key is not set
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.warn('⚠️  WARNING: OPENAI_API_KEY is not set in .env');
    console.warn('   The /api/chat endpoint will fail until you add your key.');
    console.warn('');
  }
});

module.exports = app; // exported for testing
