// ============================================
// FILE: models/Item.js
// DESKRIPSI: Model untuk operasi database terkait Item
// ============================================

const pool = require("../config/db");

// ============================================
// ITEM MODEL FUNCTIONS
// ============================================

const Item = {
  // Ambil semua items dengan info reporter (untuk admin - semua status)
  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT i.*, u.name as reporter 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       ORDER BY i.created_at DESC`
    );
    return rows;
  },

  // Ambil semua items untuk public dashboard
  // PENTING: Hanya items dengan validation_status = 'approved' yang dikembalikan
  // Items dengan status 'pending' atau 'rejected' TIDAK akan muncul di dashboard public
  // Items yang sudah resolved (resolved_at IS NOT NULL) akan muncul di kategori "Barang Telah Ditemukan"
  // Items yang sudah resolved lebih dari 24 jam tidak muncul
  // TIDAK mengubah status lost menjadi found - biarkan status asli tetap
  findAllPublic: async () => {
    try {
      // Query tanpa mengubah status - biarkan status asli (lost/found)
      // Frontend akan filter berdasarkan status dan resolved_at
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
      // Jika error karena field resolved_at belum ada, gunakan query tanpa resolved_at
      // Error code bisa 'ER_BAD_FIELD_ERROR' atau error message mengandung 'resolved_at'
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
      // Jika error lain, throw lagi
      console.error("Error in findAllPublic:", err);
      throw err;
    }
  },

  // Ambil item berdasarkan ID
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

  // Ambil items berdasarkan user_id (untuk MyReports)
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

  // Buat item baru
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

  // Update item
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

  // Update validation status (untuk admin)
  updateValidationStatus: async (id, validationStatus) => {
    await pool.query("UPDATE items SET validation_status = ? WHERE id = ?", [
      validationStatus,
      id,
    ]);
  },

  // Mark item as resolved (untuk admin)
  // resolvedNote: keterangan dari admin (contoh: "Barang sudah dikembalikan ke pemilik")
  markAsResolved: async (id, resolvedNote) => {
    try {
      // Coba update dengan resolved_at dan resolved_note
      await pool.query(
        "UPDATE items SET resolved_at = NOW(), resolved_note = ? WHERE id = ?",
        [resolvedNote || null, id]
      );
    } catch (err) {
      // Jika error karena field belum ada, coba buat field otomatis
      if (
        err.code === "ER_BAD_FIELD_ERROR" ||
        (err.message && err.message.includes("resolved_at")) ||
        (err.message && err.message.includes("Unknown column"))
      ) {
        console.log(
          "Field resolved_at belum ada, mencoba membuat field otomatis..."
        );

        try {
          // Coba buat field resolved_at
          await pool.query(
            "ALTER TABLE items ADD COLUMN resolved_at TIMESTAMP NULL AFTER validation_status"
          );
          console.log("Field resolved_at berhasil dibuat");
        } catch (alterErr) {
          // Jika field sudah ada atau error lain
          if (alterErr.code !== "ER_DUP_FIELDNAME") {
            console.error("Error creating resolved_at field:", alterErr);
          }
        }

        try {
          // Coba buat field resolved_note
          await pool.query(
            "ALTER TABLE items ADD COLUMN resolved_note TEXT NULL AFTER resolved_at"
          );
          console.log("Field resolved_note berhasil dibuat");
        } catch (alterErr) {
          // Jika field sudah ada atau error lain
          if (alterErr.code !== "ER_DUP_FIELDNAME") {
            console.error("Error creating resolved_note field:", alterErr);
          }
        }

        // Coba update lagi setelah field dibuat
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
        // Jika error lain, throw lagi
        throw err;
      }
    }
  },

  // Hapus item
  delete: async (id) => {
    await pool.query("DELETE FROM items WHERE id = ?", [id]);
  },

  // Cek apakah item milik user tertentu
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
