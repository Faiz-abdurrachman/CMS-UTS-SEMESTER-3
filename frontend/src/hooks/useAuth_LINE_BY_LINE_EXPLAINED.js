/*
📌 FILE: useAuth.js
🧠 Fungsi file ini:
Satu "hook" (fungsi) yang dipakai komponen lain untuk mengakses data login: siapa user, token,
fungsi login/logout, dll. Isinya hanya: baca "context" AuthContext, kalau tidak ada (artinya
komponen dipakai di luar AuthProvider) lempar error, kalau ada kembalikan nilai context itu.
🔄 Alur singkat:
1. Komponen memanggil useAuth().
2. useContext(AuthContext) mengambil nilai yang diberikan AuthProvider (user, token, login, logout, dll).
3. Kalau context null/undefined → throw Error.
4. Kalau ada → return context (objek berisi user, token, login, register, logout, loading, isAuthenticated).
📦 Analogi dunia nyata:
Seperti nomor telepon "layanan info siapa yang login": kamu telepon (panggil useAuth), layanan
cek apakah kamu di dalam gedung (di dalam AuthProvider). Kalau tidak di gedung, mereka bilang
error. Kalau di gedung, mereka kasih info (siapa yang login, cara login/logout).
*/

// `import` = mengambil kode dari modul lain
// `{ useContext }` = satu hook dari React bernama useContext; dipakai untuk "membaca" nilai yang disimpan di Context
import { useContext } from "react";
// `{ AuthContext }` = objek Context yang didefinisikan di AuthContext.jsx; ini "kotak" yang isinya bisa dibaca pakai useContext
import { AuthContext } from "../contexts/AuthContext";

// `export const useAuth` = mengekspor variabel useAuth agar file lain bisa import
// `export` = bisa di-import dari file lain
// `const useAuth` = nama variabel (konvensi: hook React namanya diawali "use")
// `= () => { ... }` = variabel ini berisi fungsi tanpa parameter (arrow function)
export const useAuth = () => {
  // `const context` = variabel untuk menyimpan hasil useContext
  // `= useContext(AuthContext)` = baca nilai yang sedang di-"provide" oleh AuthProvider terdekat; kalau tidak ada Provider, hasilnya undefined
  const context = useContext(AuthContext);
  // `if (!context)` = kalau context falsy (null atau undefined) — artinya komponen ini dipakai di luar AuthProvider
  if (!context) {
    // `throw new Error(...)` = melempar error; program akan berhenti di sini dan pesan error ditampilkan; "useAuth must be used within an AuthProvider" = useAuth harus dipakai di dalam AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // `return context` = mengembalikan nilai context (objek berisi user, token, loading, login, register, logout, isAuthenticated) ke pemanggil useAuth()
  return context;
};
// `};` = tutup arrow function dan tutup deklarasi const useAuth

/*
========== 🔄 ALUR EKSEKUSI FILE (STEP BY STEP) ==========
1. File ini tidak "jalan" sendiri; dia hanya mendefinisikan fungsi useAuth.
2. Saat komponen (misal Navbar, Login) memanggil useAuth(), tubuh fungsi di atas dijalankan.
3. useContext(AuthContext) dipanggil: React cari AuthProvider terdekat di atas komponen itu di pohon komponen; kalau ada, nilai value dari Provider itu yang dikembalikan; kalau tidak ada, undefined.
4. if (!context): kalau context undefined, throw Error dan selesai (komponen yang panggil useAuth akan "crash" dengan pesan itu).
5. return context: kalau context ada, nilai itu dikembalikan ke pemanggil; pemanggil bisa pakai context.user, context.login, dll.

========== 🧠 RINGKASAN VERSI MANUSIA AWAM ==========
File ini seperti "alat baca kartu anggota": siapa pun yang panggil useAuth() akan dapat info "siapa yang login" dan "cara login/logout" — asalkan mereka memang berada di dalam "gedung" (di dalam AuthProvider). Kalau dipanggil di luar AuthProvider, akan dapat error supaya programmer tahu salah tempat.

========== 📘 GLOSARIUM ISTILAH (FILE INI) ==========
- import: mengambil kode (fungsi, variabel) dari file lain.
- export: membuat variabel/fungsi bisa dipakai dari file lain (import useAuth from ...).
- hook: fungsi React yang namanya biasa diawali "use"; dipakai di dalam komponen (bukan di luar).
- useContext: hook React untuk membaca nilai dari Context; parameter = objek Context.
- Context: mekanisme React untuk "meneruskan" data ke banyak komponen tanpa prop per level; Provider memberi nilai, useContext membaca.
- throw new Error: melempar error; eksekusi berhenti dan pesan error muncul (di development tampil di layar/konsol).

========== ⚠️ KESALAHAN UMUM PEMULA + CONTOH ==========
1. Memakai useAuth di komponen yang tidak dibungkus AuthProvider: misal di file yang render langsung <SomePage /> tanpa <AuthProvider> di atasnya. Hasil: "useAuth must be used within an AuthProvider". Solusi: pastikan di App.jsx (atau root) ada <AuthProvider> membungkus semua yang pakai useAuth.
2. Memanggil useAuth di luar komponen React: misal di file biasa const x = useAuth(); — hook hanya boleh dipanggil di dalam fungsi komponen (atau custom hook lain). Solusi: panggil useAuth hanya di dalam body function komponen (misal function Navbar() { const { user } = useAuth(); ... }).
*/
