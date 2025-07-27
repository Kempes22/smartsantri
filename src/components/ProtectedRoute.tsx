import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "guru" | "santri" | "orangtua" | "admin"; // tambahkan admin
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Jika belum login, arahkan ke login
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada role yang diminta tapi tidak cocok
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Jika lolos, tampilkan konten halaman
  return <>{children}</>;
}
