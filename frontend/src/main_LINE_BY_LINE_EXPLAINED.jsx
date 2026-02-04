/*
📌 FILE: main.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   File ini adalah PINTU MASUK satu-satunya aplikasi React. Semua yang tampil di browser
   dimulai dari sini: React di-mount ke satu elemen HTML (div#root), lalu komponen App
   dan Toaster di-render di dalamnya.
🔄 Alur singkat:
   1. Import React, ReactDOM, App, CSS, dan Toaster.
   2. Cari elemen dengan id "root" di index.html.
   3. Buat "root" React di elemen itu.
   4. Render: StrictMode → di dalamnya App + Toaster (notifikasi toast).
📦 Analogi dunia nyata:
   Seperti "tombol utama" yang menyalakan seluruh gedung: listrik (React) masuk lewat
   satu panel (main.jsx), lalu menyalakan lampu (App) dan bel (Toaster) di gedung itu.
*/

// kata kunci `import` = mengambil kode dari file/modul lain supaya bisa dipakai di sini
// `React` = nama yang kita pakai di file ini untuk modul "react"
// `from "react"` = dari paket yang terpasang dengan nama "react"
import React from "react";

// `ReactDOM` = objek yang punya fungsi untuk "memasang" React ke DOM (halaman web)
// `react-dom/client` = bagian "client" (browser) dari react-dom, dipakai untuk createRoot dan render
import ReactDOM from "react-dom/client";

// `App` = komponen utama aplikasi (routing, layout, halaman)
// `from "./App"` = dari file App.jsx di folder yang sama (./)
import App from "./App";

// import file CSS agar gaya (font, warna, margin) dipakai di seluruh app
// tidak perlu variabel; efeknya cukup "dijalankan" (CSS dimuat)
import "./index.css";

// `Toaster` = komponen dari react-hot-toast untuk menampilkan notifikasi kecil (toast)
// `{ Toaster }` = kurung kurawal = kita hanya mengambil satu export bernama Toaster
import { Toaster } from "react-hot-toast";

// ReactDOM.createRoot(...) = fungsi yang membuat "akar" React di satu elemen DOM
// document.getElementById("root") = mengambil satu elemen HTML yang id-nya "root" (biasanya di index.html)
// .render(...) = metode untuk me-render (menggambar) isi React ke dalam root itu
// ( ) = memanggil fungsi; argumennya ada dua: elemen DOM, lalu .render(...) dapat satu argumen (JSX)
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> = komponen khusus React yang membantu deteksi bug dan praktik kurang baik
  // children-nya (App dan Toaster) akan di-render seperti biasa
  <React.StrictMode>
    {/* <App /> = komponen App; tag self-closing karena tidak punya anak */}
    <App />
    {/* Toaster = menampilkan notifikasi toast; position="top-right" = posisi di kanan atas layar */}
    <Toaster position="top-right" />
  </React.StrictMode>
);

/*
🔄 Alur eksekusi file (step by step)
1. Semua import dijalankan: React, ReactDOM, App, index.css, Toaster tersedia.
2. Panggil document.getElementById("root") → dapat referensi ke div#root di index.html.
3. Panggil ReactDOM.createRoot(elemen itu) → dapat objek root.
4. Panggil root.render(...) dengan satu argumen: elemen JSX.
5. React me-render: StrictMode → di dalamnya App (seluruh routing & halaman) dan Toaster.
6. Setiap kali ada toast (misal dari react-hot-toast), Toaster menampilkannya di top-right.

🧠 Ringkasan versi manusia awam
   "main.jsx itu cuma satu tugas: pas aplikasi pertama kali jalan, dia cari kotak kosong
   bernama 'root' di halaman HTML, lalu memasang seluruh aplikasi React (App + notifikasi)
   ke dalam kotak itu. Tanpa file ini, tidak ada yang tampil."

📘 Glosarium
   - import: mengambil kode dari modul lain.
   - DOM: Document Object Model; representasi halaman HTML yang bisa diubah program.
   - createRoot: (React 18) membuat "root" tempat React me-render pohon komponen.
   - render: menggambar/menampilkan komponen React ke DOM.
   - JSX: sintaks mirip HTML di dalam JavaScript (tag <App />, <Toaster />).
   - StrictMode: komponen React untuk cek potensi masalah (development).
   - Toaster: komponen untuk menampilkan notifikasi toast.

⚠️ Kesalahan umum pemula + contoh
   - Lupa punya elemen <div id="root"></div> di index.html → createRoot dapat null, error.
   - Menulis komentar di JSX pakai // → salah; di JSX pakai {/* ... */}.
   - Import App dari path salah (misal "./App.jsx" vs "./App") → bisa error tergantung bundler.
*/
