// ============================================
// FILE: src/pages/Home.jsx
// DESKRIPSI: Halaman home (landing page)
// ============================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import CardItem from "../components/CardItem";

export default function Home() {
  // State untuk items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH ITEMS
  // ============================================

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get("/items");
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter items menjadi 4 kategori terpisah:
  // 1. Barang Pribadi yang Hilang (lost, belum resolved)
  // 2. Menemukan Barang yang Hilang (found, belum resolved)
  // 3. Barang Telah Ditemukan (resolved - sudah ditandai admin)

  const lostItems = items.filter((item) => {
    return item.status === "lost" && !item.resolved_at;
  });

  const foundItems = items.filter((item) => {
    return item.status === "found" && !item.resolved_at;
  });

  const resolvedItems = items.filter((item) => {
    return item.resolved_at !== null;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Lost & Found System
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            Temukan barang hilang atau laporkan barang yang ditemukan
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-primary btn-lg text-sm sm:text-base"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/login"
              className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary text-sm sm:text-base"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Lost Items */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 flex flex-wrap items-center gap-2">
            <span className="text-orange-500">🔍</span>{" "}
            <span className="text-base sm:text-xl lg:text-2xl">
              Barang Pribadi yang Hilang
            </span>
            <span className="text-sm sm:text-lg font-normal text-gray-500">
              ({lostItems.length} item)
            </span>
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            <strong>Barang milik pengguna yang hilang.</strong> Laporan dibuat
            oleh pemilik barang yang kehilangan barang pribadinya. Status:{" "}
            <span className="badge badge-warning badge-sm">Hilang</span> - Belum
            ditemukan.
          </p>
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
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Found Items - Menemukan Barang yang Hilang */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 flex flex-wrap items-center gap-2">
            <span className="text-green-500">✅</span>{" "}
            <span className="text-base sm:text-xl lg:text-2xl">
              Menemukan Barang yang Hilang
            </span>
            <span className="text-sm sm:text-lg font-normal text-gray-500">
              ({foundItems.length} item)
            </span>
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Barang yang ditemukan oleh orang lain (bukan milik mereka). Menunggu
            pemilik asli.
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
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Resolved Items - Barang Telah Ditemukan */}
        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 flex flex-wrap items-center gap-2">
            <span className="text-blue-500">🎉</span>{" "}
            <span className="text-base sm:text-xl lg:text-2xl">
              Barang Telah Ditemukan
            </span>
            <span className="text-sm sm:text-lg font-normal text-gray-500">
              ({resolvedItems.length} item)
            </span>
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            <strong>
              Barang yang sudah ditandai admin sebagai ditemukan/dikembalikan ke
              pemilik.
            </strong>{" "}
            Barang ini akan otomatis hilang dari dashboard setelah 24 jam.
            Status:{" "}
            <span className="badge badge-info badge-sm">Sudah Ditemukan</span> -
            Case closed.
          </p>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : resolvedItems.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">
                  Belum ada barang yang ditandai sebagai ditemukan
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedItems.map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
