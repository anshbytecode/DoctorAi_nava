require('dotenv').config({ path: 'backend/.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    console.log('Connecting to Neon PostgreSQL...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log('Applying backend/schema.sql to Neon PostgreSQL...');
    await pool.query(schemaSql);
    console.log('Schema successfully applied!');

    const res = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    console.log('Live Neon Tables:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

main();
