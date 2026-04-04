-- Auto-executed by MySQL Docker on first startup
-- Database 'indocor_2026' is already created by MYSQL_DATABASE env var

USE indocor_2026;

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

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_users (username, password, role) VALUES ('admin', 'adminambatukam', 'admin')
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO admin_users (username, password, role) VALUES ('superadmin', 'superadminambatukam', 'superadmin')
ON DUPLICATE KEY UPDATE role = 'superadmin';
