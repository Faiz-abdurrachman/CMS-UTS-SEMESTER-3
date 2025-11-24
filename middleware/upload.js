// ============================================
// FILE: middleware/upload.js
// DESKRIPSI: Middleware untuk handle upload file menggunakan Multer
// ============================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// ============================================
// KONFIGURASI UPLOAD DIRECTORY
// ============================================

// Direktori untuk menyimpan file upload
// Default: 'uploads' di root backend
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// Buat folder uploads jika belum ada
// recursive: true membuat parent folder jika belum ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ============================================
// KONFIGURASI MULTER STORAGE
// ============================================

// diskStorage: menyimpan file ke local filesystem
const storage = multer.diskStorage({
  // destination: menentukan folder penyimpanan
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Simpan di folder uploads/
  },
  // filename: menentukan nama file yang disimpan
  filename: (req, file, cb) => {
    // Ambil extension dari file original
    const ext = path.extname(file.originalname);
    // Buat nama file unik: timestamp + random number + extension
    // Contoh: 1234567890-987654321.jpg
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

// ============================================
// KONFIGURASI MULTER
// ============================================

// limits: batasan ukuran file (5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB dalam bytes
});

// ============================================
// EXPORT
// ============================================

// Export upload middleware
// Penggunaan: upload.single('image') untuk single file upload
module.exports = upload;
