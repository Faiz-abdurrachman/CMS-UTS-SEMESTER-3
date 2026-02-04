/*
📌 FILE: MyReports.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Halaman "Laporan Saya": fetch report milik user (GET /items/my-reports), filter lost vs found,
   tampilkan dua section (Lost Items, Found Items) masing-masing dengan CardItem; link ke report-lost dan report-found.
🔄 Alur singkat:
   1. State items, loading, user; useEffect: baca user dari localStorage, fetchMyReports().
   2. fetchMyReports: api.get("/items/my-reports") → setItems; lostItems/foundItems = filter by status.
   3. Return: header, tombol Report Lost/Found, section Lost (grid CardItem atau empty + link), section Found (sama).
📦 Analogi dunia nyata:
   Seperti "lemari arsip saya": dua laci (barang hilang vs barang ditemukan), isi kartu-kartu
   laporan; kalau kosong ada tombol "Buat laporan".
*/

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import CardItem from "../components/CardItem";
import toast from "react-hot-toast";

export default function MyReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
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
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const lostItems = items.filter((item) => item.status === "lost");
  const foundItems = items.filter((item) => item.status === "found");

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mb-3">
            My Reports
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl">
            View all lost and found item reports you've created. Reports will be
            validated by admin before appearing on the public dashboard.
          </p>
        </div>
        <div className="mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/report-lost"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Report Lost Item
          </Link>
          <Link
            to="/report-found"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Report Found Item
          </Link>
        </div>
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-10 bg-primary rounded-full"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-1">
                Lost Items
              </h2>
              <p className="text-gray-600 text-sm">
                {lostItems.length} report{lostItems.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-3xl">
            Reports of your personal items that went missing. Status will change
            to "Approved" after admin validation.
          </p>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : lostItems.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">No lost item reports yet</p>
              <Link
                to="/report-lost"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200"
              >
                Report Lost Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <CardItem key={item.id} item={item} showDelete={false} />
              ))}
            </div>
          )}
        </section>
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-10 bg-accent rounded-full"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-1">
                Found Items
              </h2>
              <p className="text-gray-600 text-sm">
                {foundItems.length} report{foundItems.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-3xl">
            Reports of items you found in random places (not yours). Status will
            change to "Approved" after admin validation.
          </p>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : foundItems.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">No found item reports yet</p>
              <Link
                to="/report-found"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200"
              >
                Report Found Item
              </Link>
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

/*
🔄 Alur eksekusi: Import → MyReports() → state items/loading/user; useEffect: localStorage user, fetchMyReports (GET /items/my-reports → setItems); lostItems = filter status lost, foundItems = filter found; return header + tombol + section Lost (loading/spinner, empty+link, atau grid CardItem) + section Found (sama).
🧠 Ringkasan: Halaman "Laporan Saya": ambil data my-reports, pisah lost/found, tampilkan dua section dengan CardItem; tombol Report Lost/Found; empty state dengan link.
📘 Glosarium: /items/my-reports (API), filter, map, key={item.id}, showDelete={false}.
⚠️ Kesalahan: Lupa key di map → React warning; API my-reports butuh token (auth) → pastikan user sudah login (halaman ini protected).
*/
