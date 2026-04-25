const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/users.json');
const APPOINTMENTS_FILE = path.join(__dirname, '../data/appointments.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get user appointments
router.get('/', verifyToken, async (req, res) => {
  try {
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

    const appointments = await getAppointments();
    const newAppointment = {
      id: Date.now().toString(),
      userId: req.userId,
      doctorId,
      doctorName,
      specialty,
      date,
      time,
      reason: reason || '',
      status: 'pending',
      createdAt: new Date().toISOString()
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

// Helper functions
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

module.exports = router;

