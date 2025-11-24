-- ============================================
-- FILE: create-admin.sql
-- DESKRIPSI: Script SQL untuk membuat akun admin
-- CARA PAKAI: Jalankan di phpMyAdmin atau MySQL client
-- ============================================

-- GANTI DATA DI BAWAH INI DENGAN DATA ADMIN KAMU
-- Password akan di-hash dengan bcrypt

-- Cara 1: Insert langsung (password harus sudah di-hash)
-- Untuk mendapatkan hash password, jalankan: npm run create-admin
-- Atau gunakan online bcrypt generator: https://bcrypt-generator.com/

-- Contoh (password: admin123)
-- Hash: $2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq
INSERT INTO users (name, email, password, role) 
VALUES (
    'Admin',                    -- Ganti dengan nama admin
    'admin@example.com',        -- Ganti dengan email admin
    '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',  -- Ganti dengan hash password
    'admin'
);

-- ============================================
-- CARA 2: Ubah user biasa menjadi admin
-- ============================================

-- Jika sudah ada user biasa, ubah role-nya menjadi admin
-- UPDATE users SET role = 'admin' WHERE email = 'email@example.com';

-- ============================================
-- CARA 3: Cek admin yang sudah ada
-- ============================================

-- SELECT id, name, email, role FROM users WHERE role = 'admin';


