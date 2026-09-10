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
        -- 1. Users Table
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

        -- 2. Appointments Table
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

        -- 3. Health Records Table
        CREATE TABLE IF NOT EXISTS health_records (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          date VARCHAR(50) NOT NULL,
          doctor VARCHAR(255),
          description TEXT,
          notes TEXT,
          images TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);

        -- 4. Medications Table
        CREATE TABLE IF NOT EXISTS medications (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          doctor_id VARCHAR(64),
          name VARCHAR(255) NOT NULL,
          generic_name VARCHAR(255),
          dosage VARCHAR(100),
          frequency VARCHAR(100),
          next_dose VARCHAR(50),
          start_date VARCHAR(50),
          end_date VARCHAR(50),
          instructions TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);

        -- 5. Vitals Table
        CREATE TABLE IF NOT EXISTS vitals (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          date VARCHAR(50) NOT NULL,
          systolic_bp INT,
          diastolic_bp INT,
          heart_rate INT,
          weight NUMERIC(5,2),
          temperature NUMERIC(4,2),
          blood_sugar NUMERIC(5,2),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_vitals_user_id ON vitals(user_id);

        -- 6. Patients Directory Table
        CREATE TABLE IF NOT EXISTS patients (
          id VARCHAR(64) PRIMARY KEY,
          doctor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          age INT,
          gender VARCHAR(20),
          blood_group VARCHAR(10),
          last_visit VARCHAR(50),
          status VARCHAR(50) DEFAULT 'active',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);

        -- 7. Medicine Inventory Table
        CREATE TABLE IF NOT EXISTS medicine_inventory (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          generic_name VARCHAR(255),
          quantity INT NOT NULL DEFAULT 0,
          unit VARCHAR(50) DEFAULT 'tablets',
          expiry_date VARCHAR(50),
          category VARCHAR(100),
          supplier VARCHAR(255),
          price NUMERIC(10,2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_inventory_category ON medicine_inventory(category);

        -- 8. Patient Documents Table
        CREATE TABLE IF NOT EXISTS patient_documents (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
          doctor_id VARCHAR(64),
          title VARCHAR(255) NOT NULL,
          document_type VARCHAR(50),
          file_url TEXT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_documents_user_id ON patient_documents(user_id);

        -- 9. Reminders Table
        CREATE TABLE IF NOT EXISTS reminders (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          type VARCHAR(50) DEFAULT 'medication',
          date VARCHAR(50),
          time VARCHAR(50),
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);

        -- 10. Health Logs Table
        CREATE TABLE IF NOT EXISTS health_logs (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          date VARCHAR(50) NOT NULL,
          symptoms TEXT,
          mood VARCHAR(50),
          sleep_hours NUMERIC(4,1),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_health_logs_user_id ON health_logs(user_id);

        -- 11. Consult Copilot Notes Table
        CREATE TABLE IF NOT EXISTS consult_copilot_notes (
          id VARCHAR(64) PRIMARY KEY,
          doctor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          patient_id VARCHAR(64),
          patient_name VARCHAR(255),
          visit_date VARCHAR(50) NOT NULL,
          chief_complaint TEXT,
          subjective TEXT,
          objective TEXT,
          assessment TEXT,
          plan TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_copilot_doctor_id ON consult_copilot_notes(doctor_id);
      `);
      console.log('✅ PostgreSQL database: All 11 tables and indexes verified/created successfully.');
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
