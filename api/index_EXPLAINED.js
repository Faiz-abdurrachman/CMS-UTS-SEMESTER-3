/*
📌 FILE: api/index.js

🧠 Fungsi file ini:
File ini adalah "pintu masuk" backend saat aplikasi di-deploy di Vercel (hosting serverless).
Vercel tidak menjalankan server.js langsung; dia memanggil file ini untuk setiap request
ke /api/*. Isi file ini cuma: ambil aplikasi Express yang sudah lengkap dari backend/server
lalu export. Jadi satu codebase backend dipakai untuk jalan lokal (node server.js) dan
untuk Vercel tanpa duplikasi kode.

🔄 Alur singkat:
1. require("../backend/server") → menjalankan server.js, dapat object app (Express).
2. module.exports = app → Vercel memakai app ini untuk menangani request ke /api.

📦 Analogi dunia nyata:
Seperti "penerima tamu" di gedung Vercel: tamu (request) datang ke /api, Vercel memanggil
file ini. File ini tidak bikin gedung baru; dia hanya meminjam gedung yang sudah ada
(backend/server.js) dan menyerahkan tamu ke sana.
*/

// ============================================
// FILE: api/index.js
// DESKRIPSI: Entry point untuk Vercel Serverless Functions
// ============================================

// require("../backend/server") = load file server.js di folder backend
// Hasilnya = object app (aplikasi Express) yang sudah punya semua middleware dan route
// Path ".." = naik satu folder dari api/ ke root, lalu backend/server
const app = require("../backend/server");

// Export app agar Vercel bisa memakai app untuk handle request ke /api
module.exports = app;

/*
---------- RINGKASAN ALUR FILE INI ----------
1. Load backend/server → dapat app Express.
2. Export app. Vercel memanggil file ini per request; app yang menangani.

---------- ISTILAH YANG MUNCUL ----------
- Serverless: model hosting di mana kode dijalankan per request, tidak ada server yang nyala 24 jam; Vercel menjalankan fungsi kita saat ada request.
- Entry point: file yang pertama kali dipanggil oleh platform (di sini Vercel) untuk satu fitur (API).
- require: di Node.js = load modul/file lain dan dapat nilai yang di-export (module.exports).

---------- KESALAHAN UMUM PEMULA ----------
- Salah path require (misal "./backend/server") → Error: Cannot find module. Dari api/, backend ada di "../backend".
- Mengira file ini jalan di folder backend → file ini ada di folder api/ di root project; path relatif terhadap lokasi file ini.
*/
