-- Migration: Allow 'financial' as a partnership_type on partner_registrations.
-- SQLite can't ALTER a CHECK constraint in place, so we rebuild the table.

CREATE TABLE partner_registrations_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  partnership_type TEXT CHECK(partnership_type IN ('prayer', 'volunteer', 'church', 'financial')) NOT NULL,
  message TEXT,
  status TEXT CHECK(status IN ('new', 'contacted', 'active')) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO partner_registrations_new (id, name, email, phone, partnership_type, message, status, created_at)
SELECT id, name, email, phone, partnership_type, message, status, created_at FROM partner_registrations;

DROP TABLE partner_registrations;
ALTER TABLE partner_registrations_new RENAME TO partner_registrations;
