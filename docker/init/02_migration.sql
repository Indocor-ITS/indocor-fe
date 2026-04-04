-- Migration: Superadmin features
-- Runs after 01_schema.sql — safe to re-run (uses IF NOT EXISTS)

USE indocor_2026;

ALTER TABLE articles
    ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS review_note TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL;

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS review_note TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL;

ALTER TABLE admin_users
    ADD COLUMN IF NOT EXISTS role ENUM('admin', 'superadmin') DEFAULT 'admin';

INSERT INTO admin_users (username, password, role) VALUES ('superadmin', 'ambatukan', 'superadmin')
ON DUPLICATE KEY UPDATE role = 'superadmin', password = 'ambatukan';

UPDATE articles SET status = 'approved' WHERE status IS NULL OR status = '';
UPDATE events SET status = 'approved' WHERE status IS NULL OR status = '';
