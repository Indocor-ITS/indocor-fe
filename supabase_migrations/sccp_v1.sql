-- ==================================================================
-- SCCP 2026 Registration Module — Supabase SQL Migration V1
-- How to run:
--   1. Buka Supabase Dashboard → Project INDOCOR ITS
--   2. Sidebar: SQL Editor → New Query
--   3. Paste SELURUH isi file ini → Klik "Run" (▶️)
--   4. Setelah query sukses, lanjut setup Storage Buckets (lihat bawah)
-- ==================================================================

-- Enable pgcrypto (untuk uuid_generate_v4 jika belum)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing table jika ingin reset (uncomment jika perlu)
-- DROP TABLE IF EXISTS sccp_registrations CASCADE;

CREATE TABLE IF NOT EXISTS sccp_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Data Diri
  nama_lengkap TEXT NOT NULL,
  jenis_kelamin TEXT,
  nomor_wa TEXT NOT NULL,
  asal_instansi TEXT,
  status_peserta TEXT NOT NULL, -- "mahasiswa_tingkat_akhir" | "fresh_graduate"

  -- Bukti (file URL dari Supabase Storage)
  bukti_status_url TEXT NOT NULL,
  mou_url TEXT NOT NULL,

  -- Pembayaran
  opsi_pembayaran TEXT NOT NULL, -- "lunas" | "bertahap"
  bukti_t1_url TEXT NOT NULL,     -- Bukti bayar Termin 1 (Rp3jt / Rp2jt)
  bukti_t2_url TEXT,              -- Bukti bayar Termin 2 (Rp1jt, null jika opsi=lunas)

  -- Status Verifikasi Admin
  verif_t1 TEXT NOT NULL DEFAULT 'belum',   -- "belum" | "diverifikasi" | "ditolak"
  verif_t2 TEXT NOT NULL DEFAULT 'belum',   -- "belum" | "diverifikasi" | "ditolak" | "tidak_perlu"

  -- Catatan khusus (misal: nama tidak ketemu → create terpisah)
  catatan_admin TEXT
);

-- Index cepat untuk lookup pelunasan by nama (case-insensitive match)
CREATE INDEX IF NOT EXISTS idx_sccp_nama_lower ON sccp_registrations (LOWER(TRIM(nama_lengkap)));
CREATE INDEX IF NOT EXISTS idx_sccp_opsi_bayar ON sccp_registrations (opsi_pembayaran);
CREATE INDEX IF NOT EXISTS idx_sccp_verif_t1 ON sccp_registrations (verif_t1);
CREATE INDEX IF NOT EXISTS idx_sccp_verif_t2 ON sccp_registrations (verif_t2);

-- Optional: RLS — Disable saja karena kita pakai SERVICE_ROLE_KEY
ALTER TABLE sccp_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role all access" ON sccp_registrations;
CREATE POLICY "Allow service role all access" ON sccp_registrations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==================================================================
-- ⚠️ SETUP STORAGE BUCKETS MANUAL (TIDAK BISA LEWAT SQL, LEWAT DASHBOARD):
-- ==================================================================
--
-- 1. Buka sidebar Supabase → "Storage"
-- 2. Klik tombol "+ New bucket" di pojok kanan atas
-- 3. Buat BUCKET PERTAMA:
--      - Name: sccp-pdf
--      - Public bucket: ✅ CENTANG (ON)
--      - File size limit: kosongkan / 10MB
--      - Allowed MIME types: application/pdf
--    → Klik "Create bucket"
--
-- 4. Buat BUCKET KEDUA:
--      - Name: sccp-img
--      - Public bucket: ✅ CENTANG (ON)
--      - File size limit: kosongkan / 10MB
--      - Allowed MIME types: image/png, image/jpeg
--    → Klik "Create bucket"
--
-- 5. Selesai! Test dengan upload gambar/pdf ke masing-masing bucket,
--    pastikan URL public bisa diakses langsung di browser Incognito.
--
-- ==================================================================
-- (Opsional) Dummy data buat test dashboard:
-- INSERT INTO sccp_registrations (nama_lengkap, jenis_kelamin, nomor_wa, asal_instansi, status_peserta, bukti_status_url, mou_url, opsi_pembayaran, bukti_t1_url, bukti_t2_url, verif_t1, verif_t2) VALUES
-- ('Budi Santoso', 'Laki-laki', '081234567890', 'ITS', 'mahasiswa_tingkat_akhir', 'https://example.com/bukti1.pdf', 'https://example.com/mou1.pdf', 'lunas', 'https://example.com/t1a.jpg', NULL, 'diverifikasi', 'tidak_perlu'),
-- ('Siti Aminah', 'Perempuan', '082345678901', 'UI', 'fresh_graduate', 'https://example.com/bukti2.pdf', 'https://example.com/mou2.pdf', 'bertahap', 'https://example.com/t1b.jpg', 'https://example.com/t2b.jpg', 'diverifikasi', 'belum'),
-- ('Andi Pratama', 'Laki-laki', '083456789012', 'UGM', 'mahasiswa_tingkat_akhir', 'https://example.com/bukti3.pdf', 'https://example.com/mou3.pdf', 'bertahap', 'https://example.com/t1c.jpg', NULL, 'belum', 'belum');
