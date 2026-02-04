/*
📌 FILE: routes/itemRoutes.js

🧠 Fungsi file ini:
File ini mendefinisikan semua route untuk item (lost/found): GET semua (public), GET
my-reports (butuh auth), GET by id, POST lost/found (auth + upload), PUT update (auth + optional upload),
DELETE (auth; hanya admin yang boleh di controller). Route yang lebih spesifik (/my-reports,
/lost, /found) harus didefinisikan SEBELUM /:id agar tidak tertimpa (Express match pertama yang cocok).

🔄 Alur singkat:
1. GET / → getAll (public).
2. GET /my-reports → authenticate → getMyReports.
3. GET /:id → getById (public).
4. PUT /:id → authenticate → upload.single → updateItem.
5. POST /lost, POST /found → authenticate → upload.single → createItem.
6. DELETE /:id → authenticate → deleteItem (controller cek admin).

📦 Analogi dunia nyata:
Seperti loket: ada loket "lihat semua pengaduan" (tanpa kartu), "lihat pengaduanku" (harus kartu),
"lihat satu pengaduan", "ubah pengaduan" (kartu + form), "tambah pengaduan hilang/temuan" (kartu + form),
"hapus" (hanya petugas admin).
*/

// ============================================
// FILE: routes/itemRoutes.js
// DESKRIPSI: Routes untuk endpoint items (Lost & Found)
// ============================================

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/itemController");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ============================================
// ROUTE DEFINITIONS
// ============================================

// Public: tidak perlu token
router.get("/", ctrl.getAll);

// Urutan penting: /my-reports, /lost, /found harus di atas /:id agar "my-reports" tidak dianggap sebagai :id
router.get("/my-reports", authenticate, ctrl.getMyReports);

router.get("/:id", ctrl.getById);

// authenticate dulu (isi req.user), lalu upload (isi req.file jika ada), lalu controller
router.put("/:id", authenticate, upload.single("image"), ctrl.updateItem);

router.post("/lost", authenticate, upload.single("image"), ctrl.createItem);
router.post("/found", authenticate, upload.single("image"), ctrl.createItem);

router.delete("/:id", authenticate, ctrl.deleteItem);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;

/*
---------- RINGKASAN ALUR FILE INI ----------
Setiap request ke /api/items/* cocok satu route → middleware berurutan (auth, upload) → controller.

---------- ISTILAH YANG MUNCUL ----------
- Chaining middleware: router.get("/path", mw1, mw2, controller) = jalankan mw1 → mw2 → controller berurutan.
- upload.single("image"): satu file dari field name="image"; req.file terisi setelah middleware ini.

---------- KESALAHAN UMUM PEMULA ----------
- Menaruh router.get("/:id") di atas /my-reports → request GET /my-reports akan match /:id dengan id="my-reports", error.
- Lupa authenticate di POST /lost atau /found → req.user undefined di controller.
*/
