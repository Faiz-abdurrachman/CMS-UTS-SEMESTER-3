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

  useEffect(() => {
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

  // ============================================
  // HANDLE DELETE ITEM
  // ============================================

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) {
      return;
    }

    try {
      await api.delete(`/items/${itemId}`);
      toast.success("Laporan berhasil dihapus");
      fetchMyReports(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus laporan");
    }
  };

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
            Kelola semua laporan barang hilang dan ditemukan yang Anda buat
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <Link to="/report-lost" className="btn btn-warning gap-2">
            <span>📦</span> Laporkan Barang Hilang
          </Link>
          <Link to="/report-found" className="btn btn-success gap-2">
            <span>✅</span> Laporkan Barang Ditemukan
          </Link>
        </div>

        {/* Lost Items Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-warning">🔍</span> Barang Hilang
            <span className="text-sm font-normal text-gray-500">
              ({lostItems.length} laporan)
            </span>
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : lostItems.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">Belum ada laporan barang hilang</p>
                <Link to="/report-lost" className="btn btn-warning btn-sm mt-4">
                  Buat Laporan
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  showDelete={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Found Items Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-success">✅</span> Barang Ditemukan
            <span className="text-sm font-normal text-gray-500">
              ({foundItems.length} laporan)
            </span>
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : foundItems.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">
                  Belum ada laporan barang ditemukan
                </p>
                <Link
                  to="/report-found"
                  className="btn btn-success btn-sm mt-4"
                >
                  Buat Laporan
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  showDelete={true}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
