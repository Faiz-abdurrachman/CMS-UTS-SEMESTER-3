-- ============================================
-- FILE: add-validation-status.sql
-- DESKRIPSI: Script untuk menambahkan kolom validation_status ke tabel items
-- CARA PAKAI: Jalankan di phpMyAdmin
-- ============================================

-- Gunakan database
USE lostfound_db;

-- Tambahkan kolom validation_status
-- Jika kolom sudah ada, akan muncul error, tapi tidak masalah (skip saja)
ALTER TABLE items 
ADD COLUMN validation_status VARCHAR(20) DEFAULT 'pending' 
AFTER status;

-- Update semua data yang sudah ada menjadi 'pending'
UPDATE items 
SET validation_status = 'pending' 
WHERE validation_status IS NULL;

-- Buat index untuk performa
-- Jika index sudah ada, akan muncul error, tapi tidak masalah (skip saja)
CREATE INDEX idx_validation_status ON items(validation_status);

-- Verifikasi: Cek struktur tabel
-- DESCRIBE items;

