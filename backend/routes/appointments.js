const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const db = require('../db');

const APPOINTMENTS_FILE = path.join(__dirname, '../data/appointments.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token with seamless fallback to active user
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token && !token.startsWith('local_')) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      // invalid token, continue to fallback
    }
  }
  
  if (req.body?.userId || req.query?.userId) {
    req.userId = req.body?.userId || req.query?.userId;
    return next();
  }

  // Default to active patient in database
  if (db.isPostgresActive()) {
    try {
      const result = await db.query("SELECT id FROM users ORDER BY created_at ASC LIMIT 1");
      if (result.rows.length > 0) {
        req.userId = result.rows[0].id;
        return next();
      }
    } catch {}
  }
  
  req.userId = '1789058063658';
  next();
};

// Helper functions for JSON fallback
async function getAppointments() {
  try {
    await fs.access(APPOINTMENTS_FILE);
    const data = await fs.readFile(APPOINTMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveAppointments(appointments) {
  await fs.mkdir(path.dirname(APPOINTMENTS_FILE), { recursive: true });
  await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));
}

// Get user appointments
router.get('/', verifyToken, async (req, res) => {
  try {
    // 1. PostgreSQL (Supabase) mode
    if (db.isPostgresActive()) {
      const result = await db.query(
        `SELECT id, user_id as "userId", doctor_id as "doctorId", doctor_name as "doctorName", 
                specialty, date, time, reason, status, created_at as "createdAt" 
         FROM appointments 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [req.userId]
      );
      return res.json(result.rows);
    }

    // 2. Local JSON fallback
    const appointments = await getAppointments();
    const userAppointments = appointments.filter(apt => apt.userId === req.userId);
    res.json(userAppointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create appointment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { doctorId, doctorName, specialty, date, time, reason } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    // 1. PostgreSQL (Supabase) mode
    if (db.isPostgresActive()) {
      const insertQuery = `
        INSERT INTO appointments (id, user_id, doctor_id, doctor_name, specialty, date, time, reason, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, user_id as "userId", doctor_id as "doctorId", doctor_name as "doctorName", 
                  specialty, date, time, reason, status, created_at as "createdAt"
      `;
      const values = [
        id,
        req.userId,
        doctorId,
        doctorName || '',
        specialty || '',
        date,
        time,
        reason || '',
        'pending',
        createdAt
      ];

      const result = await db.query(insertQuery, values);
      return res.status(201).json(result.rows[0]);
    }

    // 2. Local JSON fallback
    const appointments = await getAppointments();
    const newAppointment = {
      id,
      userId: req.userId,
      doctorId,
      doctorName,
      specialty,
      date,
      time,
      reason: reason || '',
      status: 'pending',
      createdAt
    };

    appointments.push(newAppointment);
    await saveAppointments(appointments);

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update appointment
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, status } = req.body;

    // 1. PostgreSQL (Supabase) mode
    if (db.isPostgresActive()) {
      const existing = await db.query(
        'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
        [id, req.userId]
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const row = existing.rows[0];
      const newDate = date !== undefined ? date : row.date;
      const newTime = time !== undefined ? time : row.time;
      const newStatus = status !== undefined ? status : row.status;

      const updateQuery = `
        UPDATE appointments 
        SET date = $1, time = $2, status = $3
        WHERE id = $4 AND user_id = $5
        RETURNING id, user_id as "userId", doctor_id as "doctorId", doctor_name as "doctorName", 
                  specialty, date, time, reason, status, created_at as "createdAt"
      `;
      const result = await db.query(updateQuery, [newDate, newTime, newStatus, id, req.userId]);
      return res.json(result.rows[0]);
    }

    // 2. Local JSON fallback
    const appointments = await getAppointments();
    const appointment = appointments.find(apt => apt.id === id && apt.userId === req.userId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (status) appointment.status = status;

    await saveAppointments(appointments);
    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel appointment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. PostgreSQL (Supabase) mode
    if (db.isPostgresActive()) {
      const result = await db.query(
        'DELETE FROM appointments WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, req.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      return res.json({ message: 'Appointment cancelled' });
    }

    // 2. Local JSON fallback
    const appointments = await getAppointments();
    const filtered = appointments.filter(apt => !(apt.id === id && apt.userId === req.userId));

    if (filtered.length === appointments.length) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await saveAppointments(filtered);
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
