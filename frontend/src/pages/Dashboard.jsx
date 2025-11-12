// ============================================
// FILE: src/pages/Dashboard.jsx
// DESKRIPSI: Dashboard user setelah login
// ============================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import CardItem from "../components/CardItem";
import toast from "react-hot-toast";

export default function Dashboard() {
  // State untuk items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ============================================
  // LOAD USER DATA
  // ============================================

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Jika user adalah admin yang akses dashboard user, tampilkan info
      if (parsedUser.role === "admin") {
        // Admin bisa lihat dashboard user, tapi tetap tampilkan sebagai user view
        // Tidak perlu redirect, biarkan admin lihat dashboard user juga
      }
    }
  }, []);

  // ============================================
  // FETCH ITEMS
  // ============================================

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/items");
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE DELETE ITEM
  // ============================================

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Yakin ingin menghapus item ini?")) {
      return;
    }

    try {
      await api.delete(`/items/${itemId}`);
      toast.success("Item berhasil dihapus");
      // Refresh list setelah delete
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus item");
    }
  };

  // Filter items
  const lostItems = items.filter((item) => item.status === "lost");
  const foundItems = items.filter((item) => item.status === "found");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lost & Found System</h1>
              <p className="text-blue-100">
                Selamat datang,{" "}
                <span className="font-semibold text-white">{user?.name}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/report-lost"
                className="btn btn-warning gap-2 hover:scale-105 transition-transform"
              >
                <span>📦</span> Laporkan Hilang
              </Link>
              <Link
                to="/report-found"
                className="btn btn-success gap-2 hover:scale-105 transition-transform"
              >
                <span>✅</span> Laporkan Ditemukan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Info Card */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-800">Dashboard User</p>
              <p className="text-sm text-blue-600">
                Lihat semua barang hilang dan ditemukan. Anda dapat melaporkan
                barang hilang atau ditemukan.
              </p>
            </div>
          </div>
        </div>

        {/* Lost Items */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-orange-500">🔍</span> Barang Hilang
            </h2>
            <p className="text-gray-600 mb-2">
              Barang yang dilaporkan hilang oleh pengguna
            </p>
            <div className="badge badge-warning badge-lg">
              {lostItems.length} item
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : lostItems.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">
                  Belum ada barang hilang yang dilaporkan
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  showDelete={
                    user?.role === "admin" || user?.id === item.user_id
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Found Items */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-green-500">✅</span> Barang Ditemukan
            </h2>
            <p className="text-gray-600 mb-2">
              Barang yang dilaporkan ditemukan oleh pengguna
            </p>
            <div className="badge badge-success badge-lg">
              {foundItems.length} item
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : foundItems.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">
                  Belum ada barang ditemukan yang dilaporkan
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  showDelete={
                    user?.role === "admin" || user?.id === item.user_id
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
