-- ============================================
-- INDOCOR ITS 2026 — Database Setup
-- Jalankan SQL ini di phpMyAdmin atau MySQL CLI
-- ============================================

CREATE DATABASE IF NOT EXISTS indocor_2026;
USE indocor_2026;

-- Tabel Articles (PDF-based)
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    date VARCHAR(50) NOT NULL,
    author VARCHAR(255) NOT NULL,
    image_cover VARCHAR(500),
    pdf_file VARCHAR(500) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    review_note TEXT DEFAULT NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Events (Section-based: 3 foto + 3 teks)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    date VARCHAR(100) NOT NULL,
    image_main VARCHAR(500) NOT NULL,
    section1_text TEXT,
    image_support1 VARCHAR(500),
    section2_text TEXT,
    image_support2 VARCHAR(500),
    section3_text TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    review_note TEXT DEFAULT NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Admin Users (with role support)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: adminambatukam)
INSERT INTO admin_users (username, password, role) VALUES ('admin', 'adminambatukam', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Insert default superadmin (password: superadminambatukam)
INSERT INTO admin_users (username, password, role) VALUES ('superadmin', 'superadminambatukam', 'superadmin')
ON DUPLICATE KEY UPDATE role = 'superadmin';

-- ============================================
-- MIGRATION: Jalankan ini jika database sudah ada
-- ============================================
-- ALTER TABLE articles ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
-- ALTER TABLE articles ADD COLUMN review_note TEXT DEFAULT NULL;
-- ALTER TABLE articles ADD COLUMN reviewed_at TIMESTAMP NULL;
-- ALTER TABLE events ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
-- ALTER TABLE events ADD COLUMN review_note TEXT DEFAULT NULL;
-- ALTER TABLE events ADD COLUMN reviewed_at TIMESTAMP NULL;
-- ALTER TABLE admin_users ADD COLUMN role ENUM('admin', 'superadmin') DEFAULT 'admin';
