const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let pool;
let isInMemory = false;

// Determine if we should use pg-mem (for tests or if no real DATABASE_URL is configured)
const shouldUsePgMem = process.env.NODE_ENV === 'test' || (!process.env.DATABASE_URL && process.env.USE_PG_MEM === 'true');

if (shouldUsePgMem) {
  try {
    const { newDb } = require('pg-mem');
    const memDb = newDb();
    
    // Register custom functions if needed for postgres compatibility
    memDb.public.registerFunction({
      name: 'current_timestamp',
      returns: memDb.public.getType('timestamp with time zone'),
      implementation: () => new Date(),
    });

    const pgAdapter = memDb.adapters.createPg();
    pool = new pgAdapter.Pool();
    isInMemory = true;
    console.log('[DB] Initialized in-memory PostgreSQL adapter (pg-mem).');
  } catch (err) {
    console.error('[DB] Failed to initialize pg-mem fallback:', err.message);
  }
}

if (!pool) {
  const connectionString = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const sslConfig = (isProduction || process.env.DATABASE_SSL === 'true')
    ? { rejectUnauthorized: false }
    : false;

  pool = new Pool({
    connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/tour_enquiry_db',
    ssl: sslConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client:', err.message);
  });
}

/**
 * Executes a parameterized SQL query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<any>}
 */
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log('[DB Query]', { text: text.substring(0, 60), duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
};

/**
 * Initializes database schema by executing schema.sql
 */
const initDatabase = async () => {
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // If in-memory, strip plpgsql triggers which pg-mem does not fully parse
  if (isInMemory) {
    // Basic tables and indexes are supported by pg-mem
    const tablesSql = `
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        travel_date DATE NOT NULL,
        travellers INTEGER NOT NULL CHECK (travellers > 0),
        budget VARCHAR(50) NOT NULL,
        message TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Confirmed', 'Cancelled')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
      CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);
    `;
    await pool.query(tablesSql);
    console.log('[DB] In-memory schema initialized successfully.');
  } else {
    await pool.query(schemaSql);
    console.log('[DB] PostgreSQL schema applied successfully.');
  }

  // Ensure default administrator account exists
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@wanderflow.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    const checkAdmin = await pool.query('SELECT id FROM admins WHERE email = $1', [adminEmail]);
    if (checkAdmin.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(adminPassword, salt);
      await pool.query(
        'INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3)',
        [adminName, adminEmail, hash]
      );
      console.log(`[DB] Auto-seeded administrator: ${adminEmail} (password: ${adminPassword})`);
    }

    // Seed realistic sample tour enquiries if table is empty
    const checkEnquiries = await pool.query('SELECT COUNT(*) AS count FROM enquiries');
    if (parseInt(checkEnquiries.rows[0].count, 10) === 0) {
      const sampleEnquiries = [
        [
          'Sophia Montgomery',
          'sophia.m@example.com',
          '+1 (555) 234-8971',
          'Swiss Alps & Interlaken, Switzerland',
          '2026-11-20',
          2,
          '$2,500 - $5,000',
          'Looking for luxury glacier view chalet and scenic rail tickets for our 10th anniversary.',
          'Pending',
        ],
        [
          'Marcus Chen',
          'marcus.chen@example.com',
          '+1 (555) 876-5432',
          'Kyoto & Tokyo, Japan',
          '2026-12-05',
          4,
          '$2,500 - $5,000',
          'Family trip with two teenagers. Interested in cultural workshops, anime districts, and culinary tours.',
          'Contacted',
        ],
        [
          'Elena Rostova',
          'elena.r@example.com',
          '+1 (555) 432-1098',
          'Santorini, Greece',
          '2026-11-12',
          2,
          'Luxury ($5,000+)',
          'Requires private catamaran charter and cliffside suite with heated infinity pool.',
          'Confirmed',
        ],
      ];

      for (const enq of sampleEnquiries) {
        await pool.query(
          `INSERT INTO enquiries (full_name, email, phone, destination, travel_date, travellers, budget, message, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          enq
        );
      }
      console.log('[DB] Auto-seeded 3 realistic sample enquiries for demonstration.');
    }
  } catch (seedErr) {
    console.error('[DB] Error during default data seeding:', seedErr.message);
  }
};

module.exports = {
  pool,
  query,
  initDatabase,
  isInMemory: () => isInMemory,
};
