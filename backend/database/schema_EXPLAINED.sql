-- ============================================
-- PENJELASAN FILE: schema.sql
-- ============================================
-- Fungsi: Script SQL untuk membuat database lostfound_db dan dua tabel (users, items).
--         Juga membuat index agar query cepat. Dijalankan sekali (manual atau saat init Docker).
-- Alur: 1) Buat database; 2) USE database; 3) Hapus tabel lama (items dulu karena ada FK ke users);
--       4) Buat tabel users; 5) Buat tabel items (dengan foreign key ke users); 6) Buat index.
-- Analogi: Seperti cetak biru gedung: definisi "ruang users" dan "ruang items", plus pintu (index) agar cari data cepat.
-- ============================================

-- ============================================
-- FILE: schema.sql
-- DESKRIPSI: Script SQL untuk membuat database dan tabel Lost & Found
-- TERMASUK: Update field resolved & validation status
-- ============================================

-- Buat database (jika belum ada)
CREATE DATABASE IF NOT EXISTS lostfound_db;

-- Gunakan database
USE lostfound_db;

-- ============================================
-- TABEL USERS
-- ============================================

-- Hapus tabel jika sudah ada (untuk reset). items dulu karena items.user_id mengacu ke users.id
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
    resolved_at TIMESTAMP NULL,                  -- Waktu barang status selesai (opsional)
    resolved_note TEXT NULL,                     -- Catatan penyelesaian (opsional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu pembuatan record (otomatis)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Waktu update terakhir (otomatis)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Foreign key ke tabel users
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INDEX (Untuk performa)
-- ============================================

-- Index pada email untuk mempercepat pencarian user
CREATE INDEX idx_users_email ON users(email);

-- Index pada items untuk filtering dan sorting
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_validation_status ON items(validation_status);
CREATE INDEX idx_items_created_at ON items(created_at);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_resolved_at ON items(resolved_at);

-- ============================================
-- CONTTOH DATA (Opsional)
-- ============================================

-- INSERT INTO users (name, email, password, role) VALUES 
-- ('Admin', 'admin@example.com', '$2b$10$rOzJq...', 'admin');

-- ============================================
-- RINGKASAN: 1) Buat DB, USE; 2) DROP items, users; 3) CREATE users; 4) CREATE items (FK user_id); 5) CREATE INDEX.
-- ISTILAH: PRIMARY KEY (identitas unik), AUTO_INCREMENT (angka naik otomatis), FOREIGN KEY (referensi ke tabel lain),
--          ON DELETE CASCADE (hapus user maka item miliknya ikut terhapus), INDEX (mempercepat pencarian).
-- KESALAHAN PEMULA: Menjalankan DROP tanpa backup; salah urutan DROP (harus items dulu); lupa jalankan schema sehingga tabel tidak ada.
-- ============================================
