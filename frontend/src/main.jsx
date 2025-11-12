// ============================================
// FILE: src/main.jsx
// DESKRIPSI: Entry point aplikasi React
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

// ReactDOM.createRoot() membuat root untuk React 18
// document.getElementById('root') mengambil element div#root dari index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode membantu menemukan bug dan best practices
  <React.StrictMode>
    <App />
    {/* Toast notification untuk feedback user */}
    <Toaster position="top-right" />
  </React.StrictMode>
);
