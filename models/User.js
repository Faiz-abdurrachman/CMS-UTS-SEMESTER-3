// ============================================
// FILE: models/User.js
// DESKRIPSI: Model untuk operasi database terkait User
// ============================================

const pool = require("../config/db");

// ============================================
// USER MODEL FUNCTIONS
// ============================================

const User = {
  // Cari user berdasarkan email
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  },

  // Cari user berdasarkan ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Cek apakah email sudah terdaftar
  emailExists: async (email) => {
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    return rows.length > 0;
  },

  // Buat user baru
  create: async (name, email, hashedPassword, role = "user") => {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },

  // Ambil semua users (untuk admin)
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  },

  // Hapus user (untuk admin)
  delete: async (id) => {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
  },
};

// ============================================
// EXPORT
// ============================================

module.exports = User;
