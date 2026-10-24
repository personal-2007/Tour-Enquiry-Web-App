const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'tour-enquiry-dev-secret-key-32chars!';

/**
 * Middleware to authenticate administrator via JWT in HTTP-only cookie or Bearer token
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check HTTP-only cookie first
    if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }
    // Check Authorization header as fallback (useful for Postman & mobile clients)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as an administrator.',
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.',
      });
    }

    // Verify admin user still exists in database
    const adminResult = await query(
      'SELECT id, name, email, created_at FROM admins WHERE id = $1',
      [decoded.id]
    );

    if (adminResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Administrator account not found or deactivated.',
      });
    }

    // Attach admin details to request
    req.admin = adminResult.rows[0];
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal authorization error.',
    });
  }
};

module.exports = {
  authenticateAdmin,
  JWT_SECRET,
};
