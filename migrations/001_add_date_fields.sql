-- Migration: Add structured date fields to crusades table
-- Adds date_type and individual date fields while preserving date_range

ALTER TABLE crusades ADD COLUMN date_type TEXT DEFAULT 'legacy';
ALTER TABLE crusades ADD COLUMN start_date TEXT;
ALTER TABLE crusades ADD COLUMN end_date TEXT;
ALTER TABLE crusades ADD COLUMN custom_dates TEXT;

-- Update all existing crusades to mark them as legacy (existing data stays in date_range)
UPDATE crusades SET date_type = 'legacy' WHERE date_type = 'legacy' OR date_type IS NULL;
