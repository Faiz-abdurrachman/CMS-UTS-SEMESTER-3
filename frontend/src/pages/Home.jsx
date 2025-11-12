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

  // Filter items
  const lostItems = items.filter((item) => item.status === "lost");
  const foundItems = items.filter((item) => item.status === "found");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lost & Found System
          </h1>
          <p className="text-xl mb-8">
            Temukan barang hilang atau laporkan barang yang ditemukan
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn btn-primary btn-lg">
              Daftar Sekarang
            </Link>
            <Link
              to="/login"
              className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary"
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
          <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-orange-500">🔍</span> Barang Hilang
            <span className="text-lg font-normal text-gray-500">
              ({lostItems.length} item)
            </span>
          </h2>
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

        {/* Found Items */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-green-500">✅</span> Barang Ditemukan
            <span className="text-lg font-normal text-gray-500">
              ({foundItems.length} item)
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
                  Belum ada barang ditemukan yang dilaporkan
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
      </div>
    </div>
  );
}
