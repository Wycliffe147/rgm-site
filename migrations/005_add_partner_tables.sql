-- Migration: Add partner_registrations and partner_testimonies tables
CREATE TABLE IF NOT EXISTS partner_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  partnership_type TEXT CHECK(partnership_type IN ('prayer', 'volunteer', 'church')) NOT NULL,
  message TEXT,
  status TEXT CHECK(status IN ('new', 'contacted', 'active')) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_testimonies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT,
  role TEXT,
  testimony TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
