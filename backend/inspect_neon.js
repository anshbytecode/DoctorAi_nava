require('dotenv').config({ path: 'backend/.env' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function inspect() {
  try {
    await client.connect();
    console.log('Connected to:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

    const dbInfo = await client.query(`
      SELECT 
        current_database() as db,
        current_user as user,
        current_schema() as schema,
        version() as pg_version;
    `);
    console.log('Current DB Info:', dbInfo.rows[0]);

    const schemas = await client.query(`
      SELECT schema_name FROM information_schema.schemata;
    `);
    console.log('Available Schemas:', schemas.rows.map(r => r.schema_name));

    const tables = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_schema, table_name;
    `);
    console.log('All Tables:', tables.rows);

    const counts = {};
    for (const row of tables.rows) {
      if (row.table_schema === 'public') {
        const countRes = await client.query(`SELECT count(*) FROM "${row.table_name}";`);
        counts[row.table_name] = parseInt(countRes.rows[0].count, 10);
      }
    }
    console.log('Row counts in public tables:', counts);

    const otherDbs = await client.query(`
      SELECT datname FROM pg_database WHERE datistemplate = false;
    `);
    console.log('Databases in cluster:', otherDbs.rows.map(r => r.datname));

  } catch (err) {
    console.error('Error during inspect:', err);
  } finally {
    await client.end();
  }
}

inspect();
