const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = require('./db');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const medicalRoutes = require('./routes/medical');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS configuration - allow all origins for Netlify and local development
app.use(cors({
  origin: '*', // Allow all origins (Netlify, localhost, etc.)
  credentials: false, // Must be false when origin is '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', medicalRoutes);

// Root route
app.get('/', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    name: 'DoctorAI API Server',
    status: 'online',
    version: '1.0.0',
    database: dbStatus.type,
    mode: dbStatus.mode,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      appointments: '/api/appointments'
    },
    frontend: 'https://doctorainavaviaanshul.netlify.app/'
  });
});

// Health check with live database status
app.get('/api/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    status: 'ok',
    message: 'Server is running',
    database: dbStatus.type,
    mode: dbStatus.mode,
    timestamp: new Date().toISOString()
  });
});

// Initialize database on startup (auto-creates tables in Supabase PostgreSQL if configured)
(async () => {
  if (db.isPostgresActive()) {
    await db.initDB();
  }
})();

app.listen(PORT, () => {
  const dbStatus = db.getDbStatus();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Storage engine: ${dbStatus.type} (${dbStatus.mode})`);
});
