/*
📌 FILE: src/components/Footer.jsx
🧠 Fungsi: Komponen footer: logo "Found It!", tagline, copyright tahun dinamis. Tidak ada state atau logic.
🔄 Alur: Di-render di App (kecuali halaman /admin). Hanya JSX presentasional.
📦 Analogi: Seperti papan nama di bawah gedung: nama aplikasi dan tahun.
*/

// ============================================
// FILE: src/components/Footer.jsx
// DESKRIPSI: Komponen footer untuk aplikasi - Modern Clean Design
// ============================================

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {/* new Date().getFullYear() = tahun saat ini (dinamis) */}
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Found It!. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
---------- RINGKASAN: Satu komponen function, return JSX footer. Tidak ada props/state.
---------- ISTILAH: Presentational component = hanya tampilan; className = Tailwind utility classes.
---------- KESALAHAN PEMULA: Menaruh logic berat di Footer; lupa mt-auto (footer menempel di bawah saat konten sedikit).
*/
