-- DoctorAI Supabase / PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor if you prefer manual table creation,
-- or let DoctorAI backend automatically create it on startup when DATABASE_URL is set.

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient',
    specialty VARCHAR(255),
    license_number VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data JSONB DEFAULT '{}'
);

-- Index on email for fast authentication lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id VARCHAR(64),
    doctor_name VARCHAR(255),
    specialty VARCHAR(255),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on user_id for fast appointment queries
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
