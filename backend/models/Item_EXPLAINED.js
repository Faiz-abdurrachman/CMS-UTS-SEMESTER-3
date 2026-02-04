/*
📌 FILE: models/Item.js

🧠 Fungsi file ini:
File ini mengurus semua akses ke tabel items: findAll (semua untuk admin), findAllPublic
(hanya approved + aturan 24 jam resolved), findById, findByUserId, create, update (dynamic
per kolom), updateValidationStatus, markAsResolved (dengan fallback buat kolom resolved_at/resolved_note
kalau belum ada), delete, isOwner. Pakai JOIN dengan users untuk dapat nama reporter.

🔄 Alur singkat:
1. findAll: SELECT items + reporter name, ORDER created_at DESC.
2. findAllPublic: WHERE validation_status='approved' AND (resolved_at NULL atau < 24 jam); fallback tanpa resolved_at jika error.
3. findById, findByUserId: query + JOIN users.
4. create: INSERT dengan validation_status 'pending'.
5. update: bangun SET clause dinamis dari parameter yang dikirim; kalau kosong return false.
6. markAsResolved: UPDATE resolved_at, resolved_note; kalau kolom belum ada coba ALTER TABLE lalu update lagi.
7. delete, isOwner: query sederhana.

📦 Analogi dunia nyata:
Seperti arsip pengaduan: tambah pengaduan, cari by id / by pemilik, daftar yang disetujui,
ubah status, tandai selesai, hapus. Kalau lemari (tabel) belum punya laci "resolved", sekretaris
( model ) coba buat laci dulu lalu isi.
*/

// ============================================
// FILE: models/Item.js
// DESKRIPSI: Model untuk operasi database terkait Item
// ============================================

const pool = require("../config/db");

// ============================================
// ITEM MODEL FUNCTIONS
// ============================================

const Item = {
  // Admin: semua item + nama reporter (JOIN users)
  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT i.*, u.name as reporter 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       ORDER BY i.created_at DESC`
    );
    return rows;
  },

  // Public: hanya approved; resolved_at NULL atau dalam 24 jam terakhir; fallback jika kolom resolved_at belum ada
  findAllPublic: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT i.*, u.name as reporter
         FROM items i 
         JOIN users u ON i.user_id = u.id 
         WHERE i.validation_status = 'approved'
         AND (
           i.resolved_at IS NULL 
           OR i.resolved_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
         )
         ORDER BY i.created_at DESC`
      );
      return rows;
    } catch (err) {
      if (
        err.code === "ER_BAD_FIELD_ERROR" ||
        (err.message && err.message.includes("resolved_at")) ||
        (err.message && err.message.includes("Unknown column"))
      ) {
        console.log(
          "Field resolved_at belum ada, menggunakan query tanpa resolved_at"
        );
        const [rows] = await pool.query(
          `SELECT i.*, u.name as reporter
           FROM items i 
           JOIN users u ON i.user_id = u.id 
           WHERE i.validation_status = 'approved'
           ORDER BY i.created_at DESC`
        );
        return rows;
      }
      console.error("Error in findAllPublic:", err);
      throw err;
    }
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT i.*, u.name as reporter 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       WHERE i.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  findByUserId: async (userId) => {
    const [rows] = await pool.query(
      `SELECT i.*, u.name as reporter 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       WHERE i.user_id = ? 
       ORDER BY i.created_at DESC`,
      [userId]
    );
    return rows;
  },

  // validation_status selalu 'pending' saat create
  create: async (
    userId,
    name,
    description,
    location,
    dateOccured,
    image,
    status
  ) => {
    const [result] = await pool.query(
      `INSERT INTO items (user_id, name, description, location, date_occured, image, status, validation_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, name, description, location, dateOccured || null, image, status]
    );
    return result.insertId;
  },

  // Dynamic update: hanya kolom yang dikirim (bukan undefined) yang di-SET; values urutan harus match ?
  update: async (
    id,
    name,
    description,
    location,
    dateOccured,
    image,
    status
  ) => {
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (location !== undefined) {
      updates.push("location = ?");
      values.push(location);
    }
    if (dateOccured !== undefined) {
      updates.push("date_occured = ?");
      values.push(dateOccured || null);
    }
    if (image !== undefined) {
      updates.push("image = ?");
      values.push(image);
    }
    if (status) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return false;
    }

    values.push(id);
    await pool.query(
      `UPDATE items SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return true;
  },

  updateValidationStatus: async (id, validationStatus) => {
    await pool.query("UPDATE items SET validation_status = ? WHERE id = ?", [
      validationStatus,
      id,
    ]);
  },

  // resolved_at = NOW(), resolved_note = ?; jika kolom belum ada coba ALTER TABLE lalu update lagi
  markAsResolved: async (id, resolvedNote) => {
    try {
      await pool.query(
        "UPDATE items SET resolved_at = NOW(), resolved_note = ? WHERE id = ?",
        [resolvedNote || null, id]
      );
    } catch (err) {
      if (
        err.code === "ER_BAD_FIELD_ERROR" ||
        (err.message && err.message.includes("resolved_at")) ||
        (err.message && err.message.includes("Unknown column"))
      ) {
        console.log(
          "Field resolved_at belum ada, mencoba membuat field otomatis..."
        );

        try {
          await pool.query(
            "ALTER TABLE items ADD COLUMN resolved_at TIMESTAMP NULL AFTER validation_status"
          );
          console.log("Field resolved_at berhasil dibuat");
        } catch (alterErr) {
          if (alterErr.code !== "ER_DUP_FIELDNAME") {
            console.error("Error creating resolved_at field:", alterErr);
          }
        }

        try {
          await pool.query(
            "ALTER TABLE items ADD COLUMN resolved_note TEXT NULL AFTER resolved_at"
          );
          console.log("Field resolved_note berhasil dibuat");
        } catch (alterErr) {
          if (alterErr.code !== "ER_DUP_FIELDNAME") {
            console.error("Error creating resolved_note field:", alterErr);
          }
        }

        try {
          await pool.query(
            "UPDATE items SET resolved_at = NOW(), resolved_note = ? WHERE id = ?",
            [resolvedNote || null, id]
          );
          console.log("Item berhasil ditandai sebagai resolved");
        } catch (updateErr) {
          console.error("Error updating after creating fields:", updateErr);
          throw new Error(
            "Gagal menandai item sebagai resolved. Pastikan field resolved_at dan resolved_note ada di database."
          );
        }
      } else {
        throw err;
      }
    }
  },

  delete: async (id) => {
    await pool.query("DELETE FROM items WHERE id = ?", [id]);
  },

  isOwner: async (itemId, userId) => {
    const [rows] = await pool.query("SELECT user_id FROM items WHERE id = ?", [
      itemId,
    ]);
    return rows.length > 0 && rows[0].user_id === userId;
  },
};

// ============================================
// EXPORT
// ============================================

module.exports = Item;

/*
---------- RINGKASAN ALUR FILE INI ----------
Masing-masing fungsi dipanggil controller; pool.query dengan placeholder ?; return rows/insertId/boolean. findAllPublic punya try/catch untuk fallback schema lama.

---------- ISTILAH YANG MUNCUL ----------
- JOIN: gabung tabel items dan users on user_id = id agar dapat nama reporter.
- Dynamic update: SET clause dibangun dari array updates (hanya field yang dikirim); values urutan sama dengan ?.
- ALTER TABLE: menambah kolom ke tabel yang sudah ada (untuk schema lama yang belum punya resolved_at).
- DATE_SUB(NOW(), INTERVAL 24 HOUR): waktu sekarang dikurangi 24 jam (SQL).

---------- KESALAHAN UMUM PEMULA ----------
- UPDATE tanpa cek undefined → kolom bisa ke-set null tidak sengaja; di sini pakai if (x !== undefined).
- Lupa ORDER BY di findAll/findByUserId → urutan tidak tentu.
- Mengira findAllPublic return semua status → hanya approved; admin pakai findAll.
*/
