-- Migration: Add portal_sessions table for database-backed authentication
CREATE TABLE IF NOT EXISTS portal_sessions (
  token TEXT PRIMARY KEY,
  admin_id INTEGER REFERENCES portal_admins(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL, -- Epoch timestamp in seconds when session expires
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
