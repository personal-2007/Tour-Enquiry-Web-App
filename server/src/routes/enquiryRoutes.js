const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const {
  validateEnquiry,
  validateStatusUpdate,
} = require('../middleware/validateMiddleware');
const { enquiryLimiter } = require('../middleware/rateLimiter');

// POST /api/enquiries - Create a new enquiry (Public)
router.post('/', enquiryLimiter, validateEnquiry, enquiryController.createEnquiry);

// GET /api/enquiries/stats - Summary counts for admin dashboard (Protected)
router.get('/stats', authenticateAdmin, enquiryController.getEnquiryStats);

// GET /api/enquiries - Retrieve paginated enquiries with filters (Protected)
router.get('/', authenticateAdmin, enquiryController.getEnquiries);

// GET /api/enquiries/:id - Retrieve single enquiry details (Protected)
router.get('/:id', authenticateAdmin, enquiryController.getEnquiryById);

// PUT /api/enquiries/:id - Update complete enquiry details (Protected)
router.put('/:id', authenticateAdmin, validateEnquiry, enquiryController.updateEnquiry);

// PATCH /api/enquiries/:id/status - Update enquiry status (Protected)
router.patch(
  '/:id/status',
  authenticateAdmin,
  validateStatusUpdate,
  enquiryController.updateEnquiryStatus
);

// DELETE /api/enquiries/:id - Delete an enquiry (Protected)
router.delete('/:id', authenticateAdmin, enquiryController.deleteEnquiry);

module.exports = router;
