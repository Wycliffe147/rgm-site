-- Migration: Add discussion tables
CREATE TABLE IF NOT EXISTS discussion_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT CHECK(category IN ('bible-study','prayer','testimony','general')) NOT NULL DEFAULT 'general',
  pinned INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discussion_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL REFERENCES discussion_topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discussion_reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL REFERENCES discussion_topics(id) ON DELETE CASCADE,
  emoji TEXT CHECK(emoji IN ('pray','heart','amen')) NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(topic_id, emoji, ip_hash)
);
