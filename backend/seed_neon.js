require('dotenv').config({ path: 'backend/.env' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to Neon PostgreSQL for seeding...');

    // Fetch primary patient and doctor
    const usersRes = await client.query("SELECT id, email, role FROM users ORDER BY created_at ASC");
    const users = usersRes.rows;
    const patientUser = users.find(u => u.role === 'patient') || users[0];
    const doctorUser = users.find(u => u.role === 'doctor') || users[0];

    const patientId = patientUser.id;
    const doctorId = doctorUser.id;

    console.log(`Using patientId: ${patientId} (${patientUser.email}) and doctorId: ${doctorId} (${doctorUser.email})`);

    // 1. Health Records
    await client.query(`
      INSERT INTO health_records (id, user_id, type, title, date, doctor, description, notes)
      VALUES 
        ('rec_1', $1, 'visit', 'Annual Comprehensive Physical Exam', '2025-01-15', 'Dr. Anand Shinde', 'Routine wellness examination, blood pressure normal, cardiovascular healthy.', 'Schedule follow-up in 12 months'),
        ('rec_2', $1, 'lab', 'Comprehensive Metabolic Panel (CMP)', '2025-01-10', 'Apex Pathology Lab', 'Fasting glucose: 94 mg/dL, HbA1c: 5.4%, Lipid panel within optimal range.', 'All metabolic markers normal'),
        ('rec_3', $1, 'prescription', 'Cardiovascular Prophylaxis', '2024-12-20', 'Dr. Priya Sharma', 'Prescribed low-dose preventive therapy with lifestyle guidance.', 'Take after breakfast')
      ON CONFLICT (id) DO NOTHING;
    `, [patientId]);

    // 2. Medications
    await client.query(`
      INSERT INTO medications (id, user_id, doctor_id, name, generic_name, dosage, frequency, next_dose, start_date, instructions, status)
      VALUES
        ('med_1', $1, $2, 'Amoxicillin', 'Amoxicillin Trihydrate', '500mg', 'Three times daily', '02:00 PM', '2025-01-15', 'Take with full glass of water with meals', 'active'),
        ('med_2', $1, $2, 'Lisinopril', 'Lisinopril', '10mg', 'Once daily', '08:00 AM Tomorrow', '2024-11-01', 'Take every morning before breakfast', 'active'),
        ('med_3', $1, $2, 'Atorvastatin', 'Atorvastatin Calcium', '20mg', 'Once daily at bedtime', '10:00 PM', '2024-10-15', 'Take before sleeping', 'active'),
        ('med_4', $1, $2, 'Metformin', 'Metformin HCl', '500mg', 'Twice daily', '08:00 PM', '2024-09-01', 'Take with dinner', 'active')
      ON CONFLICT (id) DO NOTHING;
    `, [patientId, doctorId]);

    // 3. Vitals
    await client.query(`
      INSERT INTO vitals (id, user_id, date, systolic_bp, diastolic_bp, heart_rate, weight, temperature, blood_sugar, notes)
      VALUES
        ('vit_1', $1, '2025-01-15', 120, 80, 72, 70.5, 98.6, 95.0, 'Morning resting vitals, normal range'),
        ('vit_2', $1, '2025-01-14', 122, 82, 75, 70.6, 98.4, 98.0, 'Post-breakfast check'),
        ('vit_3', $1, '2025-01-13', 118, 78, 68, 70.4, 98.6, 92.0, 'Evening resting vitals'),
        ('vit_4', $1, '2025-01-12', 124, 84, 76, 70.8, 98.7, 101.0, 'Post-exercise recording')
      ON CONFLICT (id) DO NOTHING;
    `, [patientId]);

    // 4. Patients (Doctor directory)
    await client.query(`
      INSERT INTO patients (id, doctor_id, name, email, phone, age, gender, blood_group, last_visit, status, notes)
      VALUES
        ('pat_1', $1, 'John Doe', 'john@example.com', '+1-555-0101', 34, 'Male', 'O+', '2025-01-15', 'active', 'Regular hypertension monitoring, excellent compliance'),
        ('pat_2', $1, 'Jane Smith', 'jane@example.com', '+1-555-0102', 29, 'Female', 'A+', '2025-01-10', 'active', 'Annual checkup completed, scheduled routine blood panel'),
        ('pat_3', $1, 'Bob Johnson', 'bob@example.com', '+1-555-0103', 45, 'Male', 'B+', '2025-01-05', 'active', 'Type 2 Diabetes follow-up, dietary adjustments made')
      ON CONFLICT (id) DO NOTHING;
    `, [doctorId]);

    // 5. Medicine Inventory
    await client.query(`
      INSERT INTO medicine_inventory (id, name, generic_name, quantity, unit, expiry_date, category, supplier, price)
      VALUES
        ('inv_1', 'Paracetamol 500mg', 'Acetaminophen', 250, 'tablets', '2026-12-31', 'Analgesics', 'Cipla Health', 15.50),
        ('inv_2', 'Amoxicillin 500mg', 'Amoxicillin Trihydrate', 180, 'capsules', '2026-08-31', 'Antibiotics', 'Sun Pharma', 45.00),
        ('inv_3', 'Metformin 500mg', 'Metformin HCl', 300, 'tablets', '2027-01-31', 'Antidiabetic', 'Dr. Reddy Labs', 28.00),
        ('inv_4', 'Atorvastatin 20mg', 'Atorvastatin', 120, 'tablets', '2026-10-31', 'Cardiovascular', 'Lupin Pharma', 65.00),
        ('inv_5', 'Cetirizine 10mg', 'Cetirizine Dihydrochloride', 400, 'tablets', '2027-03-31', 'Antihistamine', 'Torrent Pharma', 12.00)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 6. Patient Documents
    await client.query(`
      INSERT INTO patient_documents (id, user_id, doctor_id, title, document_type, file_url, notes)
      VALUES
        ('doc_1', $1, $2, 'Blood Test CMP Report - Jan 2025', 'lab', 'https://doctorai-nava.onrender.com/docs/cmp-jan2025.pdf', 'Normal electrolyte and metabolic balance'),
        ('doc_2', $1, $2, 'Chest X-Ray Digital Imaging', 'imaging', 'https://doctorai-nava.onrender.com/docs/chest-xray.pdf', 'Clear lung fields, cardiac silhouette normal'),
        ('doc_3', $1, $2, 'Clinical Discharge Summary', 'discharge', 'https://doctorai-nava.onrender.com/docs/discharge-summary.pdf', 'Completed routine outpatient observation')
      ON CONFLICT (id) DO NOTHING;
    `, [patientId, doctorId]);

    // 7. Reminders
    await client.query(`
      INSERT INTO reminders (id, user_id, title, type, date, time, status)
      VALUES
        ('rem_1', $1, 'Take Amoxicillin 500mg', 'medication', '2025-01-16', '02:00 PM', 'pending'),
        ('rem_2', $1, 'Log Evening Blood Pressure', 'vitals', '2025-01-16', '07:00 PM', 'pending'),
        ('rem_3', $1, 'Dr. Anand Shinde Follow-up', 'appointment', '2025-01-20', '10:30 AM', 'pending')
      ON CONFLICT (id) DO NOTHING;
    `, [patientId]);

    // 8. Health Logs
    await client.query(`
      INSERT INTO health_logs (id, user_id, date, symptoms, mood, sleep_hours, notes)
      VALUES
        ('log_1', $1, '2025-01-15', 'Mild afternoon fatigue', 'Energetic', 7.5, 'Felt great during morning walk, slight tiredness after lunch'),
        ('log_2', $1, '2025-01-14', 'None', 'Good', 8.0, 'Well-rested, no physical discomfort noted'),
        ('log_3', $1, '2025-01-13', 'Slight tension headache', 'Calm', 6.8, 'Resolved with hydration and rest')
      ON CONFLICT (id) DO NOTHING;
    `, [patientId]);

    // 9. Consult Copilot Clinical Notes
    await client.query(`
      INSERT INTO consult_copilot_notes (id, doctor_id, patient_id, patient_name, visit_date, chief_complaint, subjective, objective, assessment, plan)
      VALUES
        ('copilot_1', $1, 'pat_1', 'John Doe', '2025-01-15', 'Routine hypertension follow-up', 'Patient reports feeling energetic with no shortness of breath.', 'BP 120/80 mmHg, HR 72 bpm regular.', 'Stage 1 Hypertension well-controlled on current monotherapy.', 'Continue Lisinopril 10mg daily. Recheck vitals in 3 months.')
      ON CONFLICT (id) DO NOTHING;
    `, [doctorId]);

    console.log('Seeding completed successfully!');

    // Show updated row counts
    const tables = [
      'users', 'appointments', 'health_records', 'medications', 'vitals',
      'patients', 'medicine_inventory', 'patient_documents', 'reminders',
      'health_logs', 'consult_copilot_notes'
    ];

    console.log('\n--- Updated Neon PostgreSQL Row Counts ---');
    for (const t of tables) {
      const res = await client.query(`SELECT count(*) FROM "${t}";`);
      console.log(`${t}: ${res.rows[0].count} rows`);
    }

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.end();
  }
}

seed();
