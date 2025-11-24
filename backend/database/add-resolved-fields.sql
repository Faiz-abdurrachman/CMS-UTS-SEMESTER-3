-- ============================================
-- FILE: add-resolved-fields.sql
-- DESKRIPSI: Script untuk menambahkan kolom resolved_at dan resolved_note ke tabel items
-- CARA PAKAI: Jalankan di phpMyAdmin
-- ============================================

-- Gunakan database
USE lostfound_db;

-- Tambahkan kolom resolved_at (timestamp kapan barang ditandai sebagai resolved)
ALTER TABLE items 
ADD COLUMN resolved_at TIMESTAMP NULL 
AFTER validation_status;

-- Tambahkan kolom resolved_note (keterangan dari admin saat mark as resolved)
ALTER TABLE items 
ADD COLUMN resolved_note TEXT NULL 
AFTER resolved_at;

-- Buat index untuk performa query
CREATE INDEX idx_resolved_at ON items(resolved_at);

-- Verifikasi: Cek struktur tabel
-- DESCRIBE items;

