/*
📌 FILE: contexts/AuthContext.jsx

🧠 Fungsi file ini:
File ini menyediakan "state global" untuk login: user, token, loading, dan fungsi login,
register, logout. AuthProvider membungkus anak-anaknya dan memberi value (context) ke
bawah. Saat app load, useEffect baca localStorage; kalau ada token dan user, isi state
(persist login). login() dan register() panggil API, simpan token/user ke localStorage
dan state. logout() hapus storage dan state lalu redirect ke /login. Semua komponen
yang pakai useAuth() dapat value terbaru (user, login, logout, dll).

🔄 Alur singkat:
1. createContext() = buat "kotak" context. AuthProvider = komponen yang isi kotak (value) dan bungkus children.
2. useState user, token, loading; useEffect([]) baca localStorage → setUser, setToken, setLoading(false).
3. login: api.post login → setItem token & user, setState → return { success: true }.
4. register: api.post register → login() → return success.
5. logout: removeItem, set null, location.href = "/login".
6. value = { user, token, loading, login, register, logout, isAuthenticated }; return Provider dengan value.

📦 Analogi dunia nyata:
Seperti kotak pusat: siapa yang login (user), kartu masuk (token), dan petugas (login/logout).
Siapa pun di gedung bisa tanya "siapa yang login?" atau "tolong login saya" lewat useAuth().
*/

import { createContext, useState, useEffect } from "react";
import api from "../api";

// createContext() = buat objek context; nilai aslinya undefined sampai ada Provider yang set value
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // useEffect dengan [] = jalankan sekali setelah komponen mount (pasang)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post("/auth/register", { name, email, password });
      const loginResult = await login(email, password);
      if (loginResult.success) {
          return { success: true };
      }
      return { success: true, message: "Registration successful. Please login." };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/*
---------- RINGKASAN: Provider bungkus app; state user/token/loading + fungsi login/register/logout; useEffect baca localStorage; value dipakai useAuth().
---------- ISTILAH: createContext, Provider, value, useState, useEffect([]), localStorage, JSON.parse/stringify.
---------- KESALAHAN PEMULA: Memakai useAuth di komponen di luar AuthProvider; menyimpan password di state/localStorage; lupa setLoading(false) sehingga loading selamanya true.
*/
