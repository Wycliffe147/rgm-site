-- Migration: Add converts, portal_admins, and attendance_register tables
-- Creates multi-user portal database schema with seed data

CREATE TABLE IF NOT EXISTS portal_admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- SHA-256 hashed password
  full_name TEXT NOT NULL,
  role TEXT CHECK(role IN ('super_admin', 'caller', 'recorder')) NOT NULL DEFAULT 'caller',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS converts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crusade_id INTEGER REFERENCES crusades(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  church TEXT,
  follow_up_status TEXT CHECK(follow_up_status IN ('pending', 'contacted', 'no_answer', 'needs_visit')) NOT NULL DEFAULT 'pending',
  follow_up_notes TEXT,
  last_contact_date TEXT,
  updated_by INTEGER REFERENCES portal_admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_register (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crusade_id INTEGER REFERENCES crusades(id) ON DELETE SET NULL,
  service_date TEXT NOT NULL,
  service_name TEXT NOT NULL,
  ministering_name TEXT NOT NULL,
  attendance_count INTEGER NOT NULL,
  authorized_by INTEGER REFERENCES portal_admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default super admin account
-- Username: admin
-- Password: rgm2026 (SHA-256 hash: 4e9284833006ca56f5a6571b090786236a6364e2e9e9b23c243163a9bc261a74)
INSERT OR IGNORE INTO portal_admins (username, password_hash, full_name, role) 
VALUES ('admin', '4e9284833006ca56f5a6571b090786236a6364e2e9e9b23c243163a9bc261a74', 'Super Admin', 'super_admin');
