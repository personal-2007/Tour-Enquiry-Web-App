const { query } = require('../config/db');

/**
 * Create a new Tour Enquiry
 * POST /api/enquiries (Public)
 */
const createEnquiry = async (req, res, next) => {
  try {
    const {
      full_name,
      email,
      phone,
      destination,
      travel_date,
      travellers,
      budget,
      message,
    } = req.body;

    const insertSql = `
      INSERT INTO enquiries (
        full_name,
        email,
        phone,
        destination,
        travel_date,
        travellers,
        budget,
        message,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')
      RETURNING *;
    `;

    const values = [
      full_name,
      email,
      phone,
      destination,
      travel_date,
      travellers,
      budget,
      message || null,
    ];

    const result = await query(insertSql, values);
    const newEnquiry = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Your tour enquiry has been submitted successfully! Our travel specialist will contact you shortly.',
      data: newEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve enquiries with filtering, searching, and pagination
 * GET /api/enquiries (Admin only)
 */
const getEnquiries = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const { status, search, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

    const whereClauses = [];
    const queryParams = [];

    // Filter by status
    if (status && ['Pending', 'Contacted', 'Confirmed', 'Cancelled'].includes(status)) {
      queryParams.push(status);
      whereClauses.push(`status = $${queryParams.length}`);
    }

    // Search query across name, email, destination, phone
    if (search && search.trim() !== '') {
      queryParams.push(`%${search.trim().toLowerCase()}%`);
      const pIdx = queryParams.length;
      whereClauses.push(`(
        LOWER(full_name) LIKE $${pIdx} OR 
        LOWER(email) LIKE $${pIdx} OR 
        LOWER(destination) LIKE $${pIdx} OR 
        phone LIKE $${pIdx}
      )`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total matching records
    const countQuery = `SELECT COUNT(*) AS total FROM enquiries ${whereSql};`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total, 10);

    // Validate sort column to avoid SQL injection
    const allowedSortColumns = ['id', 'full_name', 'destination', 'travel_date', 'travellers', 'status', 'created_at'];
    const validSortCol = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const validOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Retrieve records
    const selectSql = `
      SELECT * FROM enquiries
      ${whereSql}
      ORDER BY ${validSortCol} ${validOrder}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
    `;

    const recordsResult = await query(selectSql, [...queryParams, limit, offset]);

    return res.status(200).json({
      success: true,
      data: recordsResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve single enquiry by ID
 * GET /api/enquiries/:id (Admin only)
 */
const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM enquiries WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Enquiry with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Full update of an enquiry
 * PUT /api/enquiries/:id (Admin only)
 */
const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      email,
      phone,
      destination,
      travel_date,
      travellers,
      budget,
      message,
      status,
    } = req.body;

    // Verify existing record
    const checkResult = await query('SELECT id FROM enquiries WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Enquiry with ID ${id} not found.`,
      });
    }

    const updateSql = `
      UPDATE enquiries
      SET 
        full_name = $1,
        email = $2,
        phone = $3,
        destination = $4,
        travel_date = $5,
        travellers = $6,
        budget = $7,
        message = $8,
        status = COALESCE($9, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *;
    `;

    const values = [
      full_name,
      email,
      phone,
      destination,
      travel_date,
      travellers,
      budget,
      message || null,
      status || null,
      id,
    ];

    const result = await query(updateSql, values);

    return res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update enquiry status only
 * PATCH /api/enquiries/:id/status (Admin only)
 */
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateSql = `
      UPDATE enquiries
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await query(updateSql, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Enquiry with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Enquiry status updated to '${status}'.`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an enquiry
 * DELETE /api/enquiries/:id (Admin only)
 */
const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM enquiries WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Enquiry with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Enquiry #${id} was permanently deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve enquiry dashboard statistics
 * GET /api/enquiries/stats (Admin only)
 */
const getEnquiryStats = async (req, res, next) => {
  try {
    const statsSql = `
      SELECT 
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pending,
        COUNT(CASE WHEN status = 'Contacted' THEN 1 END) AS contacted,
        COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) AS confirmed,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS cancelled
      FROM enquiries;
    `;

    const result = await query(statsSql);
    const row = result.rows[0] || {};

    return res.status(200).json({
      success: true,
      data: {
        total: parseInt(row.total || 0, 10),
        pending: parseInt(row.pending || 0, 10),
        contacted: parseInt(row.contacted || 0, 10),
        confirmed: parseInt(row.confirmed || 0, 10),
        cancelled: parseInt(row.cancelled || 0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  getEnquiryStats,
};
