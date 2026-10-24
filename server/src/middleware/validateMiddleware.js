/**
 * Validation and sanitization helpers for enquiry and auth endpoints
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,25}$/;
const ALLOWED_STATUSES = ['Pending', 'Contacted', 'Confirmed', 'Cancelled'];

/**
 * Sanitizes string input to prevent XSS and remove leading/trailing whitespace
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

/**
 * Validates enquiry submission payload
 */
const validateEnquiry = (req, res, next) => {
  const { full_name, email, phone, destination, travel_date, travellers, budget, message } = req.body;
  const errors = {};

  // Full Name
  const cleanName = sanitizeString(full_name);
  if (!cleanName) {
    errors.full_name = 'Full name is required.';
  } else if (cleanName.length < 2 || cleanName.length > 100) {
    errors.full_name = 'Full name must be between 2 and 100 characters.';
  }

  // Email
  const cleanEmail = sanitizeString(email).toLowerCase();
  if (!cleanEmail) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 255) {
    errors.email = 'Please provide a valid email address.';
  }

  // Phone
  const cleanPhone = sanitizeString(phone);
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  if (!cleanPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(cleanPhone) || digitsOnly.length < 7 || digitsOnly.length > 18) {
    errors.phone = 'Please provide a valid contact phone number.';
  }

  // Destination
  const cleanDestination = sanitizeString(destination);
  if (!cleanDestination) {
    errors.destination = 'Destination is required.';
  } else if (cleanDestination.length < 2 || cleanDestination.length > 100) {
    errors.destination = 'Destination must be between 2 and 100 characters.';
  }

  // Travel Date
  if (!travel_date) {
    errors.travel_date = 'Travel date is required.';
  } else {
    const parsedDate = new Date(travel_date);
    if (isNaN(parsedDate.getTime())) {
      errors.travel_date = 'Invalid travel date format.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate < today) {
        errors.travel_date = 'Travel date cannot be in the past.';
      }
    }
  }

  // Number of Travellers
  const numTravellers = parseInt(travellers, 10);
  if (isNaN(numTravellers) || numTravellers < 1) {
    errors.travellers = 'Number of travellers must be at least 1.';
  } else if (numTravellers > 100) {
    errors.travellers = 'Travellers count cannot exceed 100 for standard enquiries.';
  }

  // Budget
  const cleanBudget = sanitizeString(budget);
  if (!cleanBudget) {
    errors.budget = 'Budget range is required.';
  }

  // Message (optional)
  const cleanMessage = sanitizeString(message);
  if (cleanMessage && cleanMessage.length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors,
    });
  }

  // Put sanitized data back into req.body
  req.body.full_name = cleanName;
  req.body.email = cleanEmail;
  req.body.phone = cleanPhone;
  req.body.destination = cleanDestination;
  req.body.travel_date = travel_date;
  req.body.travellers = numTravellers;
  req.body.budget = cleanBudget;
  req.body.message = cleanMessage;

  next();
};

/**
 * Validates status update payload
 */
const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }
  next();
};

/**
 * Validates admin login payload
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  const cleanEmail = sanitizeString(email).toLowerCase();
  if (!cleanEmail) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(cleanEmail)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  req.body.email = cleanEmail;
  next();
};

/**
 * Validates route parameter :id is a positive integer
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  const numId = parseInt(id, 10);
  if (!id || isNaN(numId) || numId <= 0 || !/^\d+$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid enquiry ID. ID must be a positive integer.',
    });
  }
  next();
};

module.exports = {
  validateEnquiry,
  validateStatusUpdate,
  validateLogin,
  validateIdParam,
  ALLOWED_STATUSES,
};
