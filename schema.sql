-- RGM site database schema (Cloudflare D1 / SQLite)

CREATE TABLE IF NOT EXISTS crusades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  date_range TEXT,
  status TEXT CHECK(status IN ('upcoming','past')) NOT NULL,
  poster_url TEXT,
  description TEXT,
  full_description TEXT,
  partner_churches TEXT,
  show_on_home INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS crusade_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crusade_id INTEGER NOT NULL REFERENCES crusades(id),
  type TEXT CHECK(type IN ('highlight')) NOT NULL DEFAULT 'highlight',
  youtube_url TEXT UNIQUE NOT NULL,
  title TEXT
);

CREATE TABLE IF NOT EXISTS sermons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  speaker TEXT,
  youtube_url TEXT UNIQUE NOT NULL,
  sermon_date TEXT,
  show_on_home INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  youtube_url TEXT UNIQUE NOT NULL,
  crusade_id INTEGER REFERENCES crusades(id),
  show_on_home INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS charity_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  beneficiary_name TEXT,
  location TEXT,
  description TEXT,
  full_description TEXT,
  photo_url TEXT,
  youtube_url TEXT,
  show_on_home INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS excellency_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  meta TEXT,
  youtube_url TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  quote TEXT,
  show_on_home INTEGER DEFAULT 0
);

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
  service_date TEXT,        -- Date of the service session the convert came forward at
  service_name TEXT,        -- e.g. "Morning Session", "Night Revival"
  ministering_name TEXT,    -- Preacher/minister who led that session
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

CREATE TABLE IF NOT EXISTS portal_sessions (
  token TEXT PRIMARY KEY,
  admin_id INTEGER REFERENCES portal_admins(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL, -- Epoch timestamp in seconds when session expires
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prayer_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  request_text TEXT NOT NULL,
  status TEXT CHECK(status IN ('pending', 'prayed', 'followed_up')) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  status TEXT CHECK(status IN ('subscribed', 'unsubscribed')) NOT NULL DEFAULT 'subscribed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS crossover_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  guests_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crossover_prayers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  prayer_request TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default super admin account
INSERT OR IGNORE INTO portal_admins (username, password_hash, full_name, role) 
VALUES ('admin', '4e9284833006ca56f5a6571b090786236a6364e2e9e9b23c243163a9bc261a74', 'Super Admin', 'super_admin');

-- Seed data, matches what was already on the site
INSERT OR IGNORE INTO crusades (slug, title, location, date_range, status, poster_url, description) VALUES
('vongo', 'Vongo, Rumphi Mega Salvation Crusade', 'Vongo Trading Center, Rumphi', 'Oct 9-11, 2026', 'upcoming', '/posters/vongo-crusade.jpg', 'Three days of gospel outreach with follow up led by local partner churches.'),
('edingeni', 'Edingeni Mega Salvation Crusade', 'Edingeni, Malawi', 'Jun 5-7, 2026', 'past', '/posters/edingeni-crusade.jpg', 'A gospel outreach in Edingeni, Malawi, followed up by local partner churches.');

INSERT OR IGNORE INTO crusade_media (crusade_id, type, youtube_url, title) VALUES
((SELECT id FROM crusades WHERE slug = 'edingeni'), 'highlight', 'https://youtu.be/UuoaPLBqqGI', 'Edingeni Mega Salvation Crusade, 2026');

INSERT OR IGNORE INTO sermons (title, speaker, youtube_url, sermon_date) VALUES
('The Art of Money Making', 'Pst Alick Nyirenda', 'https://youtu.be/DAuLUfX3FO0', NULL);

INSERT OR IGNORE INTO testimonies (title, youtube_url, crusade_id) VALUES
('Nthalire Crusade Testimonies 2022, Part 1', 'https://youtu.be/G4C4FpBzQdA', NULL);

INSERT OR IGNORE INTO excellency_stories (title, meta, youtube_url, description, quote, show_on_home) VALUES
('Selina Gondwe', 'Mother: Patricia Nkhoma · Area 6, Mzuzu', 'https://youtu.be/X81QGXA5or8', 'Patricia Nkhoma raised her four children, 2 daughters and 2 sons, largely alone in Area 6, Mzuzu, after her husband left the family and later moved to South Africa. She got by on small, struggling businesses, holding onto the hope RGM gave her that God would take care of her children.

Her daughter Selina, a student at Euthini Boarding Secondary School and now at Mzuzu University, faced her own battle: frequent illness that repeatedly disrupted her schooling. Selina credits RGM with bringing her healing and hope through those years.', NULL, 1),
('Yamikani Kauluka', 'Mother: Zerezi Kauluka · Sonda, Mzuzu', 'https://youtu.be/_hSLOUQLm2o', 'Zerezi Kauluka raised 3 children in Sonda, Mzuzu, and struggled to keep up with school fees for her first-born son, Yamikani. She says he could not have passed his exams at Luwinga Secondary School without the spiritual grounding RGM gave the family, the same character that impressed his teachers into supporting him.

Even so, the cost of it weighed on both of them. Barely able to afford Luwinga''s fees, Zerezi feared what university would cost, and Yamikani himself doubted whether he could keep going.

Yamikani is now headed to college.', '"Ndiphuzira ine?" ... "Mulungu ndi wazatheka bwanji. Limbikirabe uzafika pamene Mulungu Anakupangira kuti uzafike."', 1);

