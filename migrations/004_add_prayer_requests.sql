-- Migration: Add prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  request_text TEXT NOT NULL,
  status TEXT CHECK(status IN ('pending', 'prayed', 'followed_up')) NOT NULL DEFAULT 'pending',
  notes TEXT, -- Pastor's internal follow-up notes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
