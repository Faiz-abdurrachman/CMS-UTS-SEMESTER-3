/*
📌 FILE: postcss.config.js
🧠 Fungsi: Konfigurasi PostCSS. Hanya dua plugin: tailwindcss dan autoprefixer. Diperlukan agar Vite bisa memproses @tailwind di CSS dan menambah vendor prefix.
🔄 Alur: Vite memproses file CSS → PostCSS jalan dengan plugin ini → Tailwind expand @tailwind; autoprefixer tambah -webkit-, -moz- jika perlu.
📦 Analogi: Seperti dua filter: satu mengembangkan "kode singkat" Tailwind jadi CSS lengkap, satu menambah prefiks agar cocok di berbagai browser.
*/

// ============================================
// FILE: postcss.config.js
// DESKRIPSI: Konfigurasi PostCSS (diperlukan untuk TailwindCSS)
// ============================================

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

/*
---------- RINGKASAN: Export config dengan plugins tailwindcss dan autoprefixer. Tanpa ini, @tailwind di index.css tidak ter-proses.
---------- ISTILAH: PostCSS = pemroses CSS; plugin = transform (tailwind = expand directive; autoprefixer = tambah prefix).
---------- KESALAHAN PEMULA: Menghapus file atau mengosongkan plugins → Tailwind tidak jalan, class tidak ada.
*/
