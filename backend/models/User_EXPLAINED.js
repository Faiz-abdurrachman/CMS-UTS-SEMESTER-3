/*
📌 FILE: models/User.js

🧠 Fungsi file ini:
File ini adalah satu-satunya tempat yang "bicara" ke tabel users di database. Berisi
object User dengan fungsi: findByEmail, findById, emailExists, create, findAll, delete.
Semua pakai pool.query() dengan placeholder ? agar aman dari SQL injection. Controller
tidak jalankan SQL langsung; mereka memanggil User.findByEmail(), User.create(), dll.

🔄 Alur singkat:
1. require pool dari config/db.
2. Definisikan object User dengan method async (masing-masing pool.query + return).
3. module.exports = User.

📦 Analogi dunia nyata:
Seperti sekretaris yang mengurus satu filing cabinet (tabel users): cari kartu by email,
cari by id, cek email sudah ada, tambah kartu baru, daftar semua kartu, hapus kartu. Controller
hanya bilang "cari yang email-nya X" atau "tambah user baru"; model yang buka laci dan tulis.
*/

// ============================================
// FILE: models/User.js
// DESKRIPSI: Model untuk operasi database terkait User
// ============================================

const pool = require("../config/db");

// ============================================
// USER MODEL FUNCTIONS
// ============================================

// User = object berisi fungsi-fungsi; setiap fungsi async karena pool.query mengembalikan Promise
const User = {
  // Cari user berdasarkan email; return satu object atau null
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null; // rows[0] = baris pertama; kalau tidak ada rows[0] undefined → null
  },

  // Cari user by id; tidak ambil password (untuk keamanan saat tampil ke client)
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Cek apakah email sudah dipakai (untuk validasi register)
  emailExists: async (email) => {
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    return rows.length > 0; // true kalau ada minimal satu baris
  },

  // Insert user baru; role default "user"; return insertId (id yang baru dibuat)
  create: async (name, email, hashedPassword, role = "user") => {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    return result.insertId; // ID auto-increment dari baris yang baru di-insert
  },

  // Semua user (untuk admin); tidak include password
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  },

  // Hapus user by id (untuk admin); ON DELETE CASCADE di schema akan hapus items milik user
  delete: async (id) => {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
  },
};

// ============================================
// EXPORT
// ============================================

module.exports = User;

/*
---------- RINGKASAN ALUR FILE INI ----------
Tidak jalan otomatis; dipanggil oleh controller. Setiap fungsi: pool.query(SQL, [params]) → return hasil (row, insertId, dll).

---------- ISTILAH YANG MUNCUL ----------
- Model: lapisan yang hanya mengurus akses data (query); tidak ada logika bisnis (hash, validasi).
- Placeholder ?: nilai dari array parameter menggantikan ? secara berurutan; mencegah SQL injection.
- [rows] = destructure: pool.query return [rows, fields]; kita hanya pakai rows.
- result.insertId: properti dari hasil INSERT di MySQL (id auto-increment).

---------- KESALAHAN UMUM PEMULA ----------
- Menaruh password plain di query INSERT → harus sudah di-hash di controller sebelum pass ke create().
- SELECT * lalu return rows[0] ke client (termasuk password) → kebocoran; pilih kolom yang aman (findById, findAll).
- Lupa await pool.query → dapat Promise, bukan hasil; logic salah.
*/
