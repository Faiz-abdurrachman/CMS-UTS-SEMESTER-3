// ============================================
// FILE: src/components/Footer.jsx
// DESKRIPSI: Komponen footer untuk aplikasi
// ============================================

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-300 text-base-content p-10 mt-auto">
      <div>
        <h3 className="text-xl font-bold">Lost & Found System</h3>
        <p className="text-sm text-gray-600">
          Temukan barang hilang atau laporkan barang yang ditemukan
        </p>
      </div>
      <div>
        <p className="text-sm">
          © {new Date().getFullYear()} Lost & Found System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
