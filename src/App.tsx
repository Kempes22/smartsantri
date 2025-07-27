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
import SantriData from './pages/admin/SantriData';

export default function App() {
  const [user, setUser] = useState<any>(null);

  // Ambil data user dari localStorage & pantau perubahan
  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateUser(); // pertama kali mount

    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  return (
    <Router>
      {/* Navbar hanya tampil jika sudah login */}
      {user && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/absensi" element={
          <ProtectedRoute role="guru">
            <Absensi />
          </ProtectedRoute>
        } />

        <Route path="/hasil-belajar" element={
          <ProtectedRoute>
            <HasilBelajar />
          </ProtectedRoute>
        } />

        <Route path="/statistik" element={
          <ProtectedRoute>
            <Statistik />
          </ProtectedRoute>
        } />

        <Route path="/profil" element={
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        } />

        <Route path="/admin/santri" element={
          <ProtectedRoute role="admin">
            <SantriData />
          </ProtectedRoute>
        } />

        <Route path="/admin/monitoring" element={
          <ProtectedRoute role="admin">
            <MonitoringBulanan />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
