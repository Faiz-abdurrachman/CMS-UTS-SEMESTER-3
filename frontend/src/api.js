// ============================================
// FILE: src/api.js
// DESKRIPSI: Konfigurasi Axios dengan interceptor untuk JWT token
// ============================================

import axios from "axios";

// Buat instance axios dengan baseURL
// Semua request akan otomatis prepend baseURL
// Di production (Vercel), API dan frontend di domain yang sama, jadi pakai relative path
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "/api" : "http://localhost:5000/api"),
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

// Interceptor otomatis attach JWT token ke setiap request
// Dipanggil sebelum request dikirim ke server
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("token");

    // Jika token ada, attach ke header Authorization
    // Format: "Bearer <token>"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Jika ada error di interceptor, return error
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR (Optional)
// ============================================

// Bisa ditambahkan untuk handle error response secara global
api.interceptors.response.use(
  (response) => {
    // Jika response sukses, langsung return
    return response;
  },
  (error) => {
    // Jika error 401 (Unauthorized), mungkin token expired
    if (error.response?.status === 401) {
      // Hapus token dan redirect ke login
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
