// ============================================
// FILE: src/components/SidebarAdmin.jsx
// DESKRIPSI: Sidebar navigation untuk admin dashboard
// ============================================

export default function SidebarAdmin({ activeTab, setActiveTab }) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-base-100 shadow-lg z-10">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-8">Admin Panel</h2>

        <ul className="menu menu-vertical w-full">
          <li>
            <button
              className={`${activeTab === "items" ? "active" : ""}`}
              onClick={() => setActiveTab("items")}
            >
              <span>📋</span> Kelola Laporan
            </button>
          </li>
          <li>
            <button
              className={`${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <span>👥</span> Kelola Users
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
