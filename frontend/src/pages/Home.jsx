// ============================================
// FILE: src/pages/Home.jsx
// DESKRIPSI: Halaman home (landing page) - Modern Redesign
// ============================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import CardItem from "../components/CardItem";

export default function Home() {
  // State untuk items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight text-accent">
              Lost something?
              <br />
              We've got your back!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 font-light">
              Look for lost item, found item, and report them
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Find your stuff here →
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all duration-200 font-semibold"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search item by the name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
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
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 pb-20">
        {/* Lost Items */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-12 bg-primary rounded-full"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary mb-1">
                Lost Personal Items
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {filterItems(lostItems).length} item
                {filterItems(lostItems).length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl text-sm sm:text-base leading-relaxed">
            Items that belong to users and went missing. Reports are created by
            item owners who lost their personal belongings.
          </p>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filterItems(lostItems).length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "No items found matching your search"
                  : "No lost items reported yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItems(lostItems).map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Found Items */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-12 bg-accent rounded-full"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary mb-1">
                Found Items
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {filterItems(foundItems).length} item
                {filterItems(foundItems).length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl text-sm sm:text-base leading-relaxed">
            Items found by others (not their property). Waiting for the original
            owner.
          </p>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filterItems(foundItems).length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "No items found matching your search"
                  : "No found items reported yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItems(foundItems).map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Resolved Items */}
        {resolvedItems.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary mb-1">
                  Resolved Items
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {resolvedItems.length} item
                  {resolvedItems.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-8 max-w-3xl text-sm sm:text-base leading-relaxed">
              Items that have been marked by admin as found/returned to the
              owner.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedItems.map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
