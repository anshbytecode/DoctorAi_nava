const express = require('express');
const db = require('../db');
const router = express.Router();

// Endpoint returning live tables and rows from Neon PostgreSQL
router.get('/api/db-live/data', async (req, res) => {
  try {
    if (!db.isPostgresActive()) {
      return res.status(503).json({ error: 'PostgreSQL connection not active' });
    }

    const tables = [
      'vitals', 'appointments', 'medications', 'reminders', 
      'health_logs', 'health_records', 'patients', 'medicine_inventory',
      'consult_copilot_notes', 'patient_documents', 'users'
    ];

    const results = {};
    for (const table of tables) {
      try {
        const countRes = await db.query(`SELECT count(*) FROM "${table}";`);
        const rowsRes = await db.query(`SELECT * FROM "${table}" ORDER BY created_at DESC LIMIT 15;`);
        results[table] = {
          count: parseInt(countRes.rows[0].count, 10),
          rows: rowsRes.rows
        };
      } catch (err) {
        results[table] = { count: 0, rows: [], error: err.message };
      }
    }

    res.json({
      database: 'Neon PostgreSQL',
      timestamp: new Date().toISOString(),
      tables: results
    });
  } catch (err) {
    console.error('db-live data error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Real-time Visual Neon Database Viewer UI
router.get('/db-live', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ Neon PostgreSQL Live Database Monitor</title>
  <style>
    :root {
      --bg: #090d16;
      --card: #111827;
      --border: #1f293d;
      --text: #f3f4f6;
      --text-muted: #94a3b8;
      --accent: #00e599;
      --accent-glow: rgba(0, 229, 153, 0.2);
      --neon-cyan: #00d2ff;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 1.5rem;
      min-height: 100vh;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .title-group { display: flex; align-items: center; gap: 0.75rem; }
    .logo-badge {
      background: linear-gradient(135deg, #00e599, #00d2ff);
      color: #000;
      font-weight: 800;
      font-size: 0.9rem;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    h1 { font-size: 1.4rem; font-weight: 700; color: #fff; }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      background: rgba(0, 229, 153, 0.1);
      border: 1px solid rgba(0, 229, 153, 0.3);
      color: var(--accent);
      padding: 0.4rem 0.85rem;
      border-radius: 20px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .tab-btn {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.75rem;
      color: var(--text-muted);
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }
    .tab-btn:hover { border-color: var(--accent); color: #fff; }
    .tab-btn.active {
      border-color: var(--accent);
      background: rgba(0, 229, 153, 0.08);
      color: #fff;
      box-shadow: 0 0 15px var(--accent-glow);
    }
    .tab-btn .table-name { font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
    .tab-btn .table-count { font-size: 1.3rem; font-weight: 800; color: var(--accent); margin-top: 0.25rem; }
    
    .table-container {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }
    .table-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);
    }
    .table-title { font-size: 1.1rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
    .last-updated { font-size: 0.8rem; color: var(--text-muted); }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .data-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      background: #0d1321;
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--border);
    }
    .data-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(31, 41, 61, 0.5);
      color: #e2e8f0;
    }
    .data-table tr:hover { background: rgba(255, 255, 255, 0.03); }
    .new-row {
      animation: flashGreen 2s ease-out;
    }
    @keyframes flashGreen {
      0% { background: rgba(0, 229, 153, 0.35); }
      100% { background: transparent; }
    }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(0, 210, 255, 0.15);
      color: var(--neon-cyan);
    }
    .empty-state {
      padding: 3rem;
      text-align: center;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-group">
      <div class="logo-badge">NEON POSTGRESQL</div>
      <h1>Live Real-Time Database Monitor</h1>
    </div>
    <div class="status-indicator">
      <span class="dot"></span>
      <span id="sync-status">Live Connected (1.5s Polling)</span>
    </div>
  </div>

  <div class="summary-grid" id="tabs-grid"></div>

  <div class="table-container">
    <div class="table-header">
      <div class="table-title">
        <span id="active-table-name">vitals</span>
        <span class="badge" id="active-table-badge">0 rows</span>
      </div>
      <div class="last-updated" id="last-updated">Updating...</div>
    </div>
    <div style="overflow-x: auto;">
      <table class="data-table">
        <thead id="table-head"></thead>
        <tbody id="table-body"></tbody>
      </table>
    </div>
  </div>

  <script>
    let activeTable = 'vitals';
    let previousCounts = {};
    let latestData = null;

    async function fetchLiveDB() {
      try {
        const res = await fetch('/api/db-live/data');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        latestData = data;
        renderTabs(data.tables);
        renderActiveTable(data.tables[activeTable]);
        document.getElementById('last-updated').innerText = 'Last synced: ' + new Date().toLocaleTimeString();
        document.getElementById('sync-status').innerText = 'Live Synced with Neon Cloud';
      } catch (err) {
        document.getElementById('sync-status').innerText = 'Reconnecting...';
      }
    }

    function renderTabs(tables) {
      const grid = document.getElementById('tabs-grid');
      grid.innerHTML = '';
      for (const [name, info] of Object.entries(tables)) {
        const btn = document.createElement('div');
        btn.className = 'tab-btn' + (name === activeTable ? ' active' : '');
        
        // detect new count
        if (previousCounts[name] !== undefined && info.count > previousCounts[name]) {
          btn.style.animation = 'flashGreen 1.5s ease-out';
        }
        previousCounts[name] = info.count;

        btn.onclick = () => {
          activeTable = name;
          renderTabs(latestData.tables);
          renderActiveTable(latestData.tables[name]);
        };
        btn.innerHTML = \`
          <div class="table-name">\${name.replace(/_/g, ' ')}</div>
          <div class="table-count">\${info.count}</div>
        \`;
        grid.appendChild(btn);
      }
    }

    function renderActiveTable(tableInfo) {
      document.getElementById('active-table-name').innerText = activeTable.toUpperCase().replace(/_/g, ' ');
      document.getElementById('active-table-badge').innerText = (tableInfo ? tableInfo.count : 0) + ' rows in Neon';

      const thead = document.getElementById('table-head');
      const tbody = document.getElementById('table-body');
      thead.innerHTML = '';
      tbody.innerHTML = '';

      if (!tableInfo || !tableInfo.rows || tableInfo.rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No records found in table yet</td></tr>';
        return;
      }

      const columns = Object.keys(tableInfo.rows[0]);
      const headerRow = document.createElement('tr');
      columns.forEach(col => {
        const th = document.createElement('th');
        th.innerText = col.replace(/_/g, ' ').toUpperCase();
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      tableInfo.rows.forEach((row, idx) => {
        const tr = document.createElement('tr');
        if (idx === 0) tr.classList.add('new-row');
        columns.forEach(col => {
          const td = document.createElement('td');
          const val = row[col];
          if (val === null || val === undefined) {
            td.innerHTML = '<span style="color: #64748b;">null</span>';
          } else if (typeof val === 'object') {
            td.innerText = JSON.stringify(val);
          } else {
            td.innerText = val.toString();
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    fetchLiveDB();
    setInterval(fetchLiveDB, 1500);
  </script>
</body>
</html>`);
});

module.exports = router;
