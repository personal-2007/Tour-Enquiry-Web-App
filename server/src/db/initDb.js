const { initDatabase, pool } = require('../config/db');

async function run() {
  try {
    console.log('[Migration] Running database initialization...');
    await initDatabase();
    console.log('[Migration] Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Migration] Error initializing database:', error);
    process.exit(1);
  } finally {
    if (pool && pool.end) {
      await pool.end();
    }
  }
}

run();
