/*
📌 FILE: src/pages/Dashboard.jsx
🧠 Fungsi: Dashboard user setelah login: sidebar (search, link Dashboard, My Report, All Items), header dengan tombol report lost/found, section Lost/Found/Resolved (fetch GET /items, filter, CardItem). Sama seperti Home tapi dengan sidebar dan tombol aksi.
🔄 Alur: useEffect fetchItems, baca user dari localStorage. lostItems/foundItems/resolvedItems + filterItems by searchQuery. Render sidebar, header, tiga section.
📦 Analogi: Seperti ruang "beranda" user: menu samping, tombol "saya hilangkan barang" / "saya nemu barang", lalu daftar seperti di home.
*/

// ============================================
// FILE: src/pages/Dashboard.jsx
// DESKRIPSI: Dashboard user setelah login - Modern Sidebar Design
// ============================================

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import CardItem from "../components/CardItem";
import toast from "react-hot-toast";

export default function Dashboard() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ============================================
  // LOAD USER DATA
  // ============================================

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
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
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  const lostItems = items.filter((item) => {
    return item.status === "lost" && !item.resolved_at;
  });

  const foundItems = items.filter((item) => {
    return item.status === "found" && !item.resolved_at;
  });

  const resolvedItems = items.filter((item) => {
    return item.resolved_at !== null;
  });

  // Search filter
  const filterItems = (itemList) => {
    if (!searchQuery) return itemList;
    const query = searchQuery.toLowerCase();
    return itemList.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
    );
  };

  // Get active route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-display font-bold">Found It!</h1>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search item by the name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:bg-white/20 focus:border-white/40 text-white placeholder-white/60 text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-accent text-primary"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="font-medium">Home</span>
            </Link>
            <Link
              to="/my-reports"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/my-reports")
                  ? "bg-accent text-primary"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium">My Report</span>
            </Link>
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/")
                  ? "bg-accent text-primary"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="font-medium">All Items</span>
            </Link>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-primary">
                  Hello, {user?.name || "User"}! What happened?
                </h2>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                to="/report-lost"
                className="px-3 sm:px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md text-center"
              >
                <span className="hidden sm:inline">I just lost my stuff</span>
                <span className="sm:hidden">Lost Item</span>
              </Link>
              <Link
                to="/report-found"
                className="px-3 sm:px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md text-center"
              >
                <span className="hidden sm:inline">I found someone stuff</span>
                <span className="sm:hidden">Found Item</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Lost Items */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 bg-primary rounded-full"></div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-1">
                  Lost Personal Items
                </h2>
                <p className="text-gray-600 text-sm">
                  {filterItems(lostItems).length} item
                  {filterItems(lostItems).length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filterItems(lostItems).length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No lost items reported yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterItems(lostItems).map((item) => (
                  <CardItem key={item.id} item={item} showDelete={false} />
                ))}
              </div>
            )}
          </section>

          {/* Found Items */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 bg-accent rounded-full"></div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-1">
                  Found Items
                </h2>
                <p className="text-gray-600 text-sm">
                  {filterItems(foundItems).length} item
                  {filterItems(foundItems).length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filterItems(foundItems).length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No found items reported yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterItems(foundItems).map((item) => (
                  <CardItem key={item.id} item={item} showDelete={false} />
                ))}
              </div>
            )}
          </section>

          {/* Resolved Items */}
          {resolvedItems.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-blue-500 rounded-full"></div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-1">
                    Resolved Items
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {resolvedItems.length} item
                    {resolvedItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resolvedItems.map((item) => (
                  <CardItem key={item.id} item={item} showDelete={false} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/*
---------- RINGKASAN: Mirip Home: fetchItems, filter lost/found/resolved, filterItems. Plus sidebar, user dari localStorage, link report-lost/report-found.
---------- ISTILAH: useLocation (pathname untuk highlight nav); isActive(path).
---------- KESALAHAN PEMULA: Fetch /items di Dashboard padahal butuh yang sama dengan Home (public approved items) — di sini memang sama, konsisten.
*/
