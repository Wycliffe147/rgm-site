-- Migration: Add newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  status TEXT CHECK(status IN ('subscribed', 'unsubscribed')) NOT NULL DEFAULT 'subscribed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
