const express = require('express');
const router = express.Router();

// GET /api/health — Server wake-up ping endpoint
// Used by the frontend to detect Render cold-start and wake the server
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'P&L Backend is live ✅',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
