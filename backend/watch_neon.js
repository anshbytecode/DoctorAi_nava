require('dotenv').config({ path: 'backend/.env' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const tables = [
  'vitals', 'appointments', 'medications', 'reminders',
  'health_logs', 'health_records', 'patients', 'medicine_inventory',
  'users'
];

let lastCounts = {};

async function checkNeon() {
  try {
    for (const table of tables) {
      const res = await client.query(`SELECT count(*) FROM "${table}";`);
      const count = parseInt(res.rows[0].count, 10);

      if (lastCounts[table] !== undefined && count > lastCounts[table]) {
        const diff = count - lastCounts[table];
        console.log(`\n🔔 [NEW DATA REFLECTED IN NEON] Table: "${table}" (+${diff} new row(s))`);
        
        // Fetch the newest row
        const latest = await client.query(`SELECT * FROM "${table}" ORDER BY created_at DESC LIMIT 1;`);
        console.log('   Row Data:', latest.rows[0]);
        console.log('------------------------------------------------------------');
      }

      lastCounts[table] = count;
    }
  } catch (err) {
    console.error('Watch error:', err.message);
  }
}

async function start() {
  console.log('⚡ Connecting to Neon PostgreSQL Live Stream...');
  await client.connect();
  console.log('✅ Connected to Neon Cloud database!');
  console.log('👀 Watching all tables live. Make any changes in your website and see them appear here instantly!\n');

  // Initial count load
  for (const table of tables) {
    const res = await client.query(`SELECT count(*) FROM "${table}";`);
    lastCounts[table] = parseInt(res.rows[0].count, 10);
  }

  console.log('📊 Current Live Table Row Counts in Neon:');
  console.table(lastCounts);
  console.log('\n🟢 Live listener active. Waiting for website inputs...');

  setInterval(checkNeon, 1500);
}

start();
