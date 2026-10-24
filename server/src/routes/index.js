const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const enquiryRoutes = require('./enquiryRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Tour Enquiry REST API',
  });
});

// Mount Routes
router.use('/auth', authRoutes);
router.use('/enquiries', enquiryRoutes);

module.exports = router;
