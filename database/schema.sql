-- ============================================
-- FILE: schema.sql
-- DESKRIPSI: Script SQL untuk membuat database dan tabel Lost & Found
-- ============================================

-- Buat database (jika belum ada)
CREATE DATABASE IF NOT EXISTS lostfound_db;

-- Gunakan database
USE lostfound_db;

-- ============================================
-- TABEL USERS
-- ============================================

-- Hapus tabel jika sudah ada (untuk reset)
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

-- Buat tabel users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- ID unik, auto increment
    name VARCHAR(100) NOT NULL,                   -- Nama user
    email VARCHAR(100) NOT NULL UNIQUE,          -- Email, harus unik dan tidak boleh kosong
    password VARCHAR(255) NOT NULL,              -- Password yang sudah di-hash (bcrypt)
    role VARCHAR(20) DEFAULT 'user',             -- Role: 'user' atau 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan record (otomatis)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Waktu update terakhir (otomatis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABEL ITEMS (Lost & Found)
-- ============================================

-- Buat tabel items untuk menyimpan data barang hilang/ditemukan
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- ID unik, auto increment
    user_id INT NOT NULL,                        -- ID user yang membuat item (foreign key)
    name VARCHAR(200) NOT NULL,                  -- Nama barang
    description TEXT,                            -- Deskripsi barang
    location VARCHAR(200),                       -- Lokasi kehilangan/penemuan
    date_occured DATE,                           -- Tanggal kehilangan/penemuan
    image VARCHAR(255),                          -- Nama file gambar (disimpan di uploads/)
    status VARCHAR(20) DEFAULT 'lost',           -- Status: 'lost' atau 'found'
    validation_status VARCHAR(20) DEFAULT 'pending', -- Status validasi: 'pending', 'approved', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan record (otomatis)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Waktu update terakhir (otomatis)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Foreign key ke tabel users
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INDEX (Opsional, untuk performa)
-- ============================================

-- Index pada email untuk mempercepat pencarian
CREATE INDEX idx_email ON users(email);

-- Index pada status dan created_at untuk filtering dan sorting
CREATE INDEX idx_status ON items(status);
CREATE INDEX idx_validation_status ON items(validation_status);
CREATE INDEX idx_created_at ON items(created_at);
CREATE INDEX idx_user_id ON items(user_id);

-- ============================================
-- DATA ADMIN DEFAULT (Opsional)
-- ============================================

-- Password: "admin123" (sudah di-hash dengan bcrypt)
-- Jangan gunakan di production! Ganti password setelah pertama kali login
-- INSERT INTO users (name, email, password, role) VALUES 
-- ('Admin', 'admin@lostfound.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin');
