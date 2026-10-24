const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { validateLogin } = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/login - Admin Login
router.post('/login', authLimiter, validateLogin, authController.login);

// GET /api/auth/me - Verify Current Admin Session
router.get('/me', authenticateAdmin, authController.getMe);

// POST /api/auth/logout - End Admin Session
router.post('/logout', authController.logout);

module.exports = router;
