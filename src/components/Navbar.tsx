import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const linkClass = (path: string) =>
    location.pathname === path
      ? 'text-purple-700 border-b-2 border-purple-700 pb-1'
      : 'hover:text-purple-700';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 mb-6 flex justify-between items-center">
      <ul className="flex gap-6 font-medium text-blue-600">
        <li><Link to="/" className={linkClass('/')}>Dashboard</Link></li>

        {user?.role === 'guru' && (
          <li><Link to="/absensi" className={linkClass('/absensi')}>Absensi</Link></li>
        )}

        <li><Link to="/hasil-belajar" className={linkClass('/hasil-belajar')}>Hasil Belajar</Link></li>
        <li><Link to="/statistik" className={linkClass('/statistik')}>Statistik</Link></li>
        <li><Link to="/profil" className={linkClass('/profil')}>Profil</Link></li>

        {user?.role === 'admin' && (
          <>
            <li><Link to="/admin/santri" className={linkClass('/admin/santri')}>Data Santri</Link></li>
            <li><Link to="/admin/monitoring" className={linkClass('/admin/monitoring')}>Monitoring Bulanan</Link></li>
          </>
        )}
      </ul>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
