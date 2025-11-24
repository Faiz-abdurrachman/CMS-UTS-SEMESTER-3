// ============================================
// FILE: src/components/SidebarAdmin.jsx
// DESKRIPSI: Sidebar navigation untuk admin dashboard
// ============================================

import { useState } from "react";

export default function SidebarAdmin({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 btn btn-primary btn-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-base-100 shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              Admin Panel
            </h2>
            <button
              className="md:hidden btn btn-ghost btn-sm"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <ul className="menu menu-vertical w-full">
            <li>
              <button
                className={`${activeTab === "items" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("items");
                  setIsOpen(false);
                }}
              >
                <span>📋</span> Kelola Laporan
              </button>
            </li>
            <li>
              <button
                className={`${activeTab === "users" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("users");
                  setIsOpen(false);
                }}
              >
                <span>👥</span> Kelola Users
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
