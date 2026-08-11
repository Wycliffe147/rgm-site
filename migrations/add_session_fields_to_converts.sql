-- Migration: Add session-specific fields to converts table
-- Allows filtering converts by the specific service session they came forward at
ALTER TABLE converts ADD COLUMN service_date TEXT;
ALTER TABLE converts ADD COLUMN service_name TEXT;
ALTER TABLE converts ADD COLUMN ministering_name TEXT;
