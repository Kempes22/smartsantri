import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Absensi from './pages/Absensi';
import HasilBelajar from './pages/HasilBelajar';
import Statistik from './pages/Statistik';
import Login from './pages/Login';
import Profil from './pages/Profil';
import MonitoringBulanan from "./pages/MonitoringBulanan";

export default function App() {
  const [user, setUser] = useState<any>(null);

  // Ambil data user dari localStorage saat pertama kali buka
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      {/* Navbar hanya tampil jika sudah login */}
      {user && <Navbar />}

      <Routes>
        {/* Halaman login tidak perlu proteksi */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard bisa diakses siapa saja yang sudah login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Absensi hanya bisa diakses oleh guru */}
        <Route
          path="/absensi"
          element={
            <ProtectedRoute role="guru">
              <Absensi />
            </ProtectedRoute>
          }
        />

        {/* Hasil Belajar bisa diakses guru dan santri */}
        <Route
          path="/hasil-belajar"
          element={
            <ProtectedRoute>
              <HasilBelajar />
            </ProtectedRoute>
          }
        />

        {/* Statistik bisa diakses siapa saja yang login */}
        <Route
          path="/statistik"
          element={
            <ProtectedRoute>
              <Statistik />
            </ProtectedRoute>
          }
        />

        {/* Profil user yang login */}
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />

        <Route 
           path="/admin/monitoring" 
          element={
            <ProtectedRoute role="admin">
              <MonitoringBulanan />
            </ProtectedRoute>
        }
        />

        {/* Redirect semua path tak dikenal ke Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
