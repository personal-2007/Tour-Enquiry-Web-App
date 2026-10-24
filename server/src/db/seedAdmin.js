const bcrypt = require('bcryptjs');
const { query, pool, initDatabase } = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME || 'System Administrator';
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@wanderflow.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  try {
    console.log('[Seed] Ensuring database tables exist...');
    await initDatabase();

    // Check if admin already exists
    const existing = await query('SELECT id, email FROM admins WHERE email = $1', [adminEmail]);
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    if (existing.rows.length > 0) {
      // Update password
      await query(
        'UPDATE admins SET name = $1, password_hash = $2 WHERE email = $3',
        [adminName, passwordHash, adminEmail]
      );
      console.log(`[Seed] Updated existing administrator account: ${adminEmail}`);
    } else {
      // Insert new admin
      await query(
        'INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3)',
        [adminName, adminEmail, passwordHash]
      );
      console.log(`[Seed] Successfully created initial administrator account: ${adminEmail}`);
    }

    console.log('--------------------------------------------------');
    console.log(`Admin Email:    ${adminEmail}`);
    console.log(`Admin Password: [as specified in env / default: Admin@123]`);
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding administrator:', error);
    process.exit(1);
  } finally {
    if (pool && pool.end) {
      await pool.end();
    }
  }
}

seedAdmin();
