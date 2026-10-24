const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for admin authentication (login)
 * Limits brute force attacks to 10 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
  },
});

/**
 * Rate limiter for public enquiry submission
 * Allows 20 submissions per hour per IP to prevent spam bots
 */
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many tour enquiries submitted from this IP. Please try again later.',
  },
});

module.exports = {
  authLimiter,
  enquiryLimiter,
};
