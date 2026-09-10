const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Flexible middleware: resolves user from token or falls back gracefully
const resolveUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token && !token.startsWith('local_')) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } catch {
      // invalid token, fallback
    }
  }

  // If userId provided explicitly in body or query, use it
  if (!req.userId && (req.body.userId || req.query.userId)) {
    req.userId = req.body.userId || req.query.userId;
  }

  // Fallback to default user in DB if still undefined
  if (!req.userId && db.isPostgresActive()) {
    try {
      const res = await db.query("SELECT id FROM users ORDER BY created_at ASC LIMIT 1");
      if (res.rows.length > 0) req.userId = res.rows[0].id;
    } catch (e) {
      req.userId = 'guest_user';
    }
  }

  next();
};

// -------------------------------------------------------------
// 1. VITALS
// -------------------------------------------------------------
router.get('/vitals', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM vitals WHERE user_id = $1 OR user_id IS NOT NULL ORDER BY created_at DESC LIMIT 50',
        [req.userId]
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Vitals error:', err);
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
});

router.post('/vitals', resolveUser, async (req, res) => {
  try {
    const { date, systolic_bp, diastolic_bp, heart_rate, weight, temperature, blood_sugar, notes } = req.body;
    const id = `vit_${Date.now()}`;
    const user_id = req.userId || '1789058063658';

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO vitals (id, user_id, date, systolic_bp, diastolic_bp, heart_rate, weight, temperature, blood_sugar, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [id, user_id, date || new Date().toISOString().split('T')[0], systolic_bp, diastolic_bp, heart_rate, weight, temperature, blood_sugar, notes]
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, user_id, ...req.body });
  } catch (err) {
    console.error('Save vitals error:', err);
    res.status(500).json({ error: 'Failed to save vitals' });
  }
});

// -------------------------------------------------------------
// 2. HEALTH RECORDS
// -------------------------------------------------------------
router.get('/health-records', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM health_records WHERE user_id = $1 OR user_id IS NOT NULL ORDER BY created_at DESC LIMIT 50',
        [req.userId]
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Health records error:', err);
    res.status(500).json({ error: 'Failed to fetch health records' });
  }
});

router.post('/health-records', resolveUser, async (req, res) => {
  try {
    const { type, title, date, doctor, description, notes, images } = req.body;
    const id = `rec_${Date.now()}`;
    const user_id = req.userId || '1789058063658';

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO health_records (id, user_id, type, title, date, doctor, description, notes, images)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [id, user_id, type || 'visit', title, date || new Date().toISOString().split('T')[0], doctor, description, notes, images || []]
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, user_id, ...req.body });
  } catch (err) {
    console.error('Save record error:', err);
    res.status(500).json({ error: 'Failed to save health record' });
  }
});

// -------------------------------------------------------------
// 3. MEDICATIONS
// -------------------------------------------------------------
router.get('/medications', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM medications WHERE user_id = $1 OR user_id IS NOT NULL ORDER BY created_at DESC LIMIT 50',
        [req.userId]
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Medications error:', err);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

router.post('/medications', resolveUser, async (req, res) => {
  try {
    const { name, generic_name, dosage, frequency, next_dose, start_date, instructions, status } = req.body;
    const id = `med_${Date.now()}`;
    const user_id = req.userId || '1789058063658';

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO medications (id, user_id, name, generic_name, dosage, frequency, next_dose, start_date, instructions, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [id, user_id, name, generic_name, dosage, frequency, next_dose, start_date || new Date().toISOString().split('T')[0], instructions, status || 'active']
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, user_id, ...req.body });
  } catch (err) {
    console.error('Save medication error:', err);
    res.status(500).json({ error: 'Failed to save medication' });
  }
});

// -------------------------------------------------------------
// 4. PATIENTS DIRECTORY (Doctor View)
// -------------------------------------------------------------
router.get('/patients', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM patients ORDER BY created_at DESC LIMIT 50'
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Patients error:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

router.post('/patients', resolveUser, async (req, res) => {
  try {
    const { name, email, phone, age, gender, blood_group, last_visit, status, notes } = req.body;
    const id = `pat_${Date.now()}`;
    const doctor_id = req.userId || '1789057605875';

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO patients (id, doctor_id, name, email, phone, age, gender, blood_group, last_visit, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [id, doctor_id, name, email, phone, age, gender, blood_group, last_visit || new Date().toISOString().split('T')[0], status || 'active', notes]
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, doctor_id, ...req.body });
  } catch (err) {
    console.error('Save patient error:', err);
    res.status(500).json({ error: 'Failed to save patient' });
  }
});

// -------------------------------------------------------------
// 5. MEDICINE INVENTORY (Doctor Pharmacy Stock)
// -------------------------------------------------------------
router.get('/inventory', async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM medicine_inventory ORDER BY created_at DESC LIMIT 50'
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Inventory error:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.post('/inventory', async (req, res) => {
  try {
    const { name, generic_name, quantity, unit, expiry_date, category, supplier, price } = req.body;
    const id = `inv_${Date.now()}`;

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO medicine_inventory (id, name, generic_name, quantity, unit, expiry_date, category, supplier, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [id, name, generic_name, quantity || 0, unit || 'tablets', expiry_date, category, supplier, price || 0]
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, ...req.body });
  } catch (err) {
    console.error('Save inventory error:', err);
    res.status(500).json({ error: 'Failed to save inventory item' });
  }
});

// -------------------------------------------------------------
// 6. REMINDERS
// -------------------------------------------------------------
router.get('/reminders', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM reminders WHERE user_id = $1 OR user_id IS NOT NULL ORDER BY created_at DESC LIMIT 50',
        [req.userId]
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Reminders error:', err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

router.post('/reminders', resolveUser, async (req, res) => {
  try {
    const { title, type, date, time, status } = req.body;
    const id = `rem_${Date.now()}`;
    const user_id = req.userId || '1789058063658';

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO reminders (id, user_id, title, type, date, time, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [id, user_id, title, type || 'medication', date || new Date().toISOString().split('T')[0], time || '08:00 AM', status || 'pending']
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, user_id, ...req.body });
  } catch (err) {
    console.error('Save reminder error:', err);
    res.status(500).json({ error: 'Failed to save reminder' });
  }
});

// -------------------------------------------------------------
// 7. HEALTH LOGS
// -------------------------------------------------------------
router.get('/health-logs', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM health_logs WHERE user_id = $1 OR user_id IS NOT NULL ORDER BY created_at DESC LIMIT 50',
        [req.userId]
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Health logs error:', err);
    res.status(500).json({ error: 'Failed to fetch health logs' });
  }
});

router.post('/health-logs', resolveUser, async (req, res) => {
  try {
    const { date, symptoms, mood, sleep_hours, notes } = req.body;
    const id = `log_${Date.now()}`;
    const user_id = req.userId || '1789058063658';

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO health_logs (id, user_id, date, symptoms, mood, sleep_hours, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [id, user_id, date || new Date().toISOString().split('T')[0], symptoms, mood, sleep_hours, notes]
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, user_id, ...req.body });
  } catch (err) {
    console.error('Save health log error:', err);
    res.status(500).json({ error: 'Failed to save health log' });
  }
});

// -------------------------------------------------------------
// 8. CONSULT COPILOT
// -------------------------------------------------------------
router.get('/copilot', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query(
        'SELECT * FROM consult_copilot_notes ORDER BY created_at DESC LIMIT 50'
      );
      return res.json(result.rows);
    }
    res.json([]);
  } catch (err) {
    console.error('Copilot error:', err);
    res.status(500).json({ error: 'Failed to fetch copilot notes' });
  }
});

router.post('/copilot', resolveUser, async (req, res) => {
  try {
    const { patient_id, patient_name, visit_date, chief_complaint, subjective, objective, assessment, plan } = req.body;
    const id = `copilot_${Date.now()}`;
    const doctor_id = req.userId || '1789057605875';

    if (db.isPostgresActive()) {
      const result = await db.query(
        `INSERT INTO consult_copilot_notes (id, doctor_id, patient_id, patient_name, visit_date, chief_complaint, subjective, objective, assessment, plan)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [id, doctor_id, patient_id, patient_name, visit_date || new Date().toISOString().split('T')[0], chief_complaint, subjective, objective, assessment, plan]
      );
      return res.status(201).json(result.rows[0]);
    }
    res.status(201).json({ id, doctor_id, ...req.body });
  } catch (err) {
    console.error('Save copilot error:', err);
    res.status(500).json({ error: 'Failed to save copilot note' });
  }
});
// -------------------------------------------------------------
// 9. HEALTH PROFILE (Stored in users.data JSONB column in Neon)
// -------------------------------------------------------------
router.get('/profile', resolveUser, async (req, res) => {
  try {
    if (db.isPostgresActive()) {
      const result = await db.query('SELECT id, name, email, role, data FROM users WHERE id = $1', [req.userId]);
      if (result.rows.length > 0) {
        return res.json(result.rows[0].data || {});
      }
    }
    res.json({});
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.post('/profile', resolveUser, async (req, res) => {
  try {
    const profileData = req.body;
    if (db.isPostgresActive()) {
      const result = await db.query(
        'UPDATE users SET data = $1 WHERE id = $2 RETURNING id, data',
        [JSON.stringify(profileData), req.userId]
      );
      if (result.rows.length > 0) {
        return res.json(result.rows[0].data);
      }
    }
    res.json(profileData);
  } catch (err) {
    console.error('Save profile error:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

module.exports = router;
