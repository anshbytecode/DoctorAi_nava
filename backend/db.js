const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL;

let pool = null;
let isPostgresActive = false;

if (DATABASE_URL) {
  try {
    const isLocal = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1');
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL client error:', err);
    });

    isPostgresActive = true;
    console.log('✅ PostgreSQL database connection initialized.');
  } catch (err) {
    console.error('Failed to initialize PostgreSQL pool:', err.message);
    isPostgresActive = false;
  }
} else {
  console.log('ℹ️  No DATABASE_URL found. Running with local JSON storage fallback.');
}

async function initDB() {
  if (!isPostgresActive || !pool) {
    return false;
  }

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'patient',
          specialty VARCHAR(255),
          license_number VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          data JSONB DEFAULT '{}'
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

        CREATE TABLE IF NOT EXISTS appointments (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          doctor_id VARCHAR(64),
          doctor_name VARCHAR(255),
          specialty VARCHAR(255),
          date VARCHAR(50) NOT NULL,
          time VARCHAR(50) NOT NULL,
          reason TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
      `);
      console.log('✅ PostgreSQL database tables and indexes verified/created successfully.');
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('⚠️  Failed to initialize database tables:', err.message);
    return false;
  }
}

async function query(text, params) {
  if (!isPostgresActive || !pool) {
    throw new Error('PostgreSQL is not active');
  }
  return pool.query(text, params);
}

function getDbStatus() {
  if (isPostgresActive && pool) {
    const isNeon = DATABASE_URL && DATABASE_URL.includes('neon.tech');
    return {
      type: isNeon ? 'PostgreSQL (Neon Cloud)' : 'PostgreSQL (Cloud)',
      connected: true,
      mode: 'cloud'
    };
  }
  return {
    type: 'Local JSON Storage',
    connected: true,
    mode: 'local_fallback'
  };
}

module.exports = {
  pool,
  query,
  initDB,
  isPostgresActive: () => isPostgresActive,
  getDbStatus
};
