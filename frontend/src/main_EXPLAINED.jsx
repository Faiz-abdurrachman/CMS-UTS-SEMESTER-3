/*
📌 FILE: src/main.jsx

🧠 Fungsi file ini:
File ini adalah titik masuk satu-satunya untuk aplikasi React. Browser load index.html,
lalu script memuat file ini. Isinya: ambil elemen div#root dari DOM, buat "root" React 18,
lalu render komponen App (dan Toaster untuk notifikasi) ke dalam root. Setelah ini,
seluruh tampilan di bawah #root dikontrol React (SPA).

🔄 Alur singkat:
1. Import React, ReactDOM, App, index.css, Toaster.
2. document.getElementById("root") = ambil div tempat React akan "pasang" aplikasi.
3. createRoot(...).render(...) = pasang pohon komponen (StrictMode > App, Toaster) ke root.
4. React mengambil alih; navigasi dan konten berikutnya di-handle oleh komponen (App, Router).

📦 Analogi dunia nyata:
Seperti memasang papan tulis (root) di dinding, lalu menggambar satu gambar besar (App) di atasnya.
Semua yang tampil di situs "hidup" di dalam gambar itu. Toaster = notifikasi kecil di pojok.
*/

// ============================================
// FILE: src/main.jsx
// DESKRIPSI: Entry point aplikasi React
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

// 1️⃣ createRoot = API React 18 untuk membuat "root" (tempat render)
// 2️⃣ document.getElementById("root") = ambil elemen <div id="root"> dari index.html
// 3️⃣ .render(...) = pasang komponen ke root; sekali pasang, React yang mengurus update selanjutnya
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode = wrapper yang di development membantu deteksi side effect; tidak mengubah tampilan
  <React.StrictMode>
    <App />
    {/* Toaster = komponen dari react-hot-toast; menampilkan notifikasi toast (sukses/error) di position top-right */}
    <Toaster position="top-right" />
  </React.StrictMode>
);

/*
---------- RINGKASAN ALUR FILE INI ----------
Load → createRoot(#root) → render(StrictMode > App + Toaster). App berisi Router dan semua halaman; Toaster menampilkan toast.

---------- ISTILAH YANG MUNCUL ----------
- Entry point: file yang pertama kali dijalankan (di sini oleh Vite lewat index.html).
- createRoot: React 18 API; dulu pakai ReactDOM.render.
- render: "gambar" komponen ke DOM; setelah itu React mengontrol isi #root.
- StrictMode: komponen React yang tidak render apa pun visual; hanya memicu pemeriksaan di development.

---------- KESALAHAN UMUM PEMULA ----------
- Lupa import index.css → gaya Tailwind dan custom tidak terbaca.
- Merender ke elemen yang tidak ada di index.html (misal getElementById("app")) → error. Harus ada <div id="root">.
- Menaruh banyak logic di main.jsx → sebaiknya logic di App atau komponen lain; main hanya "pasang" App.
*/
