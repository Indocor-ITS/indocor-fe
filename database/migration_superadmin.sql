-- ============================================
-- MIGRATION: Tambah fitur Super Admin
-- Jalankan SQL ini di phpMyAdmin
-- ============================================

USE indocor_2026;

-- Tambah kolom status & review ke tabel articles
ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS review_note TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL;

-- Tambah kolom status & review ke tabel events 
ALTER TABLE events 
    ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS review_note TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL;

-- Tambah kolom role ke admin_users
ALTER TABLE admin_users
    ADD COLUMN IF NOT EXISTS role ENUM('admin', 'superadmin') DEFAULT 'admin';

-- Insert superadmin user (password: ambatukan)
INSERT INTO admin_users (username, password, role) VALUES ('superadmin', 'ambatukan', 'superadmin')
ON DUPLICATE KEY UPDATE role = 'superadmin', password = 'ambatukan';

-- Set semua konten existing ke approved agar tetap tampil
UPDATE articles SET status = 'approved' WHERE status IS NULL OR status = '';
UPDATE events SET status = 'approved' WHERE status IS NULL OR status = '';
