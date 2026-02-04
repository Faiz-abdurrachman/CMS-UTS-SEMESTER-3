/*
📌 FILE: src/api.js

🧠 Fungsi file ini:
File ini membuat satu "instance" Axios yang dipakai untuk semua panggilan HTTP ke backend.
baseURL di-set: production pakai VITE_API_URL atau "/api"; development pakai http://localhost:5000/api.
Request interceptor: sebelum request dikirim, ambil token dari localStorage dan tambahkan
ke header Authorization (Bearer <token>). Response interceptor: kalau response 401,
hapus token dan user dari localStorage lalu redirect ke /login (logout paksa). Semua
halaman yang pakai api.get/post/put/delete otomatis dapat perilaku ini.

🔄 Alur singkat:
1. axios.create({ baseURL }) = instance dengan prefix URL.
2. interceptors.request.use: config.headers.Authorization = "Bearer " + localStorage token (jika ada).
3. interceptors.response.use: sukses → return response; error 401 → clear storage, location.href = "/login", reject(error).

📦 Analogi dunia nyata:
Seperti kurir yang selalu bawa kartu identitas (token) di setiap kiriman, dan kalau
ditolak (401) kartu dibuang lalu pulang ke kantor login (/login).
*/

// ============================================
// FILE: src/api.js
// DESKRIPSI: Konfigurasi Axios dengan interceptor untuk JWT token
// ============================================

import axios from "axios";

// import.meta.env = variabel environment yang di-set Vite; PROD = true saat build production
// baseURL = prefix untuk setiap request (api.get("/items") → GET baseURL + "/items")
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "/api" : "http://localhost:5000/api"),
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

// Dipanggil sebelum request dikirim; config = objek konfigurasi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR (Optional)
// ============================================

// Dipanggil setelah response diterima; error handler dipanggil saat response status 4xx/5xx
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============================================
// EXPORT
// ============================================

export default api;

/*
---------- RINGKASAN ALUR FILE INI ----------
Setiap api.get/post/put/delete: request interceptor tambah Authorization → kirim → response interceptor: sukses return response, 401 clear + redirect.

---------- ISTILAH YANG MUNCUL ----------
- Axios: library HTTP client (seperti fetch tapi dengan fitur interceptors, baseURL, dll).
- Interceptor: fungsi yang dipanggil sebelum request keluar atau setelah response masuk.
- localStorage: penyimpanan di browser (persisten sampai di-clear); dipakai simpan token dan user.
- Promise.reject(error): mengembalikan Promise yang gagal agar pemanggil api.get() bisa .catch().

---------- KESALAHAN UMUM PEMULA ----------
- Menaruh token di state saja tanpa localStorage → refresh halaman token hilang, user "logout".
- Lupa handle 401 di interceptor → setiap request yang 401 harus di-handle manual di tiap halaman; dengan interceptor sekali atur global.
- Salah baseURL di production (misal tetap localhost:5000) → request ke backend production gagal.
*/
