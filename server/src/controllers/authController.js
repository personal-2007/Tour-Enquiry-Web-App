const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '24h';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in ms

/**
 * Admin Login
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch admin by email
    const result = await query(
      'SELECT id, name, email, password_hash, created_at FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    const admin = result.rows[0];

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Set HTTP-only Cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          created_at: admin.created_at,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Current Admin Session
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      admin: req.admin,
    },
  });
};

/**
 * Admin Logout
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = {
  login,
  getMe,
  logout,
};
