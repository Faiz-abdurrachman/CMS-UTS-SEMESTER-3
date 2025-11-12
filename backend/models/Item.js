// ============================================
// FILE: models/Item.js
// DESKRIPSI: Model untuk operasi database terkait Item
// ============================================

const pool = require("../config/db");

// ============================================
// ITEM MODEL FUNCTIONS
// ============================================

const Item = {
  // Ambil semua items dengan info reporter
  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT i.*, u.name as reporter 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       ORDER BY i.created_at DESC`
    );
    return rows;
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
