/**
 * routes/chat.js
 * --------------
 * Defines all routes for the /api/chat endpoint.
 *
 * This file keeps routing logic separate from
 * business logic (which lives in the controller).
 */

const express    = require('express');
const router     = express.Router();
const { handleChat } = require('../controllers/chatController');

// -----------------------------------------------
// POST /api/chat
// Body: { "message": "user's question" }
// Returns: { "reply": "AI's response" }
// -----------------------------------------------
router.post('/', handleChat);

// -----------------------------------------------
// GET /api/chat/health
// Simple health check so you can verify the
// chat route is reachable (e.g. via browser or curl).
// -----------------------------------------------
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'GovBuddy AI Chat API',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
