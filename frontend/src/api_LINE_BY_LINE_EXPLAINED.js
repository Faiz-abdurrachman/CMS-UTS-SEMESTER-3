/*
📌 FILE: api.js (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Membuat satu "instance" axios yang sudah dikonfigurasi: base URL API, dan interceptor
   yang otomatis menempelkan token JWT ke setiap request serta menangani response 401
   (logout + redirect ke login).
🔄 Alur singkat:
   1. Import axios.
   2. Buat instance axios dengan baseURL (dari env atau default localhost/prod).
   3. Tambah request interceptor: ambil token dari localStorage, jika ada set header Authorization.
   4. Tambah response interceptor: sukses → return response; error 401 → hapus token & user, redirect /login.
   5. Export instance api.
📦 Analogi dunia nyata:
   Seperti resepsionis yang setiap kali kamu mau kirim surat (request), dia tempelkan stempel
   identitas (token) dan mengirim ke alamat yang benar (baseURL). Kalau surat ditolak karena
   identitas kadaluarsa (401), dia buang stempel dan mengantarmu ke loket login.
*/

// import = mengambil modul
// axios = library untuk melakukan HTTP request (GET, POST, dll) dari browser/Node
import axios from "axios";

// const = variabel yang tidak boleh di-assign ulang
// api = nama variabel yang akan menyimpan "instance" axios kita
// axios.create({ ... }) = membuat instance axios baru dengan konfigurasi sendiri (bukan pakai default global)
// { } = objek konfigurasi
// baseURL = properti yang nilainya dipakai sebagai awalan URL untuk setiap request
const api = axios.create({
  // baseURL: nilai di sebelah kanan
  // import.meta.env = objek yang berisi variabel environment di Vite (env yang diawali VITE_)
  // VITE_API_URL = kalau di .env kita set VITE_API_URL=..., itu dipakai
  // || = operator "ATAU": jika kiri falsy (undefined, null, ""), pakai nilai kanan
  // import.meta.env.PROD = true kalau build production
  // ? "/api" : "http://localhost:5000/api" = jika production pakai "/api" (relative), jika development pakai localhost:5000/api
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "/api" : "http://localhost:5000/api"),
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

// api.interceptors.request = akses bagian "request interceptor" dari instance api
// .use(...) = mendaftarkan fungsi yang akan dipanggil SEBELUM request benar-benar dikirim
// (config) => { ... } = fungsi pertama: dipanggil dengan objek config (berisi URL, headers, dll); kita bisa ubah config
// (error) => { ... } = fungsi kedua: dipanggil kalau ada error sebelum request keluar
api.interceptors.request.use(
  (config) => {
    // const token = ... = variabel lokal
    // localStorage = penyimpanan di browser yang persisten (tetap ada setelah tab ditutup)
    // .getItem("token") = ambil nilai yang disimpan dengan kunci "token"; kembalikan string atau null
    const token = localStorage.getItem("token");

    // if (token) = jika token ada (truthy), jalankan blok di dalam
    // config.headers = objek header HTTP untuk request ini
    // Authorization = header standar untuk mengirim kredensial (biasanya "Bearer <token>")
    // `Bearer ${token}` = template literal: string yang menyisipkan nilai token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // return config = mengembalikan config (yang mungkin sudah kita ubah) agar request lanjut dengan config itu
    return config;
  },
  (error) => {
    // jika ada error di fase request (misal config invalid), tolak promise dengan error yang sama
    // Promise.reject(error) = membuat promise yang gagal dengan alasan error
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR (Optional)
// ============================================

// api.interceptors.response = akses bagian "response interceptor"
// .use(...) = dipanggil SETELAH response diterima dari server (atau saat ada error jaringan/response)
api.interceptors.response.use(
  (response) => {
    // response = objek berisi data, status, headers dari server
    // jika sukses, kita tidak ubah apa-apa; langsung kembalikan response
    return response;
  },
  (error) => {
    // error.response = objek response dari server (kalau server sempat merespons)
    // error.response?.status = optional chaining: akses status hanya jika error.response ada; kalau tidak, undefined
    // 401 = Unauthorized (biasanya token invalid/expired)
    if (error.response?.status === 401) {
      // localStorage.removeItem("token") = hapus item dengan kunci "token"
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // window.location = objek yang merepresentasikan URL halaman saat ini
      // .href = mengubahnya akan membuat browser melakukan navigasi (load halaman baru)
      // "/login" = path ke halaman login; seluruh app akan reload
      window.location.href = "/login";
    }
    // tetap tolak promise dengan error agar pemanggil api.post/get bisa menangkap di catch
    return Promise.reject(error);
  }
);

// ============================================
// EXPORT
// ============================================

// export default api = mengekspor variabel api sebagai default export
// file lain: import api from "./api"; lalu api.get("/items"), api.post("/auth/login", data), dll
export default api;

/*
🔄 Alur eksekusi file (step by step)
1. Import axios.
2. Buat instance api dengan baseURL dari env atau default.
3. Daftarkan request interceptor: setiap request akan lewat sini; token dari localStorage (jika ada) ditambah ke header Authorization; config dikembalikan.
4. Daftarkan response interceptor: response sukses dikembalikan apa adanya; response error (misal 401) → hapus token & user, redirect /login, lalu reject promise.
5. Export api. Saat komponen/hook memanggil api.get(...) atau api.post(...), request otomatis pakai baseURL dan token; 401 ditangani global.

🧠 Ringkasan versi manusia awam
   "api.js itu satu kotak pengiriman surat (axios) yang sudah diatur: alamat tujuan (baseURL),
   dan setiap surat otomatis dapat stempel token. Kalau server bilang 'unauthorized' (401),
   kotak itu buang stempel dan mengirim kita ke halaman login."

📘 Glosarium
   - axios: library HTTP client (request/response).
   - instance: satu objek axios dengan konfigurasi sendiri (create).
   - baseURL: URL dasar yang di-prepend ke path (misal path "/auth/login" → baseURL + path).
   - interceptor: fungsi yang dijalankan sebelum request keluar atau setelah response masuk.
   - localStorage: penyimpanan key-value di browser (persisten).
   - 401: status HTTP Unauthorized (biasanya token salah/kadaluarsa).
   - export default: satu nilai utama yang diekspor dari modul.

⚠️ Kesalahan umum pemula + contoh
   - Lupa set token ke localStorage setelah login → request tidak bawa token, server bisa 401.
   - Pakai axios.get langsung tanpa instance ini → baseURL dan interceptor tidak dipakai.
   - Redirect dengan React Router (navigate) di sini sulit karena ini bukan komponen; pakai window.location atau kirim callback dari App.
*/
