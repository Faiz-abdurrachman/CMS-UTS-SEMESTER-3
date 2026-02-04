/*
📌 FILE: controllers/adminController.js

🧠 Fungsi file ini:
File ini menangani semua operasi yang hanya boleh dilakukan admin: daftar user (getAllUsers),
hapus user (deleteUser), daftar item (getAllItems), ubah status validasi (updateValidationStatus),
tandai selesai (markAsResolved), update/create/delete item, dan statistik (getStatistics).
Semua route admin sudah lewat middleware authenticate + isAdmin, jadi req.user pasti admin.

🔄 Alur singkat:
1. getAllUsers / getAllItems: ambil semua dari model → json.
2. deleteUser: cek bukan hapus diri sendiri → User.findById → User.delete (cascade hapus items).
3. updateValidationStatus: validasi nilai pending/approved/rejected → Item.updateValidationStatus.
4. markAsResolved: Item.markAsResolved(id, resolved_note).
5. updateItem / createItem: bisa ubah/buat item siapa saja; kalau ada validation_status juga di-update.
6. deleteItem: Item.delete(id).
7. getStatistics: beberapa query COUNT ke DB → json totalUsers, totalItems, totalLost, totalFound, totalPending, totalApproved.

📦 Analogi dunia nyata:
Seperti kantor admin: lihat daftar anggota dan pengaduan, approve/tolak pengaduan, tandai selesai,
edit/hapus data, dan lihat ringkasan statistik. Hanya yang punya akses admin yang bisa panggil.
*/

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

// Admin tidak boleh hapus dirinya sendiri; hapus user → items milik user ikut terhapus (ON DELETE CASCADE)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

// findAll = semua item (pending/approved/rejected), beda dengan findAllPublic
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

    if (!["pending", "approved", "rejected"].includes(validation_status)) {
      return res.status(400).json({ message: "Invalid validation status" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

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

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await Item.markAsResolved(id, resolved_note || null);

    res.json({ message: "Item marked as resolved" });
  } catch (err) {
    console.error("Error in markAsResolved:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
    });

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

// Admin bisa update item siapa saja; bisa sekaligus update validation_status
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

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updated = await Item.update(
      id,
      name,
      description,
      location,
      date_occured,
      image,
      status
    );

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

// user_id opsional; kalau tidak dikirim pakai req.user.id (admin yang login)
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

    const userId = user_id || req.user.id;

    const itemId = await Item.create(
      userId,
      name,
      description,
      location,
      date_occured || null,
      image,
      status || "lost"
    );

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

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

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

// Beberapa query COUNT; hasilnya object dengan totalUsers, totalItems, totalLost, totalFound, totalPending, totalApproved
exports.getStatistics = async (req, res) => {
  try {
    const pool = require("../config/db");

    const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users");
    const totalUsers = userCount[0].count;

    const [itemCount] = await pool.query("SELECT COUNT(*) as count FROM items");
    const totalItems = itemCount[0].count;

    const [lostCount] = await pool.query(
      "SELECT COUNT(*) as count FROM items WHERE status = 'lost'"
    );
    const totalLost = lostCount[0].count;

    const [foundCount] = await pool.query(
      "SELECT COUNT(*) as count FROM items WHERE status = 'found'"
    );
    const totalFound = foundCount[0].count;

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

/*
---------- RINGKASAN ALUR FILE INI ----------
Masing-masing fungsi: baca req (params, body, user) → panggil model User/Item atau pool.query →
res.json(...). getStatistics pakai pool langsung untuk COUNT.

---------- ISTILAH YANG MUNCUL ----------
- validation_status: pending / approved / rejected; hanya approved yang tampil di public.
- resolved_at / resolved_note: dit-set saat admin tandai "selesai".
- Cascade delete: hapus user → item milik user ikut terhapus (didefinisikan di schema FK).
- pool.query: jalankan SQL; hasil array [rows, fields]; COUNT pakai rows[0].count.

---------- KESALAHAN UMUM PEMULA ----------
- Lupa cek "Cannot delete yourself" → admin bisa hapus dirinya dan terkunci.
- Kirim validation_status selain pending/approved/rejected → sebaiknya validasi seperti di sini.
- Asumsi getStatistics tidak butuh try/catch → tetap bisa error (DB down, dll).
*/
