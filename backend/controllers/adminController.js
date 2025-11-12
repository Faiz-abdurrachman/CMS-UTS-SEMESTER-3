// ============================================
// FILE: controllers/adminController.js
// DESKRIPSI: Controller untuk operasi admin
// ============================================

const User = require("../models/User");
const Item = require("../models/Item");

// ============================================
// GET ALL USERS (untuk admin)
// ============================================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// DELETE USER (untuk admin)
// ============================================

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin tidak bisa hapus dirinya sendiri
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    // Cek apakah user ada
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hapus user (akan cascade delete items-nya karena ON DELETE CASCADE)
    await User.delete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// GET ALL ITEMS (untuk admin dashboard)
// ============================================

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// UPDATE VALIDATION STATUS (untuk admin)
// ============================================

exports.updateValidationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { validation_status } = req.body;

    // Validasi status
    if (!["pending", "approved", "rejected"].includes(validation_status)) {
      return res.status(400).json({ message: "Invalid validation status" });
    }

    // Cek apakah item ada
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update validation status
    await Item.updateValidationStatus(id, validation_status);

    res.json({ message: "Validation status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// MARK ITEM AS RESOLVED (untuk admin)
// ============================================

exports.markAsResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved_note } = req.body;

    // Cek apakah item ada
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Mark item as resolved dengan keterangan
    await Item.markAsResolved(id, resolved_note || null);

    res.json({ message: "Item marked as resolved" });
  } catch (err) {
    console.error("Error in markAsResolved:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
    });

    // Berikan error message yang lebih informatif
    if (err.message && err.message.includes("resolved_at belum ada")) {
      return res.status(500).json({
        message:
          "Field resolved_at belum ada di database. Silakan jalankan script SQL: database/add-resolved-fields.sql",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ============================================
// UPDATE ITEM (untuk admin - bisa update semua)
// ============================================

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      location,
      date_occured,
      status,
      validation_status,
    } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Cek apakah item ada
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update item menggunakan model
    const updated = await Item.update(
      id,
      name,
      description,
      location,
      date_occured,
      image,
      status
    );

    // Jika ada validation_status, update juga
    if (validation_status) {
      await Item.updateValidationStatus(id, validation_status);
    }

    if (!updated && !validation_status) {
      return res.status(400).json({ message: "No fields to update" });
    }

    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// CREATE ITEM (untuk admin - bisa create item)
// ============================================

exports.createItem = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      date_occured,
      status,
      validation_status,
      user_id,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    // Jika tidak ada user_id, gunakan admin yang sedang login
    const userId = user_id || req.user.id;

    // Insert item baru ke database
    const itemId = await Item.create(
      userId,
      name,
      description,
      location,
      date_occured || null,
      image,
      status || "lost"
    );

    // Jika ada validation_status, update juga
    if (validation_status) {
      await Item.updateValidationStatus(itemId, validation_status);
    }

    res.status(201).json({
      message: "Item created successfully",
      id: itemId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// DELETE ITEM (untuk admin - bisa hapus semua)
// ============================================

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah item ada
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Hapus item
    await Item.delete(id);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// GET STATISTICS (untuk admin dashboard)
// ============================================

exports.getStatistics = async (req, res) => {
  try {
    const pool = require("../config/db");

    // Total users
    const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users");
    const totalUsers = userCount[0].count;

    // Total items
    const [itemCount] = await pool.query("SELECT COUNT(*) as count FROM items");
    const totalItems = itemCount[0].count;

    // Items by status
    const [lostCount] = await pool.query(
      "SELECT COUNT(*) as count FROM items WHERE status = 'lost'"
    );
    const totalLost = lostCount[0].count;

    const [foundCount] = await pool.query(
      "SELECT COUNT(*) as count FROM items WHERE status = 'found'"
    );
    const totalFound = foundCount[0].count;

    // Items by validation status
    const [pendingCount] = await pool.query(
      "SELECT COUNT(*) as count FROM items WHERE validation_status = 'pending'"
    );
    const totalPending = pendingCount[0].count;

    const [approvedCount] = await pool.query(
      "SELECT COUNT(*) as count FROM items WHERE validation_status = 'approved'"
    );
    const totalApproved = approvedCount[0].count;

    res.json({
      totalUsers,
      totalItems,
      totalLost,
      totalFound,
      totalPending,
      totalApproved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
