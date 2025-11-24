// ============================================
// FILE: middleware/authMiddleware.js
// DESKRIPSI: Middleware untuk autentikasi JWT token (untuk user biasa)
// ============================================

const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

// ============================================
// FUNGSI AUTHENTICATE
// ============================================

// Middleware untuk memverifikasi JWT token
// Memastikan endpoint dilindungi dan req.user tersedia
const authenticate = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    // Format: "Bearer <token>"
    const header = req.headers.authorization;

    // Jika tidak ada header, return error
    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Split header untuk ambil token (setelah "Bearer ")
    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token menggunakan JWT_SECRET
    // Jika token invalid/expired, akan throw error
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Load data user dari database berdasarkan ID di token
    // Hanya ambil field yang diperlukan (id, name, email, role)
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [payload.id]
    );

    // Jika user tidak ditemukan, return error
    if (!rows.length) {
      return res.status(401).json({ message: "User not found" });
    }

    // Simpan user data ke req.user
    // Sekarang semua route setelah middleware ini bisa akses req.user
    req.user = rows[0];

    // Lanjutkan ke route handler berikutnya
    next();
  } catch (err) {
    // Jika token invalid/expired, return error
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ============================================
// EXPORT
// ============================================

module.exports = { authenticate };
