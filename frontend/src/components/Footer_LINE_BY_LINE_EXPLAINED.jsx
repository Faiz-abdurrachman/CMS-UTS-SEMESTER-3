/*
📌 FILE: Footer.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Komponen footer (bagian bawah halaman): menampilkan nama aplikasi "Found It!", tagline,
   dan copyright dinamis (tahun sekarang). Dipakai di App.jsx di bawah konten utama.
🔄 Alur singkat:
   1. Export default function Footer dengan tidak ada props.
   2. Return JSX: footer → container → flex (judul kiri, copyright kanan).
📦 Analogi dunia nyata:
   Seperti papan nama di bawah gedung: nama toko, slogan, dan tulisan "© 2025 ...".
*/

// export default = mengekspor satu nilai utama dari file ini (komponen Footer)
// function Footer() = deklarasi fungsi bernama Footer; () = tidak ada parameter
export default function Footer() {
  // return = nilai yang dikembalikan komponen (yang akan di-render React)
  // ( ... ) = kurung agar JSX multi-baris valid
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* container = lebar maks + rata tengah; px-4 sm:px-6 lg:px-8 = padding horizontal; py-8 = padding vertikal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* flex flex-col = mobile tumpuk vertikal; md:flex-row = desktop satu baris; justify-between = ruang di antara */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-display font-bold text-primary mb-1">
              Found It!
            </h3>
            <p className="text-sm text-gray-600">
              Find lost items and report found items
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500">
              {/* © = copyright; new Date().getFullYear() = tahun saat ini (dinamis) */}
              © {new Date().getFullYear()} Found It!. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
🔄 Alur eksekusi file (step by step)
1. Komponen Footer dipanggil (dari App.jsx).
2. Return JSX: footer berisi div container, di dalamnya div flex dengan dua bagian (judul + copyright).
3. new Date().getFullYear() dihitung saat render → angka tahun (misal 2025) ditampilkan di teks copyright.
4. React me-render elemen-elemen ini ke DOM.

🧠 Ringkasan versi manusia awam
   "Footer itu satu komponen yang cuma menampilkan bagian bawah halaman: nama 'Found It!', slogan,
   dan tulisan copyright dengan tahun otomatis (tahun berjalan)."

📘 Glosarium
   - export default: satu nilai utama yang diekspor (di sini komponen Footer).
   - footer: elemen HTML untuk area kaki halaman.
   - className: atribut untuk kelas CSS (di React dipakai className, bukan class).
   - new Date().getFullYear(): mengambil tahun dari tanggal saat ini (number).
   - Tailwind: utility class seperti bg-white, flex, container (dari konfigurasi project).

⚠️ Kesalahan umum pemula + contoh
   - Menulis class= bukan className= di JSX → React memakai className karena class reserved di JS.
   - Lupa menutup tag </footer> atau </div> → error atau layout rusak.
   - Ingin tahun statis: cukup ganti dengan "2025" jika tidak butuh dinamis.
*/
