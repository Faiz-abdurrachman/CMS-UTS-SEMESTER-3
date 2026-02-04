/*
📌 FILE: middleware/upload.js

🧠 Fungsi file ini:
File ini mengatur cara menyimpan file upload (gambar) yang dikirim dari frontend lewat
form multipart. Pakai library Multer: file disimpan di folder uploads/, nama file =
timestamp + angka acak + ekstensi asli (agar unik). Batas ukuran 5MB. File yang di-export
adalah instance multer; di route dipakai sebagai upload.single("image") — artinya satu
field bernama "image" yang berisi file. Setelah request lewat middleware ini, req.file
akan berisi info file (filename, path, dll).

🔄 Alur singkat:
1. Tentukan UPLOAD_DIR dari env atau "uploads"; buat folder kalau belum ada.
2. Konfigurasi Multer: destination = UPLOAD_DIR; filename = Date.now()-random.ext.
3. Buat instance multer dengan storage dan limits 5MB.
4. Export instance; dipakai di route: upload.single("image").

📦 Analogi dunia nyata:
Seperti petugas penerima paket: dia terima paket (file), kasih nomor resi unik (nama file),
simpan di gudang (folder uploads), dan catat nomor resi itu (req.file.filename) agar
bagian lain bisa mencatat di database.
*/

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

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// fs.existsSync = cek folder ada/tidak; mkdirSync = buat folder; recursive: true = buat parent jika belum ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ============================================
// KONFIGURASI MULTER STORAGE
// ============================================

// diskStorage = simpan ke disk (bukan memory); destination & filename = fungsi yang dipanggil Multer per file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // cb(null, ...) = tidak error, simpan di folder ini
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png, dll
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext; // unik: waktu + acak + ext
    cb(null, name);
  },
});

// ============================================
// KONFIGURASI MULTER
// ============================================

// limits.fileSize dalam byte; 5 * 1024 * 1024 = 5MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ============================================
// EXPORT
// ============================================

// Di route: upload.single("image") = terima satu file dari field name="image"
module.exports = upload;

/*
---------- RINGKASAN ALUR FILE INI ----------
Saat request dengan multipart/form-data dan field "image": Multer parse body, simpan file ke UPLOAD_DIR dengan nama unik, isi req.file. Request lalu diteruskan ke controller.

---------- ISTILAH YANG MUNCUL ----------
- Multer: middleware Express untuk multipart/form-data (form + file upload).
- diskStorage: simpan file ke filesystem; ada juga memoryStorage (simpan di RAM).
- cb(null, value): callback "tidak ada error, pakai value ini".
- req.file: object { fieldname, originalname, filename, path, size, ... } setelah upload.single().

---------- KESALAHAN UMUM PEMULA ----------
- Frontend set header Content-Type: multipart/form-data manual tanpa boundary → backend tidak bisa parse; biarkan Axios set otomatis.
- Nama field di form tidak "image" (misal "photo") → upload.single("image") tidak dapat file, req.file undefined.
- Limit fileSize terlalu besar atau tidak di-set → risiko upload file sangat besar.
*/
