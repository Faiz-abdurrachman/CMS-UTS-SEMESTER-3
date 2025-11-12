// ============================================
// FILE: src/pages/MyReports.jsx
// DESKRIPSI: Halaman untuk melihat laporan milik user sendiri
// ============================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import CardItem from "../components/CardItem";
import toast from "react-hot-toast";

export default function MyReports() {
  // State untuk items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH MY REPORTS
  // ============================================

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil user dari localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/items/my-reports");
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching my reports:", err);
      toast.error("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  // Catatan: User tidak bisa hapus laporan (hanya admin yang bisa)
  // Tombol delete sudah dihapus dari UI

  // Filter items
  const lostItems = items.filter((item) => item.status === "lost");
  const foundItems = items.filter((item) => item.status === "found");

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Laporan Saya
          </h1>
          <p className="text-gray-600">
            Lihat semua laporan barang hilang dan ditemukan yang Anda buat.
            Laporan akan divalidasi oleh admin sebelum muncul di dashboard
            public.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <Link to="/report-lost" className="btn btn-warning gap-2">
            <span>📦</span> Barang Saya Hilang
          </Link>
          <Link to="/report-found" className="btn btn-success gap-2">
            <span>✅</span> Saya Menemukan Barang
          </Link>
        </div>

        {/* Lost Items Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-warning">🔍</span> Barang Pribadi yang Hilang
            <span className="text-sm font-normal text-gray-500">
              ({lostItems.length} laporan)
            </span>
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Laporan barang pribadi Anda yang hilang. Status akan berubah menjadi
            "Approved" setelah divalidasi admin.
          </p>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : lostItems.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">
                  Belum ada laporan barang pribadi yang hilang
                </p>
                <Link to="/report-lost" className="btn btn-warning btn-sm mt-4">
                  Laporkan Barang Hilang
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <CardItem key={item.id} item={item} showDelete={false} />
              ))}
            </div>
          )}
        </section>

        {/* Found Items Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-success">✅</span> Penemuan Barang (Bukan
            Milik Anda)
            <span className="text-sm font-normal text-gray-500">
              ({foundItems.length} laporan)
            </span>
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Laporan barang yang Anda temukan di tempat random (bukan milik
            Anda). Status akan berubah menjadi "Approved" setelah divalidasi
            admin.
          </p>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : foundItems.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">
                  Belum ada laporan penemuan barang
                </p>
                <Link
                  to="/report-found"
                  className="btn btn-success btn-sm mt-4"
                >
                  Laporkan Penemuan Barang
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <CardItem key={item.id} item={item} showDelete={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
