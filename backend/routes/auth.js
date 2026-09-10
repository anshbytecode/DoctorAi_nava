const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DATA_FILE = path.join(__dirname, '../data/users.json');

// Ensure data directory exists for JSON fallback
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Read users from file (JSON fallback)
async function getUsers() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write users to file (JSON fallback)
async function saveUsers(users) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, specialty, licenseNumber } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Please provide name, email, and password' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }

    // Validate role
    const userRole = role || 'patient';
    if (!['patient', 'doctor'].includes(userRole)) {
      return res.status(400).json({ 
        error: 'Role must be either "patient" or "doctor"' 
      });
    }

    // If doctor, validate specialty
    if (userRole === 'doctor' && !specialty) {
      return res.status(400).json({ 
        error: 'Doctors must provide a specialty' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    // 1. PostgreSQL (Supabase) mode
    if (db.isPostgresActive()) {
      const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ 
          error: 'User with this email already exists' 
        });
      }

      const insertQuery = `
        INSERT INTO users (id, name, email, password, role, specialty, license_number, created_at, data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, name, email, role, specialty, created_at
      `;
      const values = [
        id,
        name,
        email,
        hashedPassword,
        userRole,
        userRole === 'doctor' ? specialty : null,
        userRole === 'doctor' ? licenseNumber : null,
        createdAt,
        JSON.stringify({
          healthRecords: [],
          appointments: [],
          patientDocuments: [],
          inventory: []
        })
      ];

      const result = await db.query(insertQuery, values);
      const user = result.rows[0];

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialty: user.specialty
        }
      });
    }

    // 2. Local JSON file fallback
    const users = await getUsers();
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    const newUser = {
      id,
      name,
      email,
      password: hashedPassword,
      role: userRole,
      specialty: userRole === 'doctor' ? specialty : undefined,
      licenseNumber: userRole === 'doctor' ? licenseNumber : undefined,
      createdAt,
      healthRecords: [],
      appointments: [],
      patientDocuments: [],
      inventory: []
    };

    users.push(newUser);
    await saveUsers(users);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialty: newUser.specialty
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    // 1. PostgreSQL (Supabase) mode
    if (db.isPostgresActive()) {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role || 'patient' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'patient',
          specialty: user.specialty
        }
      });
    }

    // 2. Local JSON file fallback
    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role || 'patient' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'patient',
        specialty: user.specialty
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    // 1. PostgreSQL (Supabase) mode
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT id, name, email, role, specialty, created_at FROM users WHERE id = $1',
        [req.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'patient',
        specialty: user.specialty,
        createdAt: user.created_at
      });
    }

    // 2. Local JSON file fallback
    const users = await getUsers();
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'patient',
      specialty: user.specialty,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
